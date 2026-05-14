import dotenv from 'dotenv'
dotenv.config()
import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.js"
import cookieParser from "cookie-parser";

const app=express();
const PORT=process.env.PORT || 3003


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({origin: "http://localhost:3000",credentials:true}));


app.use('/api/auth',authRouter)

app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`)
})