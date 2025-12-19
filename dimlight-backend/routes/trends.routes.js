const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { getTrends } = require("../controllers/trends.controller");

router.get("/", auth, getTrends);

module.exports = router;
