const express = require("express");
const { getWeeklyAICoach } = require("../controllers/ai.controller");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/weekly-coach", auth, getWeeklyAICoach);

module.exports = router;
