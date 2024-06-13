import mongoose from "mongoose";
 export const connectDB= async()=>{
    try{
        const connect=await mongoose.connect(process.env.connectionString);
        console.log(`Database connected.. \nHost:${connect.connection.host}\nDB:${connect.connection.name}`);
    }
    catch(err){
        console.log(err);
        process.exit(1);
    }
}

