const express = require('express');
const router = express.Router();
const db = require('../services/db');

// Define routes for /api/f1
router.get('/:driver', (req, res) => {
  const driver = req.params.driver;
  
  if (!driver) {
    res.status(400).send('Driver parameter missing');
    return;
  }

  const query = ''+
  'SELECT * '+
  'FROM drivers '+
  'JOIN driverstandings ON drivers.driverId = driverstandings.driverId '+
  'WHERE drivers.driverId ='+driver+' ';
  db.query(query, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Error executing query');
    } else {
      console.log('Query results:', results);
      res.send(results);
    }

  });
});

module.exports = router;
