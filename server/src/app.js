import express from 'express';
import cors from 'cors';
import prisma from "./db/client.js"
import authRoutes from './routes/auth.js';
import profilesRoutes from './routes/profiles.js';
import chatsRoutes from './routes/chats.js';

const app = express();

const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(cors({ origin: allowedOrigin }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/profiles', profilesRoutes);
app.use('/api/chats', chatsRoutes);

export { app, prisma };