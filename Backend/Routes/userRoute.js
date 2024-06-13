import express from 'express'
import { userLogin, userRegister } from '../Controllers/userController.js';
const userRouter=express.Router();
userRouter.route('/login').post(userLogin);
userRouter.route('/register').post(userRegister);

export default userRouter;