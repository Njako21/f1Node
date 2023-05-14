// Import required packages
const express = require('express');
require('dotenv').config(); // Load environment variables from .env file
const bodyParser = require('body-parser');

const db = require('./services/db'); // Import database connection module

// Create an instance of the express application
const app = express();
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

const port = process.env.PORT || 3000; // Set the port number for the server

// Add middleware to parse incoming requests with JSON payloads
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

try {
  // Connect to the database
  db.connect((err) => {
    if (err) {
      console.log("could not connect to db");
      console.log("use /test route instead for testing");
      return;
    }

    // If the connection is successful, add the F1 routes to the application
    const f1Routes = require('./routes/f1');
    app.use('/api/f1', f1Routes);

    console.log("server is ready to recieve requests")
    console.log("use /api/f1 route for f1 data")
    const updater = require('./services/raceUpdater.js');
  });
} catch (e) {
  console.log("could not connect to db");
  console.log("use /test over /api route for testing");
}

// Start the server and listen for incoming requests
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
// Add test routes to the application
const testRoutes = require('./routes/test');
app.use('/test/f1', testRoutes);