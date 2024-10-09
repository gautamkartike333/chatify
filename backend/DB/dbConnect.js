import mongoose from 'mongoose';
// import dotenv from 'dotenv'
 export const dbConnect=async()=>{
    try{
        const mongodb_string = await process.env.MONGODB_CONNECT; 
   
         mongoose.connect(mongodb_string);
         console.log("Database Connected successffully");
    }
    catch(error){
        console.error("Error connecting to database",error);
    }
};

