const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const rateLimit = require("express-rate-limit");

const { seedIfEmpty } = require("./seed/autoSeedTechniques");

// Import Routes
const sleepRoutes = require("./routes/sleep.routes");
const insightsRoutes = require("./routes/insights.routes");
const techniquesRoutes = require("./routes/techniques.routes");
const aiRoutes = require("./routes/ai.routes");
const diaryRoutes = require("./routes/diary.routes");
const trendsRoutes = require("./routes/trends.routes");
const scoreRoutes = require("./routes/score.routes");
const hardwareRoutes = require("./routes/hardware.routes");

dotenv.config();

const app = express();

const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 requests per hour (generous for demos)
  message: "Too many AI requests. Try again in an hour."
});

// Connect DB and kick off auto-seed in background
connectDB()
  .then(() => seedIfEmpty())
  .catch((e) => console.error("DB connect/seed error:", e.message));

const defaultOrigins = [
  "http://localhost:5173",
  "https://your-app-name.vercel.app",
  "https://www.your-app-name.vercel.app"
];

const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",").map((o) => o.trim())
  : defaultOrigins;

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());

const authRoutes = require("./routes/auth.routes");

// Middleware and Routes
app.use("/auth", authRoutes);
app.use("/sleep", sleepRoutes);
app.use("/insights", insightsRoutes);
app.use("/techniques", techniquesRoutes);
app.use("/ai", aiLimiter, aiRoutes);
app.use("/diary", diaryRoutes);
app.use("/trends", trendsRoutes);
app.use("/score", scoreRoutes);
app.use("/api", hardwareRoutes);

//error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(err.status || 500).json({ 
    message: "Something went wrong. Please try again." 
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
