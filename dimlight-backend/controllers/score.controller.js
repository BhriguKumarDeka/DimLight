const SleepLog = require("../models/SleepLog");
const dayjs = require("dayjs");
const { calculateSleepScore } = require("../utils/sleepScore");

exports.getScoreTrend = async (req, res) => {
  try {
    const userId = req.user;
    let days = req.query.days ? Number(req.query.days) : 7;

    const start = dayjs().subtract(days - 1, "day").format("YYYY-MM-DD");

    const logs = await SleepLog.find({
      userId,
      date: { $gte: start }
    }).sort({ date: 1 });

    // Prepare daily score entries
    let series = [];

    logs.forEach((log) => {
      const summary = {
        avgHours: log.duration,
        avgQuality: log.sleepQuality,
        consistencyRange: 0 // single day → no variability
      };

      const result = calculateSleepScore(summary, log);

      series.push({
        date: log.date,
        score: result.score,
        breakdown: result.breakdown
      });
    });

    res.json({ series });

  } catch (err) {
    console.error("Score trend error:", err);
    res.status(500).json({ message: "Server error fetching score trend" });
  }
};
