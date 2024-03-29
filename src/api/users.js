import { Router } from 'express';
import { query, validationResult, body, matchedData, checkSchema } from 'express-validator';
import { creatDBUserValidator, createUserValidator } from '../utils/shared/validatorSchema.js';
import { mockUsers } from '../utils/shared/usersList.js';
import { userModel } from '../utils/mongoose/schemas/user.schema.js';
import { hashPassword } from '../utils/helpers.js';

const userRoute = Router();
const API_PATH = '/api/users';
const API_PATH_DB = '/db/api/users';

// SECTION: Using index_old.js
userRoute.get(`${API_PATH}/getAllUser`, (req, res) => {
  console.log(req.session);
  console.log(req.sessionID);
  return res.send(mockUsers);
});

userRoute.get(
  `${API_PATH}`,
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

userRoute.get(`${API_PATH}/:id`, (req, res) => {
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

userRoute.post(`${API_PATH}`, checkSchema(createUserValidator), (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) return res.status(400).send({ errors: result.array() });

  const newUser = matchedData(req);
  newUser['id'] = mockUsers.length + 1;
  mockUsers.push(newUser);
  return res.status(200).send(newUser);
});

userRoute.put(`${API_PATH}/:id`, (req, res) => {
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

userRoute.delete(`${API_PATH}/:id`, (req, res) => {
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

// SECTION using mongo DB
userRoute.post(`${API_PATH_DB}`, checkSchema(creatDBUserValidator), async (req, res) => {
  // const { body } = req;
  const result = validationResult(req);
  if (!result.isEmpty()) return res.status(400).send({ errors: result.array() });

  const data = matchedData(req);
  data.password = hashPassword(data.password)
  const newUser = new userModel(data);
  try {
    const savedUser = await newUser.save();
    return res.status(201).send({ msg: 'Created New User', data: savedUser });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) return res.status(400).send({ msg: `${newUser.username} already exists` });
    return res.sendStatus(400);
  }
});

// !SECTION

export default userRoute;
