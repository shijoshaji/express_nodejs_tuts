const express = require('express');
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

app.get('/api/users', (req, res) => {
  const {
    query: { filter, value },
  } = req;

  // Eg query param: http://localhost:3000/api/users?filter=name&value=Ja
  if (filter && value) return res.send(mockUsers.filter((user) => user[filter].includes(value)));
  // When filter and values are undefined
  return res.send(mockUsers);
});

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

app.post('/api/users', (req, res) => {
  const newUser = req.body;
  newUser['id'] = mockUsers.length + 1;
  mockUsers.push(newUser);
  return res.status(200).send(newUser);
});

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
