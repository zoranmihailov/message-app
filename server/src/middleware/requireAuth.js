import prisma from '../db/client.js';

export function requireAuth(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'You must be logged in' });
  }

  prisma.profile
    .update({
      where: { id: req.session.userId },
      data: { lastSeenAt: new Date() },
    })
    .catch((err) => console.error('Failed to update lastSeenAt:', err));

  next();
}