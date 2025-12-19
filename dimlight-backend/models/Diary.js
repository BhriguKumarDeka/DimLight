const mongoose = require("mongoose");

const DiarySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },

  date: { 
    type: String, 
    required: true 
  }, // YYYY-MM-DD

  morningMood: { 
    type: String 
  },

  notes: { 
    
    type: String 
  },

  tags: { type: 
    [String], 
    default: [] 
  },

  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model("Diary", DiarySchema);
