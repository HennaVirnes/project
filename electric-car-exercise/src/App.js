import React, {Component} from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom"; 
import Login from './components/login';
import Header from './components/header';
import Map from './components/map';
import Registerform from './components/registerform';
import './App.css'; 
import axios from 'axios';
import Myaccount from './components/myaccount';

const urladdress = "http://localhost:4000/";


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
        qntslow: null,
        priceSlow: null,
        qntfast: null,
        pricefast: null,
        image: null,
        longitude: null,
        lattitude: null
      }
    };
  }

  componentDidMount() {
    axios.get(urladdress + 'stations')
    .then((response) => {
      this.setState({stations: response.data})
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
    this.setState({selectedStation: station})
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
      this.setState({userLogged: true})
      this.getUserInfo(username);
    })
    .catch(error => console.log(error));
  }

  

  logout = () => {
    this.setState({userLogged: false});
  }

  render() {
    return (
      <Router>
      <div className="appContainer">
        <div>
          <Header userLogged={this.state.userLogged} logout={this.logout}/>
        </div>
        <div className="mapAndStation">
          <Map stations={this.state.stations} selectStation={this.selectStation} selectedStation={this.state.selectedStation}/>
        </div>
        <div>
          <Login loginClick={this.loginClick}/>
        </div>
        <div>
          <Registerform registerUser={this.registerUser}/>
        </div>
        <div>
          <Myaccount userInfo={this.state.userInfo}/>
        </div>
      </div>
    </Router>
    )
  }
}

