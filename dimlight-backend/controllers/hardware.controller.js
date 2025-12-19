const { google } = require("googleapis");
const axios = require("axios");
const User = require("../models/User");
const { syncGoogleSleep } = require("../services/googleFit.service");

// Configure Google OAuth Client
const googleClient = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_CALLBACK_URL
);

// --- 1. Get Auth URL ---
exports.getGoogleAuthUrl = (req, res) => {
  const scopes = [
    "https://www.googleapis.com/auth/fitness.sleep.read",
    "https://www.googleapis.com/auth/fitness.activity.read"
  ];
  
  const url = googleClient.generateAuthUrl({
    access_type: "offline", // Critical for refreshing tokens later
    scope: scopes,
    state: req.user // Pass userId to callback
  });
  
  res.json({ url });
};

// --- 2. Handle Callback ---
exports.googleCallback = async (req, res) => {
  const { code, state } = req.query; // state is userId
  try {
    const { tokens } = await googleClient.getToken(code);
    
    await User.findByIdAndUpdate(state, {
      googleFit: {
        isConnected: true,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiryDate: tokens.expiry_date
      }
    });

    // Redirect to frontend settings
    res.redirect(`${process.env.FRONTEND_URL}/settings?status=google_success`);
  } catch (err) {
    console.error("Google Auth Error:", err);
    res.redirect(`${process.env.FRONTEND_URL}/settings?status=error`);
  }
};

// --- 3. Manual Sync Trigger ---
exports.triggerGoogleSync = async (req, res) => {
  try {
    const result = await syncGoogleSleep(req.user);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};