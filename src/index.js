// const express = require('express');
import express from 'express';
import routes from './app/routes.js';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { mockUserCredentials } from './utils/shared/usersList.js';

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: 'First Session',
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 60000,
    },
  })
);
// Above ones must be initiliased before calling routes
app.use(routes);

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  // setting cookies
  res.cookie('User', 'Shijo', { maxAge: 60000 });
  req.session.visited = true; // So that everytime SessionID is not random
  res.send('Welcome');
});

// AUTH
app.post('/api/auth', (req, res) => {
  const {
    body: { username, password },
  } = req;

  const findUserName = mockUserCredentials.find(
    (user) => user.username.toLowerCase() === username.toLowerCase() && user.password === password
  );
  if (!findUserName) return res.status(401).send({ msg: 'Bad Credentials' });
  delete findUserName.password; // No need to share password
  req.session.sessionUser = { findUserName, isLoggedIn: true };
  console.log(req.session.sessionUser);
  return res.status(200).send({ msg: 'ACCESS GRANTED', user: findUserName.username });
});

app.get('/api/auth/status', (req, res) => {
  req.sessionStore.get(req.sessionID, (err, session) => {
    console.log('SESSION:', session);
  });
  return req.session.sessionUser
    ? res.status(200).send(req.session.sessionUser)
    : res.status(401).send({ msg: 'Bad Credentials' });
});

// NOTE: PORT CALL
app.listen(PORT, () => {
  console.log('Running on PORT', PORT);
});
