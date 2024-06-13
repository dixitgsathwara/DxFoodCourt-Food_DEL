import express from 'express'
import validateToken from '../Middleware/validateToken.js';
import { addToCart,removeFromCart,getCart } from '../Controllers/cartController.js'
const  cartRouter=express.Router();
cartRouter.route('/add').post(validateToken,addToCart)
cartRouter.route('/remove').post(validateToken,removeFromCart)
cartRouter.route('/get').post(validateToken,getCart)
export default cartRouter;