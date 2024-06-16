import express from 'express'
import { userLogin, userRegister , getInfo} from '../Controllers/userController.js';
import validateToken from '../Middleware/validateToken.js';
const userRouter=express.Router();
userRouter.route('/login').post(userLogin);
userRouter.route('/register').post(userRegister);
userRouter.route('/getinfo').post(validateToken,getInfo);

export default userRouter;