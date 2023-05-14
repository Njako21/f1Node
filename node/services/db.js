// Importing mysql and express libraries
const mysql = require('mysql');

// Creating a MySQL database connection object with credentials from environment variables
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectTimeout: 5000,
});

// Function to connect to the database using the credentials specified in the connection object
function connect(callback) {
  connection.connect((error) => {
    if (error) {
      console.error('Error connecting to database:', error);
      callback(error);
    } else {
      console.log('Connected to database');
      rename = require('./raceUpdater.js'); // Import rename module
      callback(null);
    }
  });
}

// Function to execute a query on the database using the connection object
function query(queryString, callback) {
  connection.query(queryString, (error, results, fields) => {
    if (error) {
      console.error('Error executing query:');
      callback(error, null);
    } else {
      callback(null, results);
    }
  });
}

// Exporting the connection and query functions for use in other modules
module.exports = {
  connect,
  query,
};