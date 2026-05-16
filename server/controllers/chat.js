import prisma from "../config/db.js"


export const getChats = async (req, res) => {
  const userId = req.userId
  try {
    const chats = await prisma.chat.findMany({
      where: { userIDs: { has: userId } },
      include: {
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        users: {
          where: { id: { not: userId } },
          select: { id: true, userName: true, profile: true },
        },
      },
      orderBy: { updatedAt: "desc" },
    })
    res.json({ success: true, chats })
  } catch (err) {
    res.json({ success: false, message: err.message })
  }
}

export const getChat = async (req, res) => {
  const userId = req.userId
  try {
    const chat = await prisma.chat.findUnique({
      where: { id: req.params.id },
      include: {
        messages: { orderBy: { createdAt: "asc" } },
        users: {
          where: { id: { not: userId } },
          select: { id: true, userName: true, profile: true },
        },
      },
    })
    if (!chat || !chat.userIDs.includes(userId)) {
      return res.status(403).json({ success: false, message: "Access denied" })
    }
    await prisma.chat.update({
      where: { id: req.params.id },
      data: { seenBy: { push: userId } },
    })
    res.json({ success: true, chat })
  } catch (err) {
    res.json({ success: false, message: err.message })
  }
}

export const createChat = async (req, res) => {
  const userId = req.userId
  const { receiverId } = req.body
  try {
    const existing = await prisma.chat.findFirst({
      where: {
        AND: [
          { userIDs: { has: userId } },
          { userIDs: { has: receiverId } },
        ],
      },
    })
    if (existing) return res.json({ success: true, chat: existing })

    const chat = await prisma.chat.create({
      data: {
        userIDs: [userId, receiverId],
        users: { connect: [{ id: userId }, { id: receiverId }] },
        seenBy: [userId],
      },
    })
    res.json({ success: true, chat })
  } catch (err) {
    res.json({ success: false, message: `Internal Server Error: ${err.message}` })
  }
}

export const sendMessage = async (req, res) => {
  const userId = req.userId
  const { text } = req.body
  try {
    const chat = await prisma.chat.findUnique({
      where: { id: req.params.id },
    })
    if (!chat || !chat.userIDs.includes(userId)) {
      return res.status(403).json({ success: false, message: "Access denied" })
    }
    const message = await prisma.message.create({
      data: {
        text,
        userId,
        chatId: req.params.id,
      },
    })
    await prisma.chat.update({
      where: { id: req.params.id },
      data: {
        seenBy: [userId],
        updatedAt: new Date(),
      },
    })
    res.json({ success: true, message })
  } catch (err) {
    res.json({ success: false, message: err.message })
  }
}