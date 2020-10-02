import React, {Component} from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom"; 
import Login from './components/login';
import Header from './components/header';
import Map from './components/map';
import Registerform from './components/registerform';
import './App.css'; 
import axios from 'axios';

export default class App extends Component {

  constructor ()
  {
    super();
    this.state =
    {
      stations: [],
    };
  }

  componentDidMount() {
    axios.get('http://localhost:4000/stations')
    .then((response) => {
      this.setState({stations: response.data.stations})
    });
  }

  render() {
    return (
      <Router>
      <div className="appContainer">
        <div>
          <Header/>
        </div>
        <div>
          <Map/>
        </div>
        <div>
          <Login/>
        </div>
        <div>
          <Registerform/>
        </div>
      </div>
    </Router>
    )
  }
}

