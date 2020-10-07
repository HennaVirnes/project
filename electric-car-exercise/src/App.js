import React, {Component} from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom"; 
import Login from './components/login';
import Header from './components/header';
import Map from './components/map';
import Registerform from './components/registerform';
import Station from './components/station';
import './App.css'; 
import axios from 'axios';

const urladdress = "http://localhost:4000/";


export default class App extends Component {

  constructor ()
  {
    super();
    this.state =
    {
      stations: [],
      userInfo: null,
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
    console.log('are we getting this function?')
    this.setState({userInfo: {
      username,
      password,
      fname,
      lname
    }});
    console.log(this.userInfo);
  }

  selectStation = (station)=>{
    console.log("station " + station.stationid +" selected")
    this.setState({selectedStation: station})
  }

  getSelectedStationInfo = (stationId) =>
    axios.get(urladdress + 'stations/:' + stationId)
    .then((reponse) => {
    
    })

  render() {
    return (
      <Router>
      <div className="appContainer">
        <div>
          <Header/>
        </div>
        <div>
          <Map stations={this.state.stations} selectStation={this.selectStation}/>
        </div>
        <div>
          <Login/>
        </div>
        <div>
          <Registerform registerUser={this.registerUser}/>
        </div>
        <div>
          <Station selectedStation={this.state.selectedStation}/>
        </div>
      </div>
    </Router>
    )
  }
}

