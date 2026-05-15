import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import cloudinary from "../config/cloudinary.js"
import prisma from "../config/db.js"

export const register = async (req, res) => {
  try {
    const { userName, email, password, profile } = req.body
    if (!userName || !email || !password) {
      return res.json({
        success: false,
        message: "Please provide all the required fields",
      })
    }
    const userExist = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (userExist) {
      return res.json({
        success: false,
        message: "Email already registered",
      })
    }
    let data = { userName, email }

    if (profile) {
      const uploadResponse = await cloudinary.uploader.upload(profile, {
        folder: "profileImages",
      })
      data.profile = uploadResponse.secure_url
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    data.password = hashedPassword

    const user = await prisma.user.create({
      data,
    })

    const { password: _, ...userwithoutpass } = user

    const token = jwt.sign({ id: user.id }, process.env.SESSION_SECRET, {
      expiresIn: "7d",
    })

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    return res.json({
      success: true,
      message: "Successfully Signup",
      user: userwithoutpass,
    })
  } catch (err) {
    return res.json({
      success: false,
      message: `Internal Server Error ${err.message}`,
    })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.json({
        success: false,
        message: "please provide all the required fields",
      })
    }
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.json({ success: false, message: "Invalid email or password" })
    }

    const { password: _, ...userwithoutpass } = user

    const token = jwt.sign({ id: user.id }, process.env.SESSION_SECRET, {
      expiresIn: "7d",
    })

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    return res.json({
      success: true,
      message: "Successfully login",
      user: userwithoutpass,
    })
  } catch (err) {
    return res.json({
      success: false,
      message: `Internal Server Error ${err.message}`,
    })
  }
}

export const updateProfile = async (req, res) => {
  try {
    const userId = req.userId
    const { userName, password, profile } = req.body

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" })

    let updateData = {}
    if (userName) updateData.userName = userName

    if (password && password.trim() !== "") {
      updateData.password = await bcrypt.hash(password, 10)
    }

    if (profile) {
      const uploadResponse = await cloudinary.uploader.upload(profile, {
        folder: "profileImages",
      })
      updateData.profile = uploadResponse.secure_url
    }

    if (Object.keys(updateData).length === 0) {
      return res.json({
        success: false,
        message: "No data provided",
      })
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    })

    const { password: _, ...userwithoutpass } = updatedUser

    return res.json({
      success: true,
      message: "Profile updated successfully",
      user: userwithoutpass,
    })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
}

export const isAuthenticated = async (req, res) => {
  try {
    const id = req.userId

    if (!id) {
      return res.json({
        success: false,
        message: "User Id not found",
      })
    }

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    })
    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      })
    }

    const { password: _, ...userwithoutpass } = user


    return res.json({
      success: true,
      message: "You are Authorized",
      user: userwithoutpass,
    })
  } catch (err) {
    return res.json({
      success: false,
      message: `Internal Server Error: ${err.message}`,
    })
  }
}

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    })
    return res.json({
      success: true,
      message: "Logout Successfully",
    })
  } catch (err) {
    return res.json({
      success: false,
      message: "Internal Server Error",
    })
  }
}
