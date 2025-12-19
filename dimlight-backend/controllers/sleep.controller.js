const SleepLog = require("../models/SleepLog");
const dayjs = require("dayjs");

exports.createLog = async (req, res) => {
  try {
    const {
      bedTime,
      wakeTime,
      sleepQuality,
      mood,
      stressLevel,
      caffeineIntake
    } = req.body;

    if (!bedTime || !wakeTime || !sleepQuality) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const bed = new Date(bedTime);
    const wake = new Date(wakeTime);

    const duration = (wake - bed) / (1000 * 60 * 60);
    if (duration <= 0) {
      return res.status(400).json({ message: "Invalid sleep duration" });
    }

    const dateKey = dayjs(bed).format("YYYY-MM-DD");

    const existing = await SleepLog.findOne({
      userId: req.user,
      date: dateKey
    });

    if (existing) {
      return res.status(400).json({ message: "Log for today already exists" });
    }

    const log = await SleepLog.create({
      userId: req.user,
      bedTime,
      wakeTime,
      duration,
      sleepQuality,
      mood,
      stressLevel,
      caffeineIntake,
      date: dateKey
    });

    res.json({
      message: "Sleep log created successfully",
      data: log
    });

  } catch (err) {
    console.error("Create log error:", err);
    res.status(500).json({ message: "Server error while creating log" });
  }
};

exports.getLogs = async (req, res) => {
  try {
    const range = req.query.range || "week";
    const today = dayjs().format("YYYY-MM-DD");
    let startDate;

    if (range === "week") {
      startDate = dayjs().subtract(6, "day").format("YYYY-MM-DD");
    } else if (range === "month") {
      startDate = dayjs().subtract(30, "day").format("YYYY-MM-DD");
    }

    let logs;

    if (range === "all") {
      logs = await SleepLog.find({ userId: req.user }).sort({ date: -1 });
    } else {
      logs = await SleepLog.find({
        userId: req.user,
        date: {
          $gte: startDate,
          $lte: today
        }
      }).sort({ date: -1 });
    }

    res.json({ logs });

  } catch (err) {
    console.error("Fetch logs error:", err);
    res.status(500).json({ message: "Server error while fetching logs" });
  }
};

exports.updateLog = async (req, res) => {
  try {
    const log = await SleepLog.findOne({
      _id: req.params.id,
      userId: req.user
    });

    if (!log) {
      return res.status(404).json({ message: "Log not found" });
    }

    const updates = req.body;

    if (updates.bedTime || updates.wakeTime) {
      const bed = updates.bedTime
        ? new Date(updates.bedTime)
        : new Date(log.bedTime);

      const wake = updates.wakeTime
        ? new Date(updates.wakeTime)
        : new Date(log.wakeTime);

      updates.duration = (wake - bed) / (1000 * 60 * 60);
      updates.date = dayjs(bed).format("YYYY-MM-DD");
    }

    const updated = await SleepLog.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );

    res.json({
      message: "Log updated",
      data: updated
    });

  } catch (err) {
    console.error("Update log error:", err);
    res.status(500).json({ message: "Server error while updating log" });
  }
};

exports.deleteLog = async (req, res) => {
  try {
    const log = await SleepLog.findOne({
      _id: req.params.id,
      userId: req.user
    });

    if (!log) {
      return res.status(404).json({ message: "Log not found" });
    }

    await log.deleteOne();
    res.json({ message: "Log deleted successfully" });

  } catch (err) {
    console.error("Delete log error:", err);
    res.status(500).json({ message: "Server error while deleting log" });
  }
};

exports.seedLogs = async (req, res) => {
  try {
    const logs = req.body.logs;
    const userId = req.user;
    const createdLogs = [];

    // Delete existing logs for this date range to prevent duplicates/errors
    const dates = logs.map(l => dayjs(l.bedTime).format("YYYY-MM-DD"));
    await SleepLog.deleteMany({ userId, date: { $in: dates } });

    for (const entry of logs) {
      const bed = new Date(entry.bedTime);
      const wake = new Date(entry.wakeTime);
      const duration = (wake - bed) / (1000 * 60 * 60);
      const dateKey = dayjs(bed).format("YYYY-MM-DD");

      const log = await SleepLog.create({
        userId,
        bedTime: bed,
        wakeTime: wake,
        duration,
        sleepQuality: entry.sleepQuality,
        mood: entry.mood,
        stressLevel: entry.stressLevel,
        caffeineIntake: entry.caffeineIntake || false,
        date: dateKey,
        notes: entry.notes || "Seeded entry",
        tags: entry.tags || [],
        source: "manual"
      });
      createdLogs.push(log);
    }

    res.json({ success: true, count: createdLogs.length, message: "Bulk logs added!" });
  } catch (err) {
    console.error("Seeding error:", err);
    res.status(500).json({ message: "Seeding failed" });
  }
};