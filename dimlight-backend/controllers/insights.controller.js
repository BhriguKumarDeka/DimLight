const SleepLog = require("../models/SleepLog");
const dayjs = require("dayjs");
const { calculateStats } = require("../utils/calculateStats");
const { detectPatterns } = require("../utils/detectPatterns");
const { calculateSleepScore } = require("../utils/sleepScore");


exports.getWeeklyInsights = async (req, res) => {
  try {
    const today = dayjs().format("YYYY-MM-DD");
    const startDate = dayjs().subtract(6, "day").format("YYYY-MM-DD");

    const logs = await SleepLog.find({
      userId: req.user,
      date: {
        $gte: startDate,
        $lte: today
      }
    }).sort({ date: 1 });

    //Build summary
    const summary = calculateStats(logs);
    // Build patterns and recommendations
    const { patterns, recommendations } = detectPatterns(logs, summary);

    // Primary Concern
    let primaryConcern = null;

    const text = patterns.join(" ").toLowerCase();

    if (text.includes("stress")) primaryConcern = "stress";
    else if (text.includes("caffeine")) primaryConcern = "poor sleep";
    else if (text.includes("bedtime")) primaryConcern = "routine";
    else if (text.includes("sleep quality")) primaryConcern = "insomnia";

    const latestLog = logs[logs.length - 1] || {};
    const scoreData = calculateSleepScore(summary, latestLog);

    return res.json({
      summary,
      patterns,
      recommendations,
      primaryConcern,
      logs,
      sleepScore: scoreData.score,
      scoreBreakdown: scoreData.breakdown
    });

  } catch (err) {
    console.error("Insights Error:", err);
    res.status(500).json({ message: "Error generating insights" });
  }
};

exports.getTodayInsight = async (req, res) => {
  try {
    const today = dayjs().format("YYYY-MM-DD");

    const log = await SleepLog.findOne({
      userId: req.user,
      date: today
    });

    let message;

    if (!log) {
      message = "No sleep log for today yet.";
    } else if (log.sleepQuality <= 2) {
      message = "Your sleep seems rough last night. Try a short relaxation routine tonight.";
    } else if (log.sleepQuality === 3) {
      message = "Sleep was okay, but there’s room for improvement. A consistent bedtime could help.";
    } else {
      message = "Nice! You slept fairly well. Keep maintaining this routine.";
    }

    return res.json({ message });

  } catch (err) {
    console.error("Today insight error:", err);
    res.status(500).json({ message: "Error fetching today insight" });
  }
};

exports.getWeeklyInsightsInternal = async (userId) => {
  const logs = await SleepLog.find({ userId }).sort({ date: 1 });

  if (logs.length === 0) return null;

  const summary = calculateStats(logs);
  const { patterns, recommendations } = detectPatterns(logs, summary);

  let primaryConcern = null;
  const text = patterns.join(" ").toLowerCase();

  if (text.includes("stress")) primaryConcern = "stress";
  else if (text.includes("bedtime")) primaryConcern = "routine";
  else if (text.includes("quality")) primaryConcern = "insomnia";

  return {
    summary,
    patterns,
    recommendations,
    primaryConcern
  };
};

