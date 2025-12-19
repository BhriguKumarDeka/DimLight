const router = require("express").Router();
const auth = require("../middleware/auth");
const {
  getWeeklyInsights,
  getTodayInsight
} = require("../controllers/insights.controller");

router.get("/", auth, getWeeklyInsights);
router.get("/weekly", auth, getWeeklyInsights);
router.get("/today", auth, getTodayInsight);

module.exports = router;
