const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Technique = require("../models/Technique");

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const techniques = [
  {
    title: "4-7-8 Breathing",
    type: "breathing",
    duration: 4,
    steps: [
      "Inhale through nose for 4 seconds",
      "Hold breath for 7 seconds",
      "Exhale slowly through mouth for 8 seconds",
      "Repeat 4 times"
    ],
    benefits: ["Reduces stress", "Improves sleep quality"],
    recommendedFor: ["stress", "anxiety", "poor sleep"]
  },
  {
    title: "Body Scan Relaxation",
    type: "meditation",
    duration: 6,
    steps: [
      "Lie down comfortably",
      "Focus on your toes and relax them",
      "Slowly move your attention upward through your body",
      "Breathe slowly and release tension"
    ],
    benefits: ["Relieves tension", "Improves mindfulness"],
    recommendedFor: ["stress", "insomnia"]
  },
  {
    title: "Neck & Shoulder Stretch",
    type: "stretching",
    duration: 5,
    steps: [
      "Roll your shoulders slowly",
      "Tilt your neck side to side",
      "Hold each stretch for 10 seconds"
    ],
    benefits: ["Relieves stiffness", "Improves circulation"],
    recommendedFor: ["fatigue", "screen strain"]
  },
  {
    title: "5-Minute Mindful Breathing",
    type: "mindfulness",
    duration: 5,
    steps: [
      "Sit quietly",
      "Focus only on your breath",
      "If the mind wanders, gently bring it back"
    ],
    benefits: ["Calms the mind", "Improves focus"],
    recommendedFor: ["anxiety", "restlessness"]
  }
];

const seedDB = async () => {
  try {
    // Ensure each technique has required fields
    const normalized = techniques.map(t => ({
      ...t,
      steps: Array.isArray(t.steps) && t.steps.length ? t.steps : ["Inhale", "Hold", "Exhale"],
      benefits: Array.isArray(t.benefits) && t.benefits.length ? t.benefits : ["Relaxation", "Focus"],
      recommendedFor: Array.isArray(t.recommendedFor) && t.recommendedFor.length ? t.recommendedFor : ["stress"]
    }));

    await Technique.deleteMany();
    await Technique.insertMany(normalized);
    console.log("Techniques seeded successfully");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();
