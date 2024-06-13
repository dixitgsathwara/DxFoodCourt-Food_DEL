import express from "express";
import cors from "cors"
import { connectDB } from "./Config/connectionDB.js";
import foodRouter from "./Routes/foodRoute.js";
import dotenv from 'dotenv';
import userRouter from "./Routes/userRoute.js";
import cartRouter from "./Routes/cartRoute.js";
import orderRouter from "./Routes/orderRoute.js";



const app=express();
const PORT=5000;
dotenv.config();

app.use(express.json());
app.use(cors());
app.use('/api/food',foodRouter);
app.use('/api/user',userRouter);
app.use('/api/cart',cartRouter);
app.use('/api/order',orderRouter);
app.use('/images',express.static('Uploads'))

connectDB();

app.get('/',(req,res)=>{
    res.send("Hello");
})
app.listen(PORT,(req,res)=>{
    console.log(`Server is running on ${PORT} Port`);
});