import { Router } from 'express';
import userRoute from '../api/users.js';
import productRoute from '../api/products.js';

const routes = Router();
routes.use(userRoute);
routes.use(productRoute);

export default routes;
