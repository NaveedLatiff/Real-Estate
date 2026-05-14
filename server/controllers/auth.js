import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import cloudinary from "../config/cloudinary.js";

export const register = async (req, res) => {
  
}

export const login = async (req, res) => {
  
}

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
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

export const isAuthenticated = async (req, res) => {
 
}

export const updateProfile = async (req, res) => {

}
