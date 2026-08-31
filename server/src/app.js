import express from 'express';
import cors from 'cors';
import session from 'express-session';
import prisma from "./db/client.js"
import authRoutes from './routes/auth.js';
import profilesRoutes from './routes/profiles.js';
import chatsRoutes from './routes/chats.js';

const app = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
}));

app.use('/api/auth', authRoutes);
app.use('/api/profiles', profilesRoutes);
app.use('/api/chats', chatsRoutes);

export { app, prisma };