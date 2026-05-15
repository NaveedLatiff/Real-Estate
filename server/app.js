import express from "express";
import cors from "cors";
import 'dotenv/config';
import authRouter from "./routes/auth.js";
import postRouter from "./routes/post.js";
import cookieParser from "cookie-parser";

const app=express();
const PORT=process.env.PORT || 3003

app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))
app.use(cookieParser())
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
)


app.use('/api/auth',authRouter)
app.use('/api/post',postRouter)
app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`)
})