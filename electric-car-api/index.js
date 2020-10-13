const express = require('express');
const app = express();
const port = 4000;
const cors = require('cors');
const db = require('./db');
const stationsComponent = require('./components/stations');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const passportHttp = require('passport-http');
const { Strategy } = require('passport');

app.use(cors());
app.use(express.static('public'))
app.use(bodyParser.json())
const saltRounds = 4;


app.get('/', (req, res) => {
  res.send('Testing if it works?')
})

app.use('/stations', stationsComponent)


app.post ('/register', (req,res) => {
  let username = req.body.username.trim();
  let password = req.body.password.trim();
  let fname = req.body.fname.trim();
  let lname = req.body.lname.trim();

  if((typeof username === "string") &&
     (username.length > 5) &&
     (typeof password === "string") &&
     (password.length > 6)) 
  {
    bcrypt.hash(password, saltRounds).then(hash =>
      db.query('INSERT INTO users (userid, username, password, fname, lname) VALUES (?,?,?,?,?)',[uuidv4(), username, hash, fname, lname]))
    .then(dbResult => {
      res.sendStatus(201);
      console.log("new user created");
    })
    .catch(error => res.sendStatus(500));
    console.log("somethign went wrong");
  }
  else {
    console.log("incorrect username or password, both must be strings and username more than 5 long and password more than 6 characters long");
    res.sendStatus(400);
  }
})


passport.use(new passportHttp.BasicStrategy((username, password, done) => {
  db.query('SELECT userid, username, password FROM users WHERE username = ?', [username])
  .then(dbResult => {
    if(dbResult.lenght == 0) {
      return done(null, false);
    }
  
    bcrypt.compare(password, dbResult[0].password).then(bcyptResult => {
      if(bcyptResult == true) {
        done(null, dbResult[0]);
      }
      else {
        return done(null, false);
      }
    }) 
  }).catch(dbError => done(err))
}));

app.get('/login', passport.authenticate('basic', {session: false}) , (req,res) => {
  console.log(req.user);
  res.sendStatus(200);
})

app.get('/users/:username',
  (req, res) => {
    db.query('SELECT userid, username, fname, lname FROM users WHERE username = ?', [req.params.username]).then(results => {
      res.json(results);
      console.log(results);
    })
  });

app.get('/mycharges/:username', passport.authenticate('basic', {session: false}) , (req, res) => {
  db.query('SELECT * FROM allcharges WHERE userid in (SELECT userid from users WHERE username = ?)', [req.params.username]).then(results => {
    console.log(req.params.userid);
    res.json(results);
    console.log(results);
  })
})

app.get('/charge/:userid', (req, res) => {
  db.query('SELECT * FROM allcharges WHERE userid = ? AND startTime IS NOT NULL AND stopTime IS NULL', [req.params.userid])
  .then(results => {
    if(results.length==0){
      res.json({found:false})
    }
    else{
      res.json({found:true})
    }
  })
})

app.post('/allcharges', (req, res) => {
  db.query('INSERT INTO allcharges (`startTime`, `priceType`, `unitPrice`, `userid`, `stationid`, `chargerCode`) VALUES (?, ?, ?, ?, ?, ?);',
  [req.body.startTime, req.body.priceType, req.body.unitPrice, req.body.userid, req.body.stationid, req.body.chargerCode])
  .then(dbResult => {
    res.sendStatus(201);
    console.log("new charge started");
  })
  .catch(error => res.sendStatus(500));
  console.log("somethign went wrong");
}
)



/* DB init */
Promise.all(
  [
      db.query(`CREATE TABLE IF NOT EXISTS chargeStations(
          stationid INT AUTO_INCREMENT PRIMARY KEY,
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
      )`),
      db.query(`CREATE TABLE IF NOT EXISTS users(
        userid VARCHAR(128) PRIMARY KEY,
        username VARCHAR(32),
        fname VARCHAR(32),
        lname VARCHAR (32),
        password VARCHAR (128)
    )`),
    db.query(`CREATE TABLE IF NOT EXISTS allcharges (
      chargeid INT AUTO_INCREMENT PRIMARY KEY,
      startTime VARCHAR(128),
      stopTime VARCHAR(128),
      electricityUsed VARCHAR(128),
      priceType VARCHAR(32),
      unitPrice DOUBLE(32,2),
      totalPrice VARCHAR(128),
      userid VARCHAR(128),
      stationid INT,
      chargerCode VARCHAR (32),
      FOREIGN KEY (userid) REFERENCES users(userid)
    )`),
  ]

).then(() => {
  console.log('database initialized');
  app.listen(port, () => {
      console.log(`Example API listening on http://localhost:${port}\n`);
  });
})
.catch(error => console.log(error));
