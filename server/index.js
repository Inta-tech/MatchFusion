import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import aiRoutes from './routes/ai.js';
import postRoutes from './routes/posts.js';
import matchRoutes from './routes/matches.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Setup ES Module path resolution
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/matches', matchRoutes);

app.get('/', (req, res) => {
  res.send('MatchFusion API is running successfully on Render!');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});