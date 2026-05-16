import express from "express";
import cors from "cors";
import 'dotenv/config';
import authRouter from "./routes/auth.js";
import postRouter from "./routes/post.js";
import chatRouter from "./routes/chat.js";
import cookieParser from "cookie-parser";
import http from "http"
import { Server } from "socket.io"

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
app.use("/api/chat", chatRouter)

const server = http.createServer(app)
 
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
})
 
const onlineUsers = new Map()
 
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId
 
  if (userId) onlineUsers.set(userId, socket.id)
 
  io.emit("onlineUsers", Array.from(onlineUsers.keys()))
 
  socket.on("sendMessage", ({ chatId, message }) => {
    const receiverSocketId = onlineUsers.get(message.receiverId)
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", { chatId, message })
    }
  })
 
  socket.on("disconnect", () => {
    onlineUsers.delete(userId)
    io.emit("onlineUsers", Array.from(onlineUsers.keys()))
  })
})

server.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`)
})