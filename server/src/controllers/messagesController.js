import prisma from "../db/client.js";

// POST /api/chats/:chatId/messages
export async function sendMessage(req, res) {
  const { chatId } = req.params;
  const { content, imageUrl } = req.body;
  const currentUserId = req.session.userId;

  if (!content?.trim() && !imageUrl?.trim()) {
    return res.status(400).json({ error: "Message must have text or an image" });
  }

  try {
    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      select: { id: true, profiles: { select: { id: true } } },
    });

    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    const isMember = chat.profiles.some((p) => p.id === currentUserId);
    if (!isMember) {
      return res.status(403).json({ error: "You do not have access" });
    }

    const message = await prisma.message.create({
      data: {
        content: content?.trim() || null,
        imageUrl: imageUrl?.trim() || null,
        senderId: currentUserId,
        chatId: chat.id,
      },
      select: {
        id: true,
        content: true,
        imageUrl: true,
        createdAt: true,
        senderId: true,
      },
    });

    res.status(201).json(message);
  } catch (error) {
    console.error("Error in sending message:", error);
    res.status(500).json({ error: "Error in the server" });
  }
}