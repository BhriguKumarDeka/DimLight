const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  createOrUpdateDiary,
  getDiary,
  getWeekDiaries,
  getAllDiaries
} = require("../controllers/diary.controller");

router.post("/", auth, createOrUpdateDiary);

router.get("/", auth, getDiary);

router.get("/week", auth, getWeekDiaries);

router.get("/history", auth, getAllDiaries);

module.exports = router;
