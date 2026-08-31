import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../db/client.js';

const SALT_ROUNDS = 10;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function generateToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'dev-jwt-secret', { expiresIn: '7d' });
}

// POST /api/auth/register
export async function register(req, res) {
  const { username, email, password, name } = req.body;
  if (!username || !email || !password || !name) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  if (!EMAIL_REGEX.test(email)) {
    return res.status(400).json({ error: 'Not an email format' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }
  try {
    const existing = await prisma.profile.findFirst({
      where: { OR: [{ username }, { email }] },
    });
    if (existing) {
      const field = existing.username === username ? 'Username' : 'Email';
      return res.status(409).json({ error: `${field} is taken` });
    }
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const profile = await prisma.profile.create({
      data: { username, email, password: hashedPassword, name },
      select: { id: true, username: true, email: true, name: true, imageUrl: true },
    });
    const token = generateToken(profile.id);
    res.status(201).json({ ...profile, token });
  } catch (error) {
    console.error('Error in registration:', error);
    res.status(500).json({ error: 'Error in the server while registering' });
  }
}

// POST /api/auth/login
export async function login(req, res) {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  try {
    const profile = await prisma.profile.findUnique({ where: { username } });
    if (!profile) {
      return res.status(401).json({ error: 'Incorrect username or password' });
    }
    const passwordMatches = await bcrypt.compare(password, profile.password);
    if (!passwordMatches) {
      return res.status(401).json({ error: 'Incorrect username or password' });
    }
    await prisma.profile.update({
      where: { id: profile.id },
      data: { lastSeenAt: new Date() },
    });
    const token = generateToken(profile.id);
    res.json({
      id: profile.id,
      username: profile.username,
      email: profile.email,
      name: profile.name,
      imageUrl: profile.imageUrl,
      token,
    });
  } catch (error) {
    console.error('Error in logging:', error);
    res.status(500).json({ error: 'Error in the server while logging' });
  }
}

// POST /api/auth/logout
export function logout(req, res) {
  res.json({ message: 'Successfull logout' });
}

// GET /api/auth/me
export async function getMe(req, res) {
  try {
    const profile = await prisma.profile.findUnique({
      where: { id: req.userId },
      select: {
        id: true, username: true, email: true, name: true,
        imageUrl: true, bio: true, edu: true,
      },
    });
    if (!profile) {
      return res.status(404).json({ error: 'Profile does not exist' });
    }
    res.json(profile);
  } catch (error) {
    console.error('Error in profile loading:', error);
    res.status(500).json({ error: 'Error in the server' });
  }
}