"use client"
import React, { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { Camera, User, Mail, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import Axios from "../../../axios"

const Page = () => {
  const { user, setUser, authLoading } = useAuth()
  const [isUpdating, setIsUpdating] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (authLoading) return
    if (!user) router.replace("/login")
  }, [user, authLoading])

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    profile: ""
  })

  useEffect(() => {
    if (user) {
      setFormData({
        userName: user.userName || "",
        email: user.email || "",
        password: "",
        profile: user.profile || ""
      })
    }
  }, [user])

  const handleUpload = async (e) => {
    e.preventDefault()
    try {
      setIsUpdating(true)
      const updateData = {
        userName: formData.userName,
        profile: formData.profile,
      }
      if (formData.password.trim() !== "") {
        updateData.password = formData.password
      }
      const res = await Axios.put("/auth/", updateData)
      const data = res.data
      if (data.success) {
        setUser(data.user)
        toast.success("Profile updated successfully")
        router.push("/")
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile")
    } finally {
      setIsUpdating(false)
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      return toast.error("Image must be less than 2MB")
    }
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => {
      setFormData({ ...formData, profile: reader.result })
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        <h1 className="text-3xl font-bold mb-2 dark:text-white text-center">
          My <span className="text-purple-600 dark:text-purple-400">Profile</span>
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-10 text-center">
          Update your personal information
        </p>

        <form onSubmit={handleUpload} className="space-y-6">

          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden ring-2 ring-gray-200 dark:ring-gray-700 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                {formData.profile ? (
                  <img src={formData.profile} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-gray-400 dark:text-gray-600" />
                )}
              </div>
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 bg-purple-600 hover:bg-purple-500 p-1.5 rounded-full cursor-pointer transition-all shadow-md"
              >
                <Camera className="w-3.5 h-3.5 text-white" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            </div>
            <span className="text-[10px] uppercase tracking-widest text-gray-400 dark:text-gray-500 font-semibold">
              Profile Photo
            </span>
          </div>

          <div className="space-y-5">

            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1.5 block">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-600" />
                <input
                  type="text"
                  className="w-full border border-gray-200 dark:border-gray-700 bg-transparent rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder:text-gray-400 dark:text-white"
                  value={formData.userName}
                  onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1.5 block">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-600" />
                <input
                  type="email"
                  disabled
                  className="w-full border border-gray-200 dark:border-gray-700 bg-transparent rounded-xl pl-10 pr-4 py-3 text-sm text-gray-400 dark:text-gray-600 italic cursor-not-allowed"
                  value={formData.email}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1.5 block">
                New Password
              </label>
              <input
                type="password"
                placeholder="Leave blank to keep current"
                className="w-full border border-gray-200 dark:border-gray-700 bg-transparent rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder:text-gray-400 dark:text-white"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

          </div>

          <button
            disabled={isUpdating}
            className="w-full mt-2 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 dark:bg-purple-700 dark:hover:bg-purple-600 text-white font-semibold text-sm tracking-wide shadow-lg shadow-purple-500/20 dark:shadow-purple-900/40 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isUpdating ? (
              <Loader2 className="animate-spin w-4 h-4" />
            ) : (
              "Save Changes"
            )}
          </button>

        </form>
      </div>
    </div>
  )
}

export default Page