const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');

const db = require('./services/db');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

try {
  db.connect((err) => {
    if (err) {
      console.log("could not connect to db");
      console.log("use /test route instead for testing");
      return;
    }

    const f1Routes = require('./routes/f1');
    app.use('/api/f1', f1Routes);
  });
} catch (e) {
  console.log("could not connect to db");
  console.log("use /test route instead for testing");
}

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
const testRoutes = require('./routes/test');
app.use('/test/f1', testRoutes);