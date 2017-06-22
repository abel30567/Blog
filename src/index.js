/* eslint-disable no-console */
import express from 'express';

import constants from './config/constants';

import './config/database';

import middlewaresConfig from './config/middleware';

const app = express();

middlewaresConfig(app);

// Routes

app.get('/', (req, res) => {
  res.send('Hello  World');
});

// Port set up
app.listen(constants.PORT, err => {
  if (err) {
    throw err;
  } else {
    console.log(`Server running on port: ${constants.PORT}
        ---------------
        Running on ${process.env.NODE_ENV}
        --------------
        Have fun bro!!
        `);
  }
});
