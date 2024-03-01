// const express = require('express');
import express from 'express';
import routes from './app/routes.js';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { mockUserCredentials } from './utils/shared/usersList.js';
import passport from 'passport';
import './strategies/local-strategy.js';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import { config } from './app.config.js';

const app = express();

const dbURI = `${config.DB_PATH}${config.DB_HOST}:${config.DB_PORT}/${config.DB_NAME}`;

mongoose
  .connect(dbURI)
  .then(() => console.log('DB Connected!'))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 3000;

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
    store: MongoStore.create({
      client: mongoose.connection.getClient(),
    }),
  })
);
app.use(passport.initialize());
app.use(passport.session());

// NOTE: Above ones must be initiliased before calling routes
app.use(routes);

app.get('/', (req, res) => {
  // setting cookies
  res.cookie('User', 'Shijo', { maxAge: 60000 });
  req.session.visited = true; // So that everytime SessionID is not random
  res.send('Welcome');
});

// SECTION: SIMPLE AUTH
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
// !SECTION

// SECTION: Passport AUTH
app.post('/api/passport/auth/login', passport.authenticate('local'), (req, res) => {
  // console.log('PASSPORT AUTH', res);
  res.status(200).send('Passport Auth Login');
});

app.post('/api/passport/auth/logout', (req, res) => {
  console.log('PASSPORT AUTH Logout', req.user);
  if (!req.user) return res.sendStatus(401);
  req.logout((err) => {
    if (err) return res.sendStatus(400);
    res.status(200).send('Passport Auth Logout');
  });
});

app.get('/api/passport/auth/status', (req, res) => {
  console.log('Inside passport/auth/status', req.user);
  if (req.user) return res.status(200).send('isLoggedIN');
  return res.status(401).send('isNotLoggedIN');
});

// NOTE: PORT CALL
app.listen(PORT, () => {
  console.log('Running on PORT', PORT);
});
