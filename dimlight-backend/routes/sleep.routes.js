const router = require("express").Router();
const auth = require("../middleware/auth");
const {
  createLog,
  getLogs,
  updateLog,
  deleteLog, 
  seedLogs
} = require("../controllers/sleep.controller");

router.post("/log", auth, createLog);
router.get("/logs", auth, getLogs);
router.patch("/log/:id", auth, updateLog);
router.delete("/log/:id", auth, deleteLog);

// Optional: seed endpoint (enable only for non-prod by setting ALLOW_SEED=true)
if (process.env.ALLOW_SEED === "true") {
  router.post("/seed", auth, seedLogs);
}

module.exports = router;
