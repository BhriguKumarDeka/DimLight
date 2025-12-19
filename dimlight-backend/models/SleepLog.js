const mongoose = require("mongoose");

const SleepLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: true 
  },

  bedTime: { 
    type: Date, 
    required: true 
  },

  wakeTime: { 
    type: Date, 
    required: true 
  },

  duration: { 
    type: Number, 
    required: true 
  },

  sleepQuality: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 5 
  },

  mood: { 
    type: String 
  },
  
  stressLevel: { 
    type: Number, 
    min: 1, 
    max: 5 
  },

  caffeineIntake: { 
    type: Boolean, 
    default: false 
  },

  date: { 
    type: String, 
    required: true 
  },   

  notes: { 
    type: String 
  },
  
  tags: { 
    type: [String], 
    default: [] 
  },
  
  diaryRef: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Diary" 
  },

  source: { 
    type: String, 
    enum: ["manual", "google_fit"], 
    default: "manual" 
  },

  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model("SleepLog", SleepLogSchema);
