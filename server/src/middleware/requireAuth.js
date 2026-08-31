import jwt from 'jsonwebtoken';
import prisma from '../db/client.js';

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'You must be logged in' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-jwt-secret');
    req.userId = decoded.userId;
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  prisma.profile
    .update({
      where: { id: req.userId },
      data: { lastSeenAt: new Date() },
    })
    .catch((err) => console.error('Failed to update lastSeenAt:', err));

  next();
}