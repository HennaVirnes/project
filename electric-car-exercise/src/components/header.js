import React from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import styles from './header.module.css';

export default function header(props) {

  let output = <div className={styles.headerLinks}> <Link to="/login">Login</Link></div>

  if(props.userLogged === true) {
    output = 
    <>
      <div className={styles.headerLinks}> <Link to="/myaccount" >My account</Link> </div>
      <div className={styles.headerLinks}> <Link to="/map" onClick={()=> props.logout()}>Logout</Link> </div>
    </>
  }

  return (
    <Route path="/">
      <div className={styles.headerBox}>
        <div>Here the name of the service?</div>
      </div>
      <div className={styles.headerLinksContainer}>
        <div className={styles.headerLinks}><Link to="/map">Map</Link></div>
        <div className={styles.headerLinks}>Some</div>
        <div className={styles.headerLinks}>Links</div>
        
          {output}
        
      </div>
    </Route>
  )
}
