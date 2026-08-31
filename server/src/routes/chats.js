import express from 'express';
import { getAllChats, createChat, getChatById } from '../controllers/chatsController.js';
import { sendMessage } from '../controllers/messagesController.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = express.Router();

router.get('/', requireAuth, getAllChats);
router.post('/', requireAuth, createChat);
router.get('/:chatId', requireAuth, getChatById);
router.post('/:chatId/messages', requireAuth, sendMessage);

export default router;