import React from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom"; 

export default function login() {
  return (
    <Route path="/login">
      <div>
        <div>Username <input type="text"/></div>
        <div>Password <input type="text"/></div>
        <button>Login</button>
        <div><Link to="/register">Don't have an account? Register here</Link></div>
      </div>
    </Route>
  )
}
