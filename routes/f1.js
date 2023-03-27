const https = require('https');
const express = require('express');
const router = express.Router();

// Define routes for /api/f1
// GET /api/users
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