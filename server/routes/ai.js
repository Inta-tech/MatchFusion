import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();

router.post('/match-insights', async (req, res) => {
  const { teamA, teamB, sport, recentForm } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is missing in .env file' });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Line 20 updated to gemini-3.6-flash
    const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' });

    const prompt = `Analyze the upcoming ${sport} match between ${teamA} and ${teamB}.
    Recent Form: ${JSON.stringify(recentForm || {})}.
    Provide calculated win probabilities as integers summing to 100: probA, probB, and probDraw.
    Also provide 2 short tactical insights.
    Return strictly a JSON object with keys: "probA", "probB", "probDraw", "insights" (array of strings). Do not include markdown formatting.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().replace(/```json|```/g, '').trim();
    const insights = JSON.parse(responseText);

    res.status(200).json({ success: true, teamA, teamB, insights });
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch AI insights' });
  }
});

export default router;