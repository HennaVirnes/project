import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

export default class myaccount extends Component {
  render(props) {
    return (
      <Route path="/myaccount">
        <div>
          Hello, and welcome back {this.props.userInfo.fname}!
        </div>
      </Route>
    )
  }
}
