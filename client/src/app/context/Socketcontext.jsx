"use client"
import { createContext, useContext, useEffect, useState } from "react"
import { io } from "socket.io-client"
import { useAuth } from "./AuthContext"

const SocketContext = createContext(null)

export const SocketProvider = ({ children }) => {
  const { user } = useAuth()
  const [socket, setSocket] = useState(null)
  const [onlineUsers, setOnlineUsers] = useState([])

  useEffect(() => {
    if (!user) return

    const s = io("http://localhost:3003", {
      query: { userId: user.id },
      withCredentials: true,
    })

    s.on("onlineUsers", (users) => setOnlineUsers(users))

    setSocket(s)

    return () => s.disconnect()
  }, [user])

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => useContext(SocketContext)