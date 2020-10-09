import React from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom"; 

export default function login(props) {

  function login(event) {
    event.preventDefault();
    props.loginClick(
      event.target['username'].value,
      event.target['password'].value,
    );
  }

  return (
    <Route path="/login">
      <div>
        <form onSubmit={login}>
          <div>Username <input type="text" name="username"/></div>
          <div>Password <input type="password" name="password"/></div>
          <input type="submit" value="Login"></input>
          <div><Link to="/register">Don't have an account? Register here</Link></div>
        </form>
      </div>
    </Route>
  )
}
