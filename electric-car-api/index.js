const express = require('express');
const app = express();
const port = 4000;
const cors = require('cors');
const db = require('./db');
const stationsComponent = require('./components/stations')
const bodyParser = require('body-parser')

app.use(cors());
app.use(express.static('public'))
app.use(bodyParser.json())


app.get('/', (req, res) => {
  res.send('Testing if it works?')
})

app.use('/stations', stationsComponent)


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
          image VARCHAR(256),
          longitude VARCHAR(32),
          lattitude VARCHAR(32)
      )`)
  ]
).then(() => {
  console.log('database initialized');
  app.listen(port, () => {
      console.log(`Example API listening on http://localhost:${port}\n`);
  });
})
.catch(error => console.log(error));
