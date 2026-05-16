"use client"
import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Axios from "../../../axios.js"
import { useSocket } from "../context/Socketcontext.jsx"
import { useAuth } from "../context/AuthContext.jsx"

const formatTime = (date) =>
  new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

const Page = () => {
  const { user, authLoading } = useAuth()
  const { socket, onlineUsers } = useSocket()
  const router = useRouter()

  const [chats, setChats] = useState([])
  const [activeChat, setActiveChat] = useState(null)
  const [messages, setMessages] = useState([])
  const [text, setText] = useState("")
  const [loadingChats, setLoadingChats] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    if (authLoading) return
    if (!user) router.replace("/login")
  }, [user, authLoading])

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await Axios.get("/chat/")
        setChats(res.data.chats)
      } catch (err) {
        console.log(err)
      } finally {
        setLoadingChats(false)
      }
    }
    fetchChats()
  }, [])

  useEffect(() => {
    if (!activeChat) return
    const fetchMessages = async () => {
      try {
        setLoadingMessages(true)
        const res = await Axios.get(`/chat/${activeChat.id}`)
        setMessages(res.data.chat.messages)
      } catch (err) {
        console.log(err)
      } finally {
        setLoadingMessages(false)
      }
    }
    fetchMessages()
  }, [activeChat])

  useEffect(() => {
    if (!socket) return
    socket.on("newMessage", ({ chatId, message }) => {
      if (activeChat?.id === chatId) {
        setMessages((prev) => [...prev, message])
      }
      setChats((prev) =>
        prev.map((c) =>
          c.id === chatId
            ? { ...c, messages: [message], updatedAt: new Date() }
            : c
        )
      )
    })
    return () => socket.off("newMessage")
  }, [socket, activeChat])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!text.trim() || !activeChat) return
    try {
      const res = await Axios.post(`/chat/${activeChat.id}/messages`, { text })
      const message = res.data.message
      const receiver = activeChat.users[0]
      socket?.emit("sendMessage", {
        chatId: activeChat.id,
        message: { ...message, receiverId: receiver.id },
      })
      setMessages((prev) => [...prev, message])
      setChats((prev) =>
        prev.map((c) =>
          c.id === activeChat.id
            ? { ...c, messages: [message], updatedAt: new Date() }
            : c
        )
      )
      setText("")
    } catch (err) {
      console.log(err)
    }
  }

  const receiver = activeChat?.users?.[0]
  const isOnline = receiver && onlineUsers.includes(receiver.id)

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">

      <div className="w-72 flex-shrink-0 border-r border-gray-100 dark:border-gray-800 flex flex-col">

        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <h1 className="text-lg font-semibold dark:text-white">Messages</h1>
          <p className="text-xs text-gray-400 dark:text-gray-600 mt-0.5">
            {chats.length} conversation{chats.length !== 1 && "s"}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {loadingChats ? (
            <div className="flex flex-col gap-1 p-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3 p-3 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 animate-pulse flex-shrink-0" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded animate-pulse w-1/2" />
                    <div className="h-2.5 bg-gray-100 dark:bg-gray-800 rounded animate-pulse w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : chats.length === 0 ? (
            <div className="flex items-center justify-center h-40">
              <p className="text-xs text-gray-400 dark:text-gray-600">No conversations yet</p>
            </div>
          ) : (
            <div className="p-3 flex flex-col gap-1">
              {chats.map((chat) => {
                const other = chat.users[0]
                const lastMsg = chat.messages[0]
                const isActive = activeChat?.id === chat.id
                const isOtherOnline = onlineUsers.includes(other?.id)

                return (
                  <button
                    key={chat.id}
                    onClick={() => setActiveChat(chat)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors cursor-pointer ${
                      isActive
                        ? "bg-purple-50 dark:bg-purple-950/30"
                        : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        {other?.profile ? (
                          <img src={other.profile} alt={other.userName} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-sm font-semibold text-gray-400 dark:text-gray-600">
                            {other?.userName?.[0]?.toUpperCase()}
                          </span>
                        )}
                      </div>
                      {isOtherOnline && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full ring-2 ring-white dark:ring-gray-950" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                        {other?.userName}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-600 truncate mt-0.5">
                        {lastMsg?.text || "No messages yet"}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        {!activeChat ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm text-gray-400 dark:text-gray-600">
              Select a conversation to start chatting
            </p>
          </div>
        ) : (
          <>
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  {receiver?.profile ? (
                    <img src={receiver.profile} alt={receiver.userName} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-sm font-semibold text-gray-400 dark:text-gray-600">
                      {receiver?.userName?.[0]?.toUpperCase()}
                    </span>
                  )}
                </div>
                {isOnline && (
                  <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full ring-2 ring-white dark:ring-gray-950" />
                )}
              </div>
              <div>
                <p className="text-sm font-semibold dark:text-white">{receiver?.userName}</p>
                <p className="text-xs text-gray-400 dark:text-gray-600">
                  {isOnline ? "Online" : "Offline"}
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-hide px-6 py-4 flex flex-col gap-3">
              {loadingMessages ? (
                <div className="flex-1 flex items-center justify-center">
                  <span className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-xs text-gray-400 dark:text-gray-600">No messages yet. Say hello!</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isMine = msg.userId === user?.id
                  return (
                    <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-sm ${
                        isMine
                          ? "bg-purple-600 text-white rounded-br-sm"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-sm"
                      }`}>
                        <p>{msg.text}</p>
                        <p className={`text-[10px] mt-1 ${isMine ? "text-purple-200" : "text-gray-400 dark:text-gray-600"}`}>
                          {formatTime(msg.createdAt)}
                        </p>
                      </div>
                    </div>
                  )
                })
              )}
              <div ref={bottomRef} />
            </div>

            <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800">
              <form onSubmit={handleSend} className="flex gap-3">
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 border border-gray-200 dark:border-gray-700 bg-transparent rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder:text-gray-400 dark:text-white"
                />
                <button
                  type="submit"
                  disabled={!text.trim()}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold transition-colors disabled:opacity-40 cursor-pointer"
                >
                  Send
                </button>
              </form>
            </div>
          </>
        )}
      </div>

    </div>
  )
}

export default Page