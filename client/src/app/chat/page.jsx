"use client"
import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Axios from "../../../axios.js"
import { useSocket } from "../context/Socketcontext.jsx"
import { useAuth } from "../context/AuthContext.jsx"

const formatTime = (date) =>
  new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

const sortChats = (chats) =>
  [...chats].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))

const Ticks = ({ status }) => {
  if (status === "sent") {
    return (
      <svg width="16" height="11" viewBox="0 0 16 11" style={{ display: "inline-block", verticalAlign: "middle" }}>
        <path d="M11.071.653a.75.75 0 0 1 .033 1.06l-6.5 7a.75.75 0 0 1-1.107-.012L1.22 5.884a.75.75 0 1 1 1.12-.998l1.69 1.898 5.98-6.464a.75.75 0 0 1 1.061-.067Z" fill="#8696a0" />
      </svg>
    )
  }
  const color = status === "seen" ? "#53bdeb" : "#8696a0"
  return (
    <svg width="18" height="11" viewBox="0 0 18 11" style={{ display: "inline-block", verticalAlign: "middle" }}>
      <path d="M17.071.653a.75.75 0 0 1 .033 1.06l-6.5 7a.75.75 0 0 1-1.107-.012L7.22 5.884a.75.75 0 1 1 1.12-.998l1.69 1.898 5.98-6.464a.75.75 0 0 1 1.061-.067Z" fill={color} />
      <path d="M11.071.653a.75.75 0 0 1 .033 1.06l-6.5 7a.75.75 0 0 1-1.107-.012L1.22 5.884a.75.75 0 1 1 1.12-.998l1.69 1.898 5.98-6.464a.75.75 0 0 1 1.061-.067Z" fill={color} />
    </svg>
  )
}

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
  const [unreadCounts, setUnreadCounts] = useState({})
  const bottomRef = useRef(null)

  const showChat = !!activeChat

  useEffect(() => {
    if (!authLoading && !user) router.replace("/login")
  }, [user, authLoading])

  useEffect(() => {
    Axios.get("/chat/")
      .then((res) => {
        const sorted = sortChats(res.data.chats)
        setChats(sorted)
        const counts = {}
        sorted.forEach((c) => {
          const lastMsg = c.messages[0]
          if (lastMsg && lastMsg.userId !== user?.id && !(c.seenBy || []).includes(user?.id)) {
            counts[c.id] = 1
          }
        })
        setUnreadCounts(counts)
      })
      .catch(console.log)
      .finally(() => setLoadingChats(false))
  }, [])

  useEffect(() => {
    if (!activeChat) return
    setLoadingMessages(true)
    setUnreadCounts((prev) => ({ ...prev, [activeChat.id]: 0 }))
    Axios.get(`/chat/${activeChat.id}`)
      .then((res) => {
        setMessages(res.data.chat.messages)
        setChats((prev) =>
          prev.map((c) =>
            c.id === activeChat.id
              ? { ...c, seenBy: [...new Set([...(c.seenBy || []), user.id])] }
              : c
          )
        )
        const other = activeChat.users?.[0]
        if (other && socket) socket.emit("markSeen", { chatId: activeChat.id, senderId: other.id })
      })
      .catch(console.log)
      .finally(() => setLoadingMessages(false))
  }, [activeChat])

  useEffect(() => {
    if (!socket) return

    socket.on("newMessage", ({ chatId, message }) => {
      if (activeChat?.id === chatId) {
        setMessages((prev) => [...prev, message])
        socket.emit("markSeen", { chatId, senderId: message.userId })
      } else {
        setUnreadCounts((prev) => ({ ...prev, [chatId]: (prev[chatId] || 0) + 1 }))
      }
      setChats((prev) =>
        sortChats(
          prev.map((c) =>
            c.id !== chatId ? c : {
              ...c,
              messages: [message],
              updatedAt: new Date().toISOString(),
              seenBy: activeChat?.id === chatId
                ? [...new Set([...(c.seenBy || []), user?.id])]
                : (c.seenBy || []).filter((id) => id !== user?.id),
            }
          )
        )
      )
    })

    socket.on("messageSeen", ({ chatId }) => {
      setMessages((prev) =>
        prev.map((m) =>
          m.chatId === chatId && m.userId === user?.id ? { ...m, seen: true } : m
        )
      )
    })

    return () => { socket.off("newMessage"); socket.off("messageSeen") }
  }, [socket, activeChat, user])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!text.trim() || !activeChat) return

    const tempId = `temp-${Date.now()}`
    const snapshot = text
    const optimistic = {
      id: tempId, text: snapshot, userId: user.id,
      chatId: activeChat.id, createdAt: new Date().toISOString(), _sending: true,
    }

    setMessages((prev) => [...prev, optimistic])
    setText("")
    setChats((prev) =>
      sortChats(prev.map((c) =>
        c.id === activeChat.id ? { ...c, messages: [optimistic], updatedAt: new Date().toISOString() } : c
      ))
    )

    try {
      const { data } = await Axios.post(`/chat/${activeChat.id}/messages`, { text: snapshot })
      const message = data.message
      setMessages((prev) => prev.map((m) => (m.id === tempId ? message : m)))
      socket?.emit("sendMessage", {
        chatId: activeChat.id,
        message: { ...message, receiverId: activeChat.users[0].id },
      })
      setChats((prev) =>
        sortChats(prev.map((c) =>
          c.id === activeChat.id ? { ...c, messages: [message], updatedAt: new Date().toISOString() } : c
        ))
      )
    } catch (err) {
      setMessages((prev) => prev.filter((m) => m.id !== tempId))
      setText(snapshot)
      console.log(err)
    }
  }

  const handleClose = () => {
    setActiveChat(null)
    setMessages([])
  }

  const getTickStatus = (msg) => {
    if (msg._sending) return "sent"
    if (msg.seen) return "seen"
    return onlineUsers.includes(activeChat?.users?.[0]?.id) ? "delivered" : "sent"
  }

  const receiver = activeChat?.users?.[0]
  const isOnline = receiver && onlineUsers.includes(receiver.id)

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">

      <div className={`
        flex-shrink-0 border-r border-gray-100 dark:border-gray-800 flex flex-col bg-white dark:bg-gray-950
        w-full md:w-72
        ${showChat ? "hidden md:flex" : "flex"}
      `}>
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <h1 className="text-lg font-semibold dark:text-white">Messages</h1>
          <p className="text-xs text-gray-400 mt-0.5">{chats.length} conversation{chats.length !== 1 && "s"}</p>
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
              <p className="text-xs text-gray-400">No conversations yet</p>
            </div>
          ) : (
            <div className="p-3 flex flex-col gap-1">
              {chats.map((chat) => {
                const other = chat.users[0]
                const lastMsg = chat.messages[0]
                const isActive = activeChat?.id === chat.id
                const unread = unreadCounts[chat.id] || 0
                const hasUnread = !isActive && unread > 0

                return (
                  <button
                    key={chat.id}
                    onClick={() => setActiveChat(chat)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors cursor-pointer ${
                      isActive ? "bg-purple-50 dark:bg-purple-950/30"
                      : hasUnread ? "bg-purple-50/70 dark:bg-purple-950/20 hover:bg-purple-100/60 dark:hover:bg-purple-950/30"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        {other?.profile
                          ? <img src={other.profile} alt={other.userName} className="w-full h-full object-cover" />
                          : <span className="text-sm font-semibold text-gray-400">{other?.userName?.[0]?.toUpperCase()}</span>
                        }
                      </div>
                      {onlineUsers.includes(other?.id) && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full ring-2 ring-white dark:ring-gray-950" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p className={`text-sm truncate ${hasUnread ? "font-semibold text-gray-900 dark:text-white" : "font-medium text-gray-800 dark:text-gray-200"}`}>
                          {other?.userName}
                        </p>
                        {hasUnread && (
                          <span className="flex-shrink-0 min-w-[18px] h-[18px] px-1 rounded-full bg-purple-600 text-white text-[10px] font-semibold flex items-center justify-center">
                            {unread > 99 ? "99+" : unread}
                          </span>
                        )}
                      </div>
                      <p className={`text-xs truncate mt-0.5 ${hasUnread ? "text-gray-700 dark:text-gray-300 font-medium" : "text-gray-400 dark:text-gray-600"}`}>
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

      <div className={`
        flex-1 flex flex-col min-w-0 bg-white dark:bg-gray-950
        ${showChat ? "flex" : "hidden md:flex"}
      `}>
        {!activeChat ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm text-gray-400">Select a conversation to start chatting</p>
          </div>
        ) : (
          <>
            <div className="px-4 md:px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
              <button
                onClick={handleClose}
                className="cursor-pointer md:hidden p-1.5 -ml-1 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Back"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <div className="relative">
                <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  {receiver?.profile
                    ? <img src={receiver.profile} alt={receiver.userName} className="w-full h-full object-cover" />
                    : <span className="text-sm font-semibold text-gray-400">{receiver?.userName?.[0]?.toUpperCase()}</span>
                  }
                </div>
                {isOnline && <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full ring-2 ring-white dark:ring-gray-950" />}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold dark:text-white truncate">{receiver?.userName}</p>
                <p className="text-xs text-gray-400">{isOnline ? "Online" : "Offline"}</p>
              </div>

              <button
                onClick={handleClose}
                className="cursor-pointer hidden md:flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Close chat"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-hide px-4 md:px-6 py-4 flex flex-col gap-3">
              {loadingMessages ? (
                <div className="flex-1 flex items-center justify-center">
                  <span className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-xs text-gray-400">No messages yet. Say hello!</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isMine = msg.userId === user?.id
                  return (
                    <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[75vw] md:max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-sm ${
                        isMine ? "bg-purple-600 text-white rounded-br-sm" : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-sm"
                      }`}>
                        <p>{msg.text}</p>
                        <div className="flex items-center justify-end gap-1 mt-1">
                          <p className={`text-[10px] ${isMine ? "text-purple-200" : "text-gray-400"}`}>
                            {formatTime(msg.createdAt)}
                          </p>
                          {isMine && <Ticks status={getTickStatus(msg)} />}
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
              <div ref={bottomRef} />
            </div>

            <div className="px-4 md:px-6 py-4 border-t border-gray-100 dark:border-gray-800">
              <form onSubmit={handleSend} className="flex gap-2 md:gap-3">
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
                  className="px-4 md:px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold transition-colors disabled:opacity-40 cursor-pointer"
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