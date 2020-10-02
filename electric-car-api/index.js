const express = require('express');
const app = express();
const port = 4000;
const cors = require('cors');
const db = require('./db');

app.use(cors());
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.send('Testing if it works?')
})

// app.get('/stations', (req, res) => {
//   result = db.query('SELECT * FROM electriccardb.chargestations;');
//   console.log(result);
//   res.json(result)
// })


app.get('/stations', (req, res) => { 
  db.query('SELECT * FROM chargestations;').then(results => {
      res.json({stations: results})
  })
  .catch(() => {
      res.sendStatus(500);
  })    
});


/* DB init */
Promise.all(
  [
      db.query(`CREATE TABLE IF NOT EXISTS chargeStations(
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(32),
          streetAddress VARCHAR (32),
          zipCode MEDIUMINT,
          city VARCHAR (16),
          qntSlow TINYINT,
          priceSlow VARCHAR (16),
          qntFast TINYINT,
          priceFast VARCHAR (16),
          image VARCHAR(256)
      )`)
      // Add more table create statements if you need more tables
  ]
).then(() => {
  console.log('database initialized');
  app.listen(port, () => {
      console.log(`Example API listening on http://localhost:${port}\n`);
      console.log('Available API endpoints');
      console.log('  /hello [GET, POST, PUT, DELETE]');
      console.log('  /hello/{param1}/world/{param2} [GET]');
      console.log('  /world [GET, POST, PUT, DELETE]');
      console.log('\n  /dogs [GET, POST]');
      console.log('  /dogs/{dogId} [GET, DELETE]');
      console.log('\n  /apikey/new/{username} [GET]');
      console.log('  /apikey/protected} [GET]');
      console.log('\n\n Use for example curl or Postman tools to send HTTP requests to the endpoints');
  });
})
.catch(error => console.log(error));
