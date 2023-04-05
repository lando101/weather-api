const express = require('express');
require('dotenv').config();

const app = express();
const swagger = require('./swagger');

swagger(app);

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
const weatherRoute = require('./routes/weather');
app.use('/weather', weatherRoute);

const authRoute = require('./routes/auth');
app.use('/auth', authRoute);

const locationRoute = require('./routes/location');
app.use('/location', locationRoute);

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});