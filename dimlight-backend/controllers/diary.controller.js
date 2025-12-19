const Diary = require("../models/Diary");
const dayjs = require("dayjs");

exports.createOrUpdateDiary = async (req, res) => {
  try {
    const userId = req.user;
    const { date, morningMood, notes, tags } = req.body;

    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    const diary = await Diary.findOneAndUpdate(
      { userId, date },
      { morningMood, notes, tags },
      { upsert: true, new: true }
    );

    res.json({
      message: "Diary saved",
      diary
    });

  } catch (err) {
    console.error("Diary save error:", err);
    res.status(500).json({ message: "Server error saving diary" });
  }
};

exports.getDiary = async (req, res) => {
  try {
    const userId = req.user;
    const date = req.query.date || dayjs().format("YYYY-MM-DD");

    const diary = await Diary.findOne({ userId, date });
    res.json({ diary });

  } catch (err) {
    console.error("Fetch diary error:", err);
    res.status(500).json({ message: "Server error fetching diary" });
  }
};

exports.getWeekDiaries = async (req, res) => {
  try {
    const userId = req.user;
    const start = dayjs().subtract(6, "day").format("YYYY-MM-DD");

    const diaries = await Diary.find({
      userId,
      date: { $gte: start }
    }).sort({ date: 1 });

    res.json({ diaries });

  } catch (err) {
    console.error("Fetch week diaries error:", err);
    res.status(500).json({ message: "Server error fetching diaries" });
  }
};

exports.getAllDiaries = async (req, res) => {
  try {
    const userId = req.user;
    
    const entries = await Diary.find({ userId })
      .sort({ date: -1 })
      .limit(100);

    res.json({ entries });

  } catch (err) {
    console.error("Fetch all diaries error:", err);
    res.status(500).json({ message: "Server error fetching diary history" });
  }
};
