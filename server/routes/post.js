import express from 'express'
import userAuth from '../middleware/userAuth.js'
import { addPost, deletePost, getAllPosts, getFilteredPosts, getSinglePost, getUserPosts, updatePost } from '../controllers/post.js'
const postRouter=express.Router()

postRouter.get("/my-posts", userAuth, getUserPosts)
postRouter.get("/filter", getFilteredPosts)
postRouter.post("/",userAuth, addPost)
postRouter.get("/", getAllPosts)
postRouter.get("/:id", getSinglePost)
postRouter.delete("/:id", userAuth, deletePost)
postRouter.put("/:id", userAuth, updatePost)


export default postRouter
