import React from 'react'
import { BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import styles from './header.module.css';

export default function header(props) {

  let output = <div className={styles.headerLinks}> <Link to="/login">Login</Link></div>

  //if user is logged, it shows my account and logout
  if(props.userLogged === true) {
    output = 
    <>
      <div className={styles.headerLinks}> <Link to="/myaccount" >My account</Link> </div>
      <div className={styles.headerLinks}> <Link to="/map" onClick={()=> props.logout()}>Logout</Link> </div>
    </>
  }

  return (
    <>
      <div className={styles.headerBox}>
        <div><h1>MyCharge</h1></div>
      </div>
      <div className={styles.headerLinksContainer}>
        <div className={styles.headerLinks}><Link to="/map">Map</Link></div>        
          {output}
      </div>
    </>
  )
}
