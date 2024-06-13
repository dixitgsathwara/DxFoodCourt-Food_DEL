import express from 'express'
import validateToken from '../Middleware/validateToken.js';
import { placeOrder ,verifyOrder,userOrders ,listOrders,updateStatus} from '../Controllers/orderController.js';
const  orderRouter=express.Router();

orderRouter.route('/place').post(validateToken,placeOrder)
orderRouter.route('/verify').post(verifyOrder)
orderRouter.route('/userOrders').post(validateToken,userOrders)
orderRouter.route('/list').get(listOrders)
orderRouter.route('/status').post(updateStatus)

export default orderRouter;