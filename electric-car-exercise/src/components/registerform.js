import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";


export default function registerform(props) {
  
  function register(event) {
    event.preventDefault();
    props.registerUser(
      event.target['username'].value,
      event.target['password'].value,
      event.target['fname'].value,
      event.target['lname'].value,
    );
  }

  function cancelReg(event) {
    event.preventDefault();
  }
  
  return (
    <Route path="/register">
      <div>
        <form onSubmit={register}>
          <div>username<input type="text" name="username"></input> </div>
          <div>password<input type="text" name="password"></input> </div>
          <div>password again<input type="text" name="passwordConfirmation"></input> </div>
          <div>firstname<input type="text" name="fname"></input> </div>
          <div>lastname<input type="text" name="lname"></input> </div>
          <div><input type="checkbox"></input> I agree terms and conditions </div>
          <div><button onClick={ cancelReg }>cancel</button></div>
          <div><input type="submit" value="submit"></input></div>
        </form>
      </div>
    </Route>
  )
}
