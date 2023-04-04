const https = require('https');
const express = require('express');
const router = express.Router();

const db = require('/services/db');

db.connect();

// Define routes for /api/f1
router.get('/', (req, res) => {
  jsonFormat = JSON.stringify(test);
  res.send(jsonFormat);
});
  
  // get year
  router.get('/:year', (req, res) => {
    const year = req.params.year;
    res.send(`year: ${year}`);
  });

module.exports = router;