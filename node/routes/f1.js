const express = require('express');
const router = express.Router();
const f1Logic = require('../logic/f1Logic');
const db = require('../services/db');

//Define routes for /api/f1
router.get('/year/:year', (req, res) => {
  const year = req.params.year;

  if (!year || year.length !== 4) {
    res.status(400).send('not valid year parameter. "' + year + '"');
    return;
  }

  const query = ''+
  'SELECT r.raceId, ds.driverId, ds.position, d.forename, d.surname '+
  'FROM races r ' +
  'JOIN driverstandings ds ON r.raceId = ds.raceId ' +
  'JOIN drivers d ON ds.driverId = d.driverId ' + 
  "WHERE r.Year = " + Number(year) + "";

  console.log(query);

  db.query(query, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Error executing query');
    } else {
      console.log("query done and results gotten");
      const drivers = results.map((result) => {
        return {
          position: result.position,
          name: result.forename + ' ' + result.surname,
        };
      });
      console.log("loop one");
      for (let i = 0; i < drivers.length; i++) {
        for (let j = i + 1; j < drivers.length; j++) {
          if (drivers[i].name === drivers[j].name) {
            drivers[i].position = drivers[i].position + ', ' + drivers[j].position;
            drivers.splice(j, 1);
            j--;
          }
        }
      }
      
      pointSystem = {
        1: 25,
        2: 18,
        3: 15,
        4: 12,
        5: 10,
        6: 8,
        7: 6,
        8: 4,
        9: 2,
        10: 1,
      };
      console.log("loop two");
      for (let i = 0; i < drivers.length; i++) {
        const positions = drivers[i].position.split(', ');
        let points = 0;
        for (let j = 0; j < positions.length; j++) {
          if (positions[j] <= 10) {
            points += pointSystem[positions[j]];
          }
        }
        drivers[i].points = points;
      }
      console.log("sending");
      res.send(drivers);
    }

  });
});



// driver points
router.get('/:driver', (req, res) => {
  const driver = req.params.driver;
  
  if (!driver) {
    res.status(400).send('Driver parameter missing');
    return;
  }

  const query = ''+
  'SELECT points '+
  'FROM drivers '+
  'JOIN driverstandings ON drivers.driverId = driverstandings.driverId '+
  "WHERE drivers.driverRef = '" + driver + "' ";
  db.query(query, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Error executing query');
    } else {
      res.send(results);
    }

  });
});

//the routes we are working on for the project
//         |
//         |
//        \ /
//         V

// route /api/f1/:year
// example /api/f1/2022
router.get('/:year/races', (req, res) => {
  const year = req.params.year;
  f1Logic.yearRaces(year, (error, result) => {
    if (error) {
      res.status(400).send(error);
    } else {
      res.send(result);
    }
  });
});

// route /api/f1/:year/:grand_prix
// example /api/f1/2022/Bahrain_Grand_Prix
router.get('/:year/:grand_prix', (req, res) => {
  const year = req.params.year;
  const grand_prix = req.params.grand_prix;

  f1Logic.grandPrix(year, grand_prix, (error, result) => {
    if (error) {
      res.status(400).send(error);
    } else {
      res.send(result);
    }
  });
});

module.exports = router;
