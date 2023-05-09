const express = require('express');
const router = express.Router();
const f1Logic = require('../logic/f1Logic');


//Define routes for /api/f1

//the routes we are working on for the project
//         |
//         |
//        \ /
//         V

// route    /api/f1/year/:year
// example  /api/year/f1/2022
router.get('/year/:year/races', handleYearRacesRequest);

function handleYearRacesRequest(req, res) {
  const year = req.params.year;
  f1Logic.yearRaces(year, handler.bind(null, res));
}

// route    /api/f1/year/:year/grand_prix/:grand_prix
// example  /api/f1/year/2022/grand_prix/Bahrain_Grand_Prix
router.get('/year/:year/grand_prix/:grand_prix', handleGrandPrixRequest);

function handleGrandPrixRequest(req, res) {
  const year = req.params.year;
  const grand_prix = req.params.grand_prix;

  f1Logic.grandPrix(year, grand_prix, handler.bind(null, res));
}


// route    /api/f1/year/:year/driver/:driver
// example  /api/f1/year/2022/driver/Lewis_Hamilton
router.get('/year/:year/driver/:driver', handleYearDriverRequest);

function handleYearDriverRequest(req, res) {
  const year = req.params.year;
  const driver = req.params.driver;

  f1Logic.yearDriver(year, driver, handler.bind(null, res));
}


// route    /api/f1/year/:year/drivers
// example  /api/f1/year/2022/drivers
router.get('/year/:year/drivers', handleYearDriversRequest);

function handleYearDriversRequest(req, res) {
  const year = req.params.year;
  f1Logic.yearDrivers(year, handler.bind(null, res));
}

// route    /api/f1/driver/:driver
// example  /api/f1/driver/Lewis_Hamilton
router.get('/driver/:driver', handleDriverRequest);

function handleDriverRequest(req, res) {
  const driver = req.params.driver;

  f1Logic.driver(driver, handler.bind(null, res));
}

// route    /api/f1/driver/:driver/active
// example  /api/f1/driver/Lewis_Hamilton/active
router.get('/driver/:driver/active', handleDriverYearsRequest);

function handleDriverYearsRequest(req, res) {
  const driver = req.params.driver;

  f1Logic.yearsActive(driver, handler.bind(null, res));
}

// route    /api/f1/pointsSystems
// example  /api/f1/pointsSystems
router.get('/pointsSystems', handlePointsSystemsRequest);

function handlePointsSystemsRequest(req, res) {
  f1Logic.pointsSystems(handler.bind(null, res));
}

// route    /api/f1/pointsSystems/:pointsSystem
// example  /api/f1/pointsSystems/1
router.get('/pointsSystems/:pointsSystem', handlePointsSystemRequest);

function handlePointsSystemRequest(req, res) {
  const pointsSystem = req.params.pointsSystem;

  f1Logic.pointsSystemWValue(pointsSystem, handler.bind(null, res));
}


// helper function to handle the response from the logic layer
function handler(res, error, result) {
  if (error) {
    res.status(400).send(error);
  } else {
    res.send(result);
  }
}

module.exports = router;
