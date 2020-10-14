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

const urladdress = "http://54.164.243.161/"; //url address for api
const stationAddress = "https://api.openchargemap.io/v3/poi/?output=json&countrycode=FI";


export default class App extends Component {

  constructor ()
  {
    super();
    this.state =
    {
      stations: [], //all the stations, comes from api.openchargemap...
      userInfo: { //info, of the logged in user
        userId: null,
        username: null,
        password: null,
        fname: null,
        lname: null
      },
      userLogged: false,  //status is there user logged or not
      selectedStation: {  //when clicking a station from the marker, the info comes here
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
      regUserName: "",  //these are for the registration, these all shoul be in single regInfo 
      regPassword: "",
      regPasswordConfirmation: "",
      regFName: "",
      regLName: "",
      checkTermsConditions: false, //to see if the checkbox for terms and conditions are there
      myCharges: [], //this has all the values of logged in users previous charges
      searchStation: "", //this is for searchfield for searching a station.
      startingCode: null, //users input for the starting charger code
      priceType: null, //type of the price of a started charging
      unitPrice: null, //unit of the price of a started charging
      chargeOngoing: false //to check whether there is a charge going or not
    };
  }

  componentDidMount() {
    axios.get(stationAddress)
    .then((response) => {
      this.setState({stations: response.data})
      console.log(response.data);
    });
  }

  //registering a user with username, password, first name and last name
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
 
  //pressing a marker, setting the markers station information to selectedstation
  selectStation = (station)=>{
    this.setState({selectedStation: {
      stationid: station.ID,
      name: station.AddressInfo.Title,
      streetaddress: station.AddressInfo.AddressLine1,
      zipCode: station.AddressInfo.Postcode,
      city: station.AddressInfo.Town,
      qntSlow: station.Connections.filter(field => field.LevelID == 2).reduce((count, sum) => count + sum.Quantity, 0),
      priceSlow: null,
      qntFast: station.Connections.filter(field => field.LevelID == 3).reduce((count, sum) => count + sum.Quantity, 0),
      pricefast: null,
      longitude: station.AddressInfo.longitude,
      lattitude: station.AddressInfo.latitude
    }})
  }
  
  //get user info into state with username
  getUserInfo = (username) => {
    axios.get(urladdress + 'users/' + username)
    .then((response) => {
      this.setState({userInfo: {
        userId: response.data[0].userid,
        username: username,
        fname: response.data[0].fname,
        lname: response.data[0].lname
      }})
    })
  }
  
  //get previous charges based on username
  prevChargesOnId = (username, password) => {
    axios.get(urladdress + "mycharges/"+ username,{
      auth:{
        username,
        password
      }
    })
    .then(response => {
      this.setState({myCharges: response.data});
    })
  }

  //check if there is ongoing charge, used after login
  checkOngoingCharges = (userId) => {
    axios.get(urladdress + "charge/"+ userId)
    .then(response => {
      if(response.data.found) {
        //ongoing charge in database, setting it to state
        this.setState({chargeOngoing: true});
      }
    })
  }

  //this executes after clicking login
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
      this.checkOngoingCharges(this.state.userInfo.userId);
      history.push('/map');
    })
    .catch(error => console.log(error));
  }

  //this executes after logout
  logout = () => {
    this.setState({userLogged: false});
    this.setState({userId: null});
    this.setState({password: null});
    this.setState({fname: null});
    this.setState({lname: null});
    history.replace('/map');
    this.setState({chargeOngoing: false})
  }

  //takes care of some input fields and what is typed there
  updateSearch = (event) => {
    const name = event.target.name;
    this.setState({[name]: event.target.value.substr(0,20)});
  }

  //checking terms and conditions checkbox
  ChangeCheckTermsConditions = () => {
    this.setState({checkTermsConditions: !this.state.checkTermsConditions});
  }

  //creates a new row for startcharges when starting to charge
  startCharge = () => {
    axios.post(urladdress + 'allcharges',
    {
        startTime: Date.now(),
        priceType: this.state.priceType,
        unitPrice: this.state.unitPrice,
        userid: this.state.userInfo.userId,
        stationid: this.state.selectedStation.stationid,
        chargerCode: this.state.startingCode
    },)
    .then(response => {
      this.setState({chargeOngoing: true});
    })
  }

  //takes care of station search input field and what is typed there
  stationSearch = (event) => {
    this.setState({searchStation: event.target.value});
  }

  //checking if there is ongoing charge when the user tries to start charging
  isThereChargeOngoing = (userId) => {
    axios.get(urladdress + "charge/"+ userId)
    .then(response => {
      if(response.data.found) {
        //ongoing charge in database
        this.setState({chargeOngoing: true});
        alert("you have a car charging. Stop that first");
      }
      else{
        //no ongoing charges in database, creating new 
        console.log("startin new charge");
        this.startCharge();
        
      }
    })
  }

  //checking if the code given by user is valid
  isChargerCodeValid = () => {
    const validChargerCodes = [{code:"FR33", type:0, price:0}, {code:"5L0W", type:1, price: 0.2}, {code:"F45T", type:2, price: 0.18}];
    if(validChargerCodes.some( code => 
      code.code == this.state.startingCode  //if the code from the list matches the code the user gave
      )) {
        let typeFinder = validChargerCodes.find(code => //finding the right object with the code user gave
        { return code.code ==this.state.startingCode})
        this.setState({priceType: typeFinder.type, unitPrice: typeFinder.price}) //set state for the charging type, price
        this.isThereChargeOngoing(this.state.userInfo.userId); //going to check if there is charges already going, could be before validating the chargercode
      } else {
        alert("Wrong charging code, please try again!")
      };
  }

  //stopping the ongoing charge
stopOngoingCharge = (chargeid, chargeData) => {
  //calculate totalprice based on pricetype
  let stopTime= Date.now(); //current time
  let electricityUsed= null;
  let totalPrice = null
  if(chargeData.priceType == 0) { //price type 0 means free
    totalPrice = 0.00
  } else if(chargeData.priceType == 1) {
    totalPrice = (stopTime-chargeData.startTime)/60/1000 *chargeData.unitPrice; //check the rounding
  } else if(chargeData.priceType == 2) {
    electricityUsed = 30*((stopTime-chargeData.startTime)/3600/1000) //change 30 to be PowerKW from the data
    totalPrice = electricityUsed*chargeData.unitPrice; 
  }
  axios.put(urladdress + "charge/update/" + chargeid, //update the existing row in database with the stopping information
  {
    stopTime: stopTime,
    electricityUsed: electricityUsed,
    totalPrice: totalPrice
  })
  this.setState({chargeOngoing:false})
  alert("THANKS FOR USING OUR PERFECT SERVICE, you spent "+ totalPrice + " euros") //totalprice should be rounded for two decimals
}

  //getting the correct data from database to stop charge
  stopCharge = (userid) => {
    axios.get(urladdress + "charge/"+ userid)
    .then(response => {
      this.stopOngoingCharge(response.data.chargeData.chargeid, response.data.chargeData);
    })
  }


  render() {
    return (
      <Router>
        <Switch>
          <div className="appContainer">
            <div>
              <Header userLogged={this.state.userLogged} 
                      logout={this.logout}/>
            </div>
            <div className="mapAndStation">
              <Route path="/map" component={()=> <Map stations={this.state.stations} 
                  selectStation={this.selectStation} 
                  selectedStation={this.state.selectedStation}
                  userLogged={this.state.userLogged}
                  startCharge={this.startCharge}
                  searchStation={this.state.searchStation}
                  stationSearch={this.stationSearch}
                  startingCode={this.state.startingCode}
                  updateSearch={this.updateSearch}
                  isChargerCodeValid ={this.isChargerCodeValid}
                  chargeOngoing={this.state.chargeOngoing}
                  stopCharge={this.stopCharge}
                  userInfo={this.state.userInfo}
                  userLogged={this.state.userLogged} />}
              />
            </div>
            <div>
              <Route path="/login" component={()=> <Login loginClick={this.loginClick}/>}
              />
            </div>
            <div>
              <Route path="/register" component={()=> <Registerform registerUser={this.registerUser} 
                            updateSearch={this.updateSearch} 
                            regUserName={this.state.regUserName}
                            regPassword={this.state.regPassword}
                            regFName={this.state.regFName}
                            regLName={this.state.regLName}
                            checkTermsConditions={this.state.checkTermsConditions}
                            ChangeCheckTermsConditions={this.ChangeCheckTermsConditions}/>}
              />
            </div>
            <div>
              <Route path="/myaccount" component={()=> <Myaccount userInfo={this.state.userInfo}
                        userLogged={this.state.userLogged}
                        myCharges={this.state.myCharges}/>}
                        />
            </div>
          </div>
        </Switch>
      </Router>
    )
  }
}

