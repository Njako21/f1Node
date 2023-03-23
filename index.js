const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const f1Routes = require('./routes/f1');
app.use('/api/f1', f1Routes);

app.use(express.static('public'));
app.use(express.static('public', { maxAge: 0 }));

app.get('/', (req, res) => {
  res.sendFile('files/index.html', { root: __dirname });
});



// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});