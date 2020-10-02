const express = require('express');
const db = require('../db');
const router = express.Router();

//How to make these work?

router.get('/stations', (req, res) => { 
  db.query('SELECT * FROM chargestations;').then(results => {
      res.json({stations: results})
  })
  .catch(() => {
      res.sendStatus(500);
  })    
});