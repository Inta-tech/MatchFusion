import express from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../db.js';

const router = express.Router();

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access token required' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: { select: { username: true } },
        comments: { include: { author: { select: { username: true } } } },
        reactions: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new post
router.post('/', authenticateToken, async (req, res) => {
  const { content, sportType } = req.body;
  try {
    const post = await prisma.post.create({
      data: {
        content,
        sportType: sportType || 'FOOTBALL',
        authorId: req.user.userId
      },
      include: { author: { select: { username: true } } }
    });
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;