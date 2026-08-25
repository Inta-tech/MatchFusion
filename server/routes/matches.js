import express from 'express';
import axios from 'axios';

const router = express.Router();

// Simple in-memory cache
const cache = {
  liveMatches: { data: null, lastFetched: 0 },
  lineups: new Map(),
  injuries: new Map(),
};

const CACHE_TTL = 60 * 1000; // 60 seconds

// 1. Get Live or Today's Scheduled Matches
router.get('/live', async (req, res) => {
  const now = Date.now();

  if (cache.liveMatches.data && (now - cache.liveMatches.lastFetched < CACHE_TTL)) {
    return res.json(cache.liveMatches.data);
  }

  try {
    // Attempt 1: Fetch active live matches
    let response = await axios.get('https://v3.football.api-sports.io/fixtures?live=all', {
      headers: { 'x-apisports-key': process.env.SPORTS_API_KEY }
    });

    let result = response.data.response || [];

    // Attempt 2: Fallback to today's scheduled fixtures if 0 live matches
    if (result.length === 0) {
      const today = new Date().toISOString().split('T')[0];
      response = await axios.get(`https://v3.football.api-sports.io/fixtures?date=${today}`, {
        headers: { 'x-apisports-key': process.env.SPORTS_API_KEY }
      });
      result = (response.data.response || []).slice(0, 10); // Limit to top 10
    }

    cache.liveMatches.data = result;
    cache.liveMatches.lastFetched = now;

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch matches' });
  }
});

// 2. Get Match Lineups & Squads
router.get('/:fixtureId/lineups', async (req, res) => {
  const { fixtureId } = req.params;
  const now = Date.now();
  const cached = cache.lineups.get(fixtureId);

  if (cached && (now - cached.lastFetched < CACHE_TTL)) {
    return res.json(cached.data);
  }

  try {
    const response = await axios.get(`https://v3.football.api-sports.io/fixtures/lineups?fixture=${fixtureId}`, {
      headers: { 'x-apisports-key': process.env.SPORTS_API_KEY }
    });
    const result = response.data.response || [];

    cache.lineups.set(fixtureId, { data: result, lastFetched: now });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch lineups' });
  }
});

// 3. Get Player Injuries for Match
router.get('/:fixtureId/injuries', async (req, res) => {
  const { fixtureId } = req.params;
  const now = Date.now();
  const cached = cache.injuries.get(fixtureId);

  if (cached && (now - cached.lastFetched < CACHE_TTL)) {
    return res.json(cached.data);
  }

  try {
    const response = await axios.get(`https://v3.football.api-sports.io/injuries?fixture=${fixtureId}`, {
      headers: { 'x-apisports-key': process.env.SPORTS_API_KEY }
    });
    const result = response.data.response || [];

    cache.injuries.set(fixtureId, { data: result, lastFetched: now });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch injuries' });
  }
});

export default router;