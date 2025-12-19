const mongoose = require("mongoose");
const crypto = require("crypto"); // Built-in Node module

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email"
    ]
  },
  password: { type: String, required: true, select: false }, // Don't return password by default
  userType: { type: String, enum: ["trouble", "curious", "wellness"], default: "curious" },

  // Hardware Fields (Preserved)
  googleFit: {
    isConnected: { type: Boolean, default: false },
    accessToken: String,
    refreshToken: String,
    expiryDate: Number
  },

  // ✅ SECURITY FIELDS
  resetPasswordToken: String,
  resetPasswordExpire: Date,

  createdAt: { type: Date, default: Date.now }
});

// Helper to generate a reset token
UserSchema.methods.getResetPasswordToken = function () {
  // 1. Generate token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // 2. Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // 3. Set expire (10 minutes)
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model("User", UserSchema);