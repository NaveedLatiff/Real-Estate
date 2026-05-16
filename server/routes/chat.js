import express from "express"
import userAuth from "../middleware/userAuth.js"
import { getChats, getChat, createChat, sendMessage } from "../controllers/chat.js"

const chatRouter = express.Router()

chatRouter.get("/", userAuth, getChats)
chatRouter.get("/:id", userAuth, getChat)
chatRouter.post("/", userAuth, createChat)
chatRouter.post("/:id/messages", userAuth, sendMessage)

export default chatRouter