const express = require('express');
const app = express();
const db = require('../db');
const router = express.Router();
const bodyParser = require('body-parser')
app.use(bodyParser.json())

//How to make these work?

router.get('/', (req, res) => { 
  db.query('SELECT * FROM chargestations;').then(results => {
      res.json( results)
      console.log(results)
  })
  .catch(() => {
      res.sendStatus(500);
  })    
});

module.exports = router