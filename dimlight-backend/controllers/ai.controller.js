require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

// 👇 THIS WAS MISSING. Make sure this path points to your actual controller file!
const { getWeeklyInsightsInternal } = require("./insights.controller"); 
const AICoachInsight = require("../models/AICoachInsight");

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

exports.getWeeklyAICoach = async (req, res) => {
  try {
    const force = String(req.query.force || '').toLowerCase() === 'true';
    // 1) Check cache for last 24 hours unless forced
    if (!force) {
      const last = await AICoachInsight.findOne({ user: req.user }).sort({ createdAt: -1 });
      if (last && Date.now() - new Date(last.createdAt).getTime() < 24 * 60 * 60 * 1000) {
        return res.json(last.data);
      }
    }

    // Now this function will exist!
    const insightData = await getWeeklyInsightsInternal(req.user);

    if (!insightData) {
      return res.json({
        coachMessage: null // Return null to signal frontend (No data state)
      });
    }

    const { summary, patterns, primaryConcern } = insightData;

    const prompt = `
    You are Remi. An AI sleep coach in an astronaut outfit. Analyze this data and return a JSON object. Keep the tone friendly and supportive. Give space related metaphors.
    
    Data:
    - Avg Sleep: ${summary.avgHours.toFixed(1)}h
    - Quality: ${summary.avgQuality.toFixed(1)}/5
    - Consistency Var: ${summary.consistencyRange} min
    - Patterns: ${patterns ? patterns.join(", ") : "None"}
    
    Return strictly valid JSON with this structure:
    {
      "analysis": "2 sentences analyzing their sleep patterns and issues.",
      "tips": ["Short Tip 1(10 words max)", "Short Tip 2(12 words max)", "Short Tip 3 (10 words max)"],
      "encouragement": "1 short motivating closing sentence."
    }
    `;

    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.7,
      }
    });

    const aiData = JSON.parse(response.text);

    // 2) Save to cache
    await AICoachInsight.create({ user: req.user, data: aiData });
    return res.json(aiData);

  } catch (err) {
    console.error("AI Coach Error:", err);
    
    return res.json({
      analysis: "We couldn't generate a new analysis right now, but consistency is key.",
      tips: [
        "Stick to a consistent bedtime.",
        "Avoid screens 1 hour before bed.",
        "Keep your room cool and dark."
      ],
      encouragement: "Keep tracking your sleep to get better insights!"
    });
  }
};