const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { getScoreTrend } = require("../controllers/score.controller");

router.get("/", auth, getScoreTrend);

module.exports = router;
