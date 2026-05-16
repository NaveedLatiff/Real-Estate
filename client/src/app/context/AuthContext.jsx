"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"

import Axios from "../../../axios.js"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  // split loading (IMPORTANT FIX)
  const [authLoading, setAuthLoading] = useState(true)
  const [loading, setLoading] = useState(false)

  // CHECK AUTH
  const checkAuth = async () => {
    try {
      const res = await Axios.get("/auth/check-auth")

      if (res.data.success) {
        setUser(res.data.user)
      } else {
        setUser(null)
      }
    } catch (err) {
      console.log(err)
      setUser(null)
    } finally {
      setAuthLoading(false)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  // LOGIN
  const login = async (formData) => {
    try {
      setLoading(true)

      const res = await Axios.post("/auth/login", {
        email: formData.email?.trim(),
        password: formData.password,
      })

      if (res.data.success) {
        setUser(res.data.user)
      }
      console.log("login response:", res.data)

      return res.data

    } catch (err) {
      console.log(err)

      return {
        success: false,
        message:
          err.response?.data?.message || "Login failed",
      }
    } finally {
      setLoading(false)
    }
  }

  // SIGNUP
  const signup = async (formData) => {
    try {
      setLoading(true)

      const res = await Axios.post("/auth/register", {
        userName: formData.userName?.trim(),
        email: formData.email?.trim(),
        password: formData.password,
      })

      if (res.data.success) {
        setUser(res.data.user)
      }

      return res.data
    } catch (err) {
      console.log(err)

      return {
        success: false,
        message:
          err.response?.data?.message || "Signup failed",
      }
    } finally {
      setLoading(false)
    }
  }

  // LOGOUT
  const logout = async () => {
    try {
      await Axios.post("/auth/logout")
      setUser(null)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,        
        authLoading,    
        checkAuth,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)