"use client"
import { useRouter } from "next/navigation"
import { useAuth } from "../context/AuthContext"
import Axios from "../../../axios"
import { toast } from "react-toastify"
import { useState } from "react"

const MessageButton = ({ ownerId }) => {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    if (!user) return router.push("/login")
    if (user.id === ownerId) return
    try {
      setLoading(true)
      await Axios.post("/chat/", { receiverId: ownerId })
      router.push("/chat")
    } catch (err) {
      toast.error("Could not start conversation")
    } finally {
      setLoading(false)
    }
  }

  if (user?.id === ownerId) return null

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="flex-1 border py-3 rounded-md flex items-center justify-center gap-2 cursor-pointer text-sm font-medium disabled:opacity-50"
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin inline-block" />
      ) : (
        "Send a Message"
      )}
    </button>
  )
}

export default MessageButton