import express from 'express';
import cors from 'cors';
import session from 'express-session';
import prisma from "./db/client.js"
import authRoutes from './routes/auth.js';
import profilesRoutes from './routes/profiles.js';
import chatsRoutes from './routes/chats.js';

const app = express();

const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';
const isProduction = process.env.NODE_ENV === 'production';

app.set('trust proxy', 1);

app.use(cors({ origin: allowedOrigin, credentials: true }));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-secret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
  },
}));

app.use('/api/auth', authRoutes);
app.use('/api/profiles', profilesRoutes);
app.use('/api/chats', chatsRoutes);

export { app, prisma };