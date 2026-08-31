import prisma from "../db/client.js";

// GET /api/chats
export async function getAllChats(req, res) {
  try {
    const chats = await prisma.chat.findMany({
      where: {
        profiles: {
          some: { id: req.session.userId },
        },
      },
      select: {
        id: true,
        name: true,
        chatImg: true,
        isGroup: true,
        createdAt: true,
        profiles: {
          select: { id: true, username: true, name: true, imageUrl: true, lastSeenAt: true },
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { id: true, content: true, imageUrl: true, createdAt: true, senderId: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(chats);
  } catch (error) {
    console.error("Error in getting all chats:", error);
    res.status(500).json({ error: "Error in the server" });
  }
}

// POST   /api/chats
export async function createChat(req, res) {
  const { profileIds, name } = req.body;
  const currentUserId = req.session.userId;

  if (!Array.isArray(profileIds) || profileIds.length === 0) {
    return res
      .status(400)
      .json({ error: "You have to choose at least one user" });
  }

  const allParticipantIds = [...new Set([currentUserId, ...profileIds])];
  const isGroup = allParticipantIds.length > 2;

  try {
    if (!isGroup) {
      const otherUserId = allParticipantIds.find((id) => id !== currentUserId);

      const existingChat = await prisma.chat.findFirst({
        where: {
          isGroup: false,
          AND: [
            { profiles: { some: { id: currentUserId } } },
            { profiles: { some: { id: otherUserId } } },
          ],
        },
        include: {
          profiles: {
            select: { id: true, username: true, name: true, imageUrl: true, lastSeenAt: true },
          },
        },
      });

      if (existingChat) {
        return res.json(existingChat);
      }
    }

    if (isGroup && !name?.trim()) {
      return res.status(400).json({ error: "Group chat must have name" });
    }

    const newChat = await prisma.chat.create({
      data: {
        isGroup,
        name: isGroup ? name.trim() : null,
        profiles: {
          connect: allParticipantIds.map((id) => ({ id })),
        },
      },
      include: {
        profiles: {
          select: { id: true, username: true, name: true, imageUrl: true, lastSeenAt: true },
        },
      },
    });

    res.status(201).json(newChat);
  } catch (error) {
    console.error("Error in creating chat:", error);
    res.status(500).json({ error: "Error in the server" });
  }
}

// GET    /api/chats/:chatId
export async function getChatById(req, res) {
  try {
    const { chatId } = req.params;
    const chat = await prisma.chat.findFirst({
      where: { id: chatId },
      select: {
        id: true,
        name: true,
        chatImg: true,
        isGroup: true,
        createdAt: true,
        profiles: {
          select: { id: true, username: true, name: true, imageUrl: true, lastSeenAt: true },
        },
        messages: {
          orderBy: { createdAt: "asc" },
          select: {
            id: true,
            content: true,
            imageUrl: true,
            createdAt: true,
            senderId: true,
          },
        },
      },
    });

    if (!chat) return res.status(404).json({ error: "Chat not found" });

    const isMember = chat.profiles.some((p) => p.id === req.session.userId);
    if (!isMember) {
      return res.status(403).json({ error: "You do not have access" });
    }

    res.json(chat);
  } catch (error) {
    res.status(500).json({ error: "Error in the server" });
  }
}
