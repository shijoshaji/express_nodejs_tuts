// const express = require('express');
import express from 'express';
import routes from './app/routes.js';
const app = express();
app.use(express.json());
app.use(routes);

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  console.log('Hi there');
  res.send('Welcome');
});

// NOTE: PORT CALL
app.listen(PORT, () => {
  console.log('Running on PORT', PORT);
});
