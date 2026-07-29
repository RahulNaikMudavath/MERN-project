import express from 'express';
import authUser from "../middlewares/authUser.js";
import { getAllOrders, getUserOrders, placeOrderCOD, placeOrderStripe, verifyStripe } from '../controllers/orderController.js';
import authSeller from '../middlewares/authSeller.js';

const orderRouter = express.Router();

orderRouter.post('/cod',authUser , placeOrderCOD)
orderRouter.post('/stripe',authUser , placeOrderStripe)
orderRouter.post('/verifyStripe',authUser , verifyStripe)
orderRouter.get('/user',authUser , getUserOrders)
orderRouter.get('/seller',authSeller , getAllOrders)


export default orderRouter;