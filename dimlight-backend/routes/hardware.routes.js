const router = require("express").Router();
const auth = require("../middleware/auth");
const { 
  getGoogleAuthUrl, googleCallback, 
  triggerGoogleSync
} = require("../controllers/hardware.controller");

// Init Auth
router.get("/google/auth", auth, getGoogleAuthUrl);

// Callbacks
router.get("/google/callback", googleCallback);

// Manual Sync
router.post("/sync/google", auth, triggerGoogleSync);

module.exports = router;