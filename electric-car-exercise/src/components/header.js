import React from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import styles from './header.module.css';

export default function header() {
  return (
    <Route path="/">
      <div className={styles.headerBox}>
        <div>Here the name of the service?</div>
      </div>
      <div className={styles.headerLinksContainer}>
        <div className={styles.headerLinks}><Link to="/map">Map</Link></div>
        <div className={styles.headerLinks}>Some</div>
        <div className={styles.headerLinks}>Links</div>
        <div className={styles.headerLinks}> <Link to="/login">Login</Link></div>
      </div>
    </Route>
  )
}
