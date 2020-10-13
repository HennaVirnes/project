import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";

export default class myaccount extends Component {
  render() {

    let output = <></>
    if(this.props.userLogged === false) {
      output= <Redirect to="/login" />
    }
  
    return (
      <Route path="/myaccount">
        <div>
          Hello, and welcome back {this.props.userInfo.fname}!
          {output}
        </div>
        <div>Here are your previous charges:
          <table>
            <thead>
              <tr>
                <th>Started</th>
                <th>Stopped</th>
                <th>Used Electricity</th>
                <th>Price total</th>
                <th>station</th>
              </tr>
            </thead>
            <tbody>
              {this.props.myCharges.map(oneCharge => ( 
                <tr key={oneCharge.chargeid}>
                  <td>{oneCharge.startTime}</td>
                  <td>{oneCharge.stopTime}</td>
                  <td>{oneCharge.electricityUsed}</td>
                  <td>{oneCharge.totalPrice}</td>
                  <td>{oneCharge.stationid}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Route>
    )
  }
}



