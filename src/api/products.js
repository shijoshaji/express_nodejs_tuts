import { Router } from 'express';
import { query, validationResult, body, matchedData, checkSchema } from 'express-validator';
import { createUserValidator } from '../utils/shared/validatorSchema.js';
import { mockProducts } from '../utils/shared/productList.js';

const productRoute = Router();

productRoute.get('/api/product/getAllProducts', (req, res) => {
  // NOTE: here we show products if there is cookie
  if (req.cookies && req.cookies.User == 'Shijo') return res.send(mockProducts);
  return res.status(403).send({ msg: 'Access Denied' });
});

export default productRoute;
