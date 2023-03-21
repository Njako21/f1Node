const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// GET /api/users
app.get('/api/f1', (req, res) => {
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

// GET /api/users/:id
app.get('/api/users/:id', (req, res) => {
  // Return a user by ID
});

// POST /api/users
app.post('/api/users', (req, res) => {
  // Create a new user
});

// PUT /api/users/:id
app.put('/api/users/:id', (req, res) => {
  // Update a user by ID
});

// DELETE /api/users/:id
app.delete('/api/users/:id', (req, res) => {
  // Delete a user by ID
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});