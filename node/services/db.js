const mysql = require('mysql');
const express = require('express');

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});
console.log('process.env.DB_HOST', process.env.DB_NAME);
function connect() {
  connection.connect((error) => {
    if (error) {
      console.error('Error connecting to database:', error);
    } else {
      console.log('Connected to database');
    }
  });
}

function query(queryString, callback) {
  connection.query(queryString, (error, results, fields) => {
    if (error) {
      console.error('Error executing query:', error);
      callback(error, null);
    } else {
      callback(null, results);
    }
  });
}


module.exports = {
  connect,
  query,
};