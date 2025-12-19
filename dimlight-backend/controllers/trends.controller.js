const SleepLog = require("../models/SleepLog");
const dayjs = require("dayjs");

exports.getTrends = async (req, res) => {
  try {
    const userId = req.user;
    const range = req.query.range || "week";
    let days = range === "month" ? 30 : 7;

    const start = dayjs().subtract(days - 1, "day").format("YYYY-MM-DD");

    const logs = await SleepLog.find({
      userId,
      date: { $gte: start }
    }).sort({ date: 1 });

    // Build date → entry map
    let series = [];
    for (let i = 0; i < days; i++) {
      const d = dayjs().subtract(days - 1 - i, "day").format("YYYY-MM-DD");
      const log = logs.find((l) => l.date === d);

      series.push({
        date: d,
        duration: log ? Number(log.duration.toFixed(2)) : null,
        quality: log ? log.sleepQuality : null
      });
    }

    res.json({ series });
  } catch (error) {
    console.error("Trends error:", error);
    res.status(500).json({ message: "Error fetching trends" });
  }
};
