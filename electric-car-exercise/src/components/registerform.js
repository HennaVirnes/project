import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import history from 'history/browser';


export default function registerform(props) {
  
  function register(event) {
    event.preventDefault();
    props.registerUser(
      event.target['regUserName'].value,
      event.target['regPassword'].value,
      event.target['regFName'].value,
      event.target['regLName'].value,
    );
  }

  function cancelReg(event) {
    event.preventDefault();
    history.push('/map');
  }

  const isEnabled = props.regUserName.length > 5 &&
                    props.regPassword.length > 6 &&
                    props.regFName.length > 1 &&
                    props.regLName.length > 1 &&
                    props.checkTermsConditions == true;
  
  return (
    <>
      <div>
        <form onSubmit={register}>
          <div>username <input type="text" name="regUserName" placeholder="Enter username" value={props.regUserName} onChange={props.updateSearch}></input> </div>
          <div>password <input type="password" name="regPassword" placeholder="Enter password" value={props.regPassword} onChange={props.updateSearch}></input> </div>
          {/* <div>password again <input type="password" name="regPasswordConfirmation" value={props.registeringInfo.regPasswordConfirmation} onChange={props.updateSearch}></input> </div> */}
          <div>firstname <input type="text" name="regFName" placeholder="Enter firstaname" value={props.regFName} onChange={props.updateSearch}></input> </div>
          <div>lastname <input type="text" name="regLName" placeholder="Enter lastname" value={props.regLName} onChange={props.updateSearch}></input> </div>
          <div><input type="checkbox" defaultChecked={props.checkTermsConditions} onChange={props.ChangeCheckTermsConditions}></input> I agree terms and conditions </div>
          <div><button onClick={ cancelReg }>cancel</button></div>
          <div><input disabled={!isEnabled} type="submit" id="submitButton" value="submit"></input></div>
        </form>
      </div>
    </>
  )
}
