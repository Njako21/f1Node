// app.js file
const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');

const db = require('./services/db');

db.connect();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const f1Routes = require('./routes/f1');
app.use('/api/f1', f1Routes);

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});