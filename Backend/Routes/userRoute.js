import express from 'express'
import { userLogin, userRegister , getInfo,forgotPassword,updatePassword,googleLogin} from '../Controllers/userController.js';
import validateToken from '../Middleware/validateToken.js';
const userRouter=express.Router();
userRouter.route('/login').post(userLogin);
userRouter.route('/register').post(userRegister);
userRouter.route('/getinfo').post(validateToken,getInfo);
userRouter.route('/forgot').post(forgotPassword);
userRouter.route('/updatepassword').post(validateToken,updatePassword);
userRouter.route('/googlelogin').post(googleLogin);

export default userRouter;