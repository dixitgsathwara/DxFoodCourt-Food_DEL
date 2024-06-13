import express from 'express'
import { addFood, listFood, removeFood } from '../Controllers/foodController.js';
import multer from 'multer'
const foodRouter=express.Router();

const storage = multer.diskStorage({
    destination:"Uploads",
    filename:(req,file,cb)=>{
        return cb(null,`${Date.now()}${file.originalname}`);
    }
})
const upload=multer({storage:storage})
foodRouter.route('/add').post(upload.single("image"),addFood);
foodRouter.route('/list').get(listFood);
foodRouter.route('/remove').post(removeFood);

export default foodRouter;

