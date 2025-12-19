const router = require("express").Router();
const { 
  signup, 
  login, 
  forgotPassword, 
  resetPassword 
} = require("../controllers/auth.controller");

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:resettoken", resetPassword);

module.exports = router;