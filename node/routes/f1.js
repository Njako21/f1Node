const express = require('express');
const router = express.Router();
const f1Logic = require('../logic/f1Logic');
const db = require('../services/db');


//Define routes for /api/f1

//the routes we are working on for the project
//         |
//         |
//        \ /
//         V

// route    /api/f1/year/:year
// example  /api/year/f1/2022
router.get('/year/:year/races', (req, res) => {
  const year = req.params.year;
  f1Logic.yearRaces(year, (error, result) => {
    if (error) {
      res.status(400).send(error);
    } else {
      res.send(result);
    }
  });
});

// route    /api/f1/year/:year/grand_prix/:grand_prix
// example  /api/f1/year/2022/grand_prix/Bahrain_Grand_Prix
router.get('/year/:year/grand_prix/:grand_prix', (req, res) => {
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


// route    /api/f1/year/:year/driver/:driver
// example  /api/f1/year/2022/driver/lewis_hamilton
router.get('/year/:year/driver/:driver', (req, res) => {
  const year = req.params.year;
  const driver = req.params.driver;

  f1Logic.yearDriver(year, driver, (error, result) => {
    if (error) {
      res.status(400).send(error);
    } else {
      res.send(result);
    }
  });
});


// route    /api/f1/year/:year/drivers
// example  /api/f1/year/2022/drivers
router.get('/year/:year/drivers', (req, res) => {
  const year = req.params.year;

  f1Logic.yearDrivers(year, (error, result) => {
    if (error) {
      res.status(400).send(error);
    } else {
      res.send(result);
    }
  });
});

// route    /api/f1/driver/:driver
// example  /api/f1/driver/Lewis_Hamilton
router.get('/driver/:driver', (req, res) => {
  const driver = req.params.driver;

  f1Logic.driver(driver, (error, result) => {
    if (error) {
      res.status(400).send(error);
    } else {
      res.send(result);
    }
  });
});


module.exports = router;
