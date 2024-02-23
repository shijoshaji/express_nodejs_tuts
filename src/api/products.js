import { Router } from 'express';
import { query, validationResult, body, matchedData, checkSchema } from 'express-validator';
import { createUserValidator } from '../utils/shared/validatorSchema.js';
import { mockProducts } from '../utils/shared/productList.js';

const productRoute = Router();

productRoute.get('/api/product/getAllProducts', (req, res) => {
  return res.send(mockProducts);
});

export default productRoute;
