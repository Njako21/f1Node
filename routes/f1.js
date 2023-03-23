const express = require('express');
const router = express.Router();

// Define routes for /api/f1
// GET /api/users
router.get('/', (req, res) => {
    fetch('https://www.formula1.com/en/results.html/2023/races/1142/saudi-arabia/race-result.html')
      .then(response => response.text())
      .then(data => {
        res.send(data);
      })
      .catch(error => {
        console.error(error);
        res.status(500).send('An error occurred while fetching the data.');
      });
  });
  
  // get year
  router.get('/:year', (req, res) => {
    const year = req.params.year;
    res.send(`year: ${year}`);
  });

module.exports = router;