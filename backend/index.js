import express from 'express';
import dotenv from 'dotenv'
import { dbConnect } from './DB/dbConnect.js';
import authRouter from './Route/authUser.js'
import cookieParser from 'cookie-parser';
import messageRouter from './Route/messageRoute.js'
import userRouter from './Route/userRoute.js'
import cors from 'cors'
import {app , server} from './Socket/socket.js';
import path from 'path'
// const app=express();


const __dirname = path.resolve();

dotenv.config();

app.use(express.json());
app.use(cookieParser());
// app.use(cors({ origin: 'http://localhost:5173' }));


app.use('/api/auth',authRouter)
app.use('/api/message',messageRouter)
app.use('/api/user',userRouter)

app.use(express.static(path.join(__dirname,"/frontend/dist")))

app.get("*",(req,res)=>{
    res.sendFile(path.join(__dirnamedirname,"frontend","dist","index.html"))
})

const PORT=process.env.PORT || 3000

server.listen(PORT,()=>{
    dbConnect();
    console.log(`hello server is running on port ${PORT}`);
})