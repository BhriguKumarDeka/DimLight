const mongoose = require("mongoose");

const TechniqueSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  type: {
    type: String,
    enum: ["breathing", "meditation", "stretching", "mindfulness"],
    required: true
  },

  duration: {
    type: Number, // in minutes
    required: true
  },

  steps: {
    type: [String],
    required: true
  },

  benefits: {
    type: [String]
  },

  recommendedFor: {
    type: [String] // e.g. ["stress", "insomnia", "anxiety"]
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Technique", TechniqueSchema);
