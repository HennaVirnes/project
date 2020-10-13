import React, {Component} from 'react';
import { BrowserRouter as Router, Switch, Route, Link} from "react-router-dom"; 
import history from 'history/browser';
import Login from './components/login';
import Header from './components/header';
import Map from './components/map';
import Registerform from './components/registerform';
import './App.css'; 
import axios from 'axios';
import Myaccount from './components/myaccount';

const urladdress = "http://localhost:4000/";
const stationAddress = "https://api.openchargemap.io/v3/poi/?output=json&countrycode=FI";


export default class App extends Component {

  constructor ()
  {
    super();
    this.state =
    {
      stations: [],
      userInfo: {
        userId: null,
        username: null,
        password: null,
        fname: null,
        lname: null
      },
      userLogged: false,
      selectedStation: {
        stationid: null,
        name: null,
        streetaddress: null,
        zipCode: null,
        city: null,
        qntSlow: null,
        priceSlow: null,
        qntFast: null,
        pricefast: null,
        longitude: null,
        lattitude: null
      },
      regUserName: "",
      regPassword: "",
      regPasswordConfirmation: "",
      regFName: "",
      regLName: "",
      checkTermsConditions: false,
      myCharges: [],
      activeCharger:{
        stationid: null,
        startTime: null,
        stopTime: null,
        totalTime: 0,
        electricityUsed: null,
        totalPrice: null
      },
      searchStation: ""
    };
  }

  componentDidMount() {
    axios.get(stationAddress)
    .then((response) => {
      this.setState({stations: response.data})
      console.log(response.data);
    });
  }

  registerUser = (username, password, fname, lname) => {
    axios.post(urladdress + 'register', {
      username,
      password,
      fname,
      lname
    })
    .then((response => {
      console.log("new user created");
    }))
    .catch(error => {
     alert("incorrect username or password, both must be strings and username more than 5 long and password more than 6 characters long");
    })
  };

  selectStation = (station)=>{
    console.log("station " + station.stationid +" selected")
    this.setState({selectedStation: {
      stationid: station.ID,
      name: station.AddressInfo.Title,
      streetaddress: station.AddressInfo.AddressLine1,
      zipCode: station.AddressInfo.Postcode,
      city: station.AddressInfo.Town,
      qntSlow: station.Connections.filter(pekka => pekka.LevelID == 2).reduce((count, mirkku) => count + mirkku.Quantity, 0),
      priceSlow: null,
      qntFast: station.Connections.filter(pekka => pekka.LevelID == 3).reduce((count, mirkku) => count + mirkku.Quantity, 0),
      pricefast: null,
      longitude: station.AddressInfo.longitude,
      lattitude: station.AddressInfo.latitude
    }})
    console.log(this.state.selectedStation.qntslow)
    console.log(station.Connections.filter(pekka => pekka.LevelID == 2))
    let newActiveCharger = {...this.state.activeCharger, stationid: station.stationid};
    this.setState({activeCharger: newActiveCharger});
  }

  getSelectedStationInfo = (stationId) =>
    axios.get(urladdress + 'stations/:' + stationId)
    .then((reponse) => {
    console.log("this does nothing yet :) API missing")
  })

  
  getUserInfo = (username) => {
    axios.get(urladdress + 'users/' + username)
    .then((response) => {
      this.setState({userInfo: {
        userid: response.data[0].userid,
        username: username,
        fname: response.data[0].fname,
        lname: response.data[0].lname
      }})
    })
  }
  
  prevChargesOnId = (username, password) => {
    axios.get(urladdress + "mycharges/"+ username,
    {auth:{
      username,
      password
    }})
    .then(response => {
      this.setState({myCharges: response.data});
    })
  }

  loginClick = (username, password) => {
    axios.get( urladdress +'login', 
                {
                  auth: {
                    username,
                    password
                  }
                })
    .then(response => {
      console.log('Login succesfull with user ' +username);
      this.setState({userLogged: true});
      this.getUserInfo(username);
      this.prevChargesOnId(username, password);
    })
    .catch(error => console.log(error));
  }

  logout = () => {
    this.setState({userLogged: false});
    this.setState({userId: null});
    this.setState({password: null});
    this.setState({fname: null});
    this.setState({lname: null});
    history.replace('/map');
  }

  updateSearch = (event) => {
    const name = event.target.name;
    this.setState({[name]: event.target.value.substr(0,20)});
  }

  ChangeCheckTermsConditions = () => {
    this.setState({checkTermsConditions: !this.state.checkTermsConditions});
  }

  startCharge = () => {
    var date =  Date.now();
    let newActiveCharger = {...this.state.activeCharger, startTime: date };
    this.setState({activeCharger: newActiveCharger});
    console.log(date);
  }

  stationSearch = (event) => {
    this.setState({searchStation: event.target.value});
  }

  render() {
    return (
      <Router>
      <div className="appContainer">
        <div>
          <Header userLogged={this.state.userLogged} 
                  logout={this.logout}
              />
        </div>
        <div className="mapAndStation">
          <Map stations={this.state.stations} 
               selectStation={this.selectStation} 
               selectedStation={this.state.selectedStation}
               userLogged={this.state.userLogged}
               activeCharger={this.state.activeCharger}
               startCharge={this.startCharge}
               searchStation={this.state.searchStation}
               stationSearch={this.stationSearch} />
        </div>
        <div>
          <Login loginClick={this.loginClick}/>
        </div>
        <div>
          <Registerform registerUser={this.registerUser} 
                        updateSearch={this.updateSearch} 
                        regUserName={this.state.regUserName}
                        regPassword={this.state.regPassword}
                        regFName={this.state.regFName}
                        regLName={this.state.regLName}
                        checkTermsConditions={this.state.checkTermsConditions}
                        ChangeCheckTermsConditions={this.ChangeCheckTermsConditions}/>
        </div>
        <div>
          <Myaccount userInfo={this.state.userInfo}
                     userLogged={this.state.userLogged}
                     myCharges={this.state.myCharges}/>
        </div>
      </div>
    </Router>
    )
  }
}

