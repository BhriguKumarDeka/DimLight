const mongoose = require("mongoose");

const AICoachInsightSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true, required: true },
  data: { type: Object, required: true }, // { analysis, tips, encouragement }
  createdAt: { type: Date, default: Date.now, index: true },
});

module.exports = mongoose.model("AICoachInsight", AICoachInsightSchema);
