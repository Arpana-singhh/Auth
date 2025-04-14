import express from "express";
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import authRouter from './routes/authRoutes.js'
import connectDB from './config/mongodb.js';
import userRouter from "./routes/userRoutes.js";


const app=express();
const port = process.env.PORT || 4000
connectDB();


const allowedOrigins =['http://localhost:5173']

app.use(express.json())
app.use(cookieParser());
app.use(cors({origin:allowedOrigins, credentials:true}))

app.get('/',(req, res)=>{
    res.send(" Hello World")
})

app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)

app.listen(port, ()=>
console.log(`Server Running on port ${port}`))