// const express = require('express');
import express from 'express';
import { query, validationResult, body } from 'express-validator';
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

const mockUsers = [
  { id: 1, name: 'James', location: 'BLR' },
  { id: 2, name: 'Jane', location: 'HYD' },
  { id: 3, name: 'Shijo', location: 'TVM' },
  { id: 4, name: 'Pearl', location: 'CEH' },
  { id: 5, name: 'Bob', location: 'DEL' },
];

// NOTE: Middleware
const simpleMiddleWare = (req, res, next) => {
  console.log('calling middleware');
  next();
};

// app.use(simpleMiddleWare);

// SECTION: API CALLS

app.get('/', (req, res) => {
  console.log('Hi there');
  res.send('Welcome');
});

app.get('/api/users/getAllUser', (req, res) => {
  return res.send(mockUsers);
});

app.get(
  '/api/users',
  query('value')
    .isString()
    .withMessage('Must be String')
    .notEmpty()
    .withMessage('Not Empty')
    .isLength({ min: 2, max: 5 })
    .withMessage('Expected minimum of 2 characters'),
  (req, res) => {
    const {
      query: { filter, value },
    } = req;
    const result = validationResult(req);
    if (result.isEmpty()) {
      // return res.send({ msg: 'Show values' }).status(200);
      return res.send(mockUsers.filter((user) => user[filter].includes(value))).status(200);
    } else {
      return res.status(400).send({ errors: result.array() });
    }
  }
);

app.get('/api/user/:id', (req, res) => {
  const {
    body,
    params: { id },
  } = req;

  const parseID = parseInt(id);
  if (isNaN(parseID)) return res.sendStatus(400);
  const userIndex = mockUsers.findIndex((user) => user.id === parseID);
  if (userIndex === -1) return res.sendStatus(400);

  const user = mockUsers[userIndex];
  return res.send(user);
});

app.post(
  '/api/users',
  body('name').isString().withMessage('Name must be String').notEmpty().withMessage('Name must not be empty'),
  body('location')
    .isString()
    .withMessage('location must be String')
    .notEmpty()
    .withMessage('location must not be empty')
    .isLength({ min: 3, max: 3 })
    .withMessage('Location code must be 3 characters'),
  (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) return res.status(400).send({ errors: result.array() });
    const newUser = req.body;
    newUser['id'] = mockUsers.length + 1;
    mockUsers.push(newUser);
    return res.status(200).send(newUser);
  }
);

app.put('/api/user/:id', (req, res) => {
  const {
    body,
    params: { id },
  } = req;

  const parseID = parseInt(id);
  if (isNaN(parseID)) return res.sendStatus(400);
  const userIndex = mockUsers.findIndex((user) => user.id === parseID);
  if (userIndex === -1) return res.sendStatus(400);
  mockUsers[userIndex] = { id: parseID, ...body };
  return res.sendStatus(200);
});

app.delete('/api/user/:id', (req, res) => {
  const {
    body,
    params: { id },
  } = req;
  const parseID = parseInt(id);
  if (isNaN(parseID)) return res.sendStatus(400);
  const userIndex = mockUsers.findIndex((user) => user.id === parseID);
  if (userIndex === -1) return res.sendStatus(400);
  mockUsers.splice(userIndex, 1);
  return res.sendStatus(200);
});

// !SECTION

// NOTE: PORT CALL
app.listen(PORT, () => {
  console.log('Running on PORT', PORT);
});
