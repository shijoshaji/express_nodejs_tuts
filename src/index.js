// const express = require('express');
import express from 'express';
import routes from './app/routes.js';
import cookieParser from 'cookie-parser';
const app = express();
app.use(express.json());
app.use(cookieParser()); // Must be initiliased before calling routes
app.use(routes);

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  // setting cookies
  res.cookie('User', 'Shijo', { maxAge: 60000 });
  res.send('Welcome');
});

// NOTE: PORT CALL
app.listen(PORT, () => {
  console.log('Running on PORT', PORT);
});
