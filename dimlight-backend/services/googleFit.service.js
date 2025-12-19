const { google } = require("googleapis");
const User = require("../models/User");
const SleepLog = require("../models/SleepLog");
const dayjs = require("dayjs");

exports.syncGoogleSleep = async (userId) => {
  const user = await User.findById(userId);
  if (!user || !user.googleFit.isConnected) return { success: false, message: "Google Fit not connected" };

  // 1. Setup OAuth Client
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CALLBACK_URL
  );

  oauth2Client.setCredentials({
    access_token: user.googleFit.accessToken,
    refresh_token: user.googleFit.refreshToken,
    expiry_date: user.googleFit.expiryDate
  });

  // 2. Auto-Refresh Logic
  oauth2Client.on("tokens", async (tokens) => {
    if (tokens.refresh_token) user.googleFit.refreshToken = tokens.refresh_token;
    if (tokens.access_token) user.googleFit.accessToken = tokens.access_token;
    if (tokens.expiry_date) user.googleFit.expiryDate = tokens.expiry_date;
    await user.save();
  });

  const fitness = google.fitness({ version: "v1", auth: oauth2Client });

  // 3. Fetch Last 7 Days
  const endTime = new Date();
  const startTime = new Date();
  startTime.setDate(startTime.getDate() - 7);

  try {
    const response = await fitness.users.sessions.list({
      userId: "me",
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      activityType: 72 // 72 = Sleep
    });

    const sessions = response.data.session || [];
    let syncedCount = 0;

    // 4. Process & Save
    for (const session of sessions) {
      const bedTime = new Date(parseInt(session.startTimeMillis));
      const wakeTime = new Date(parseInt(session.endTimeMillis));
      const dateKey = dayjs(bedTime).format("YYYY-MM-DD");
      
      const durationHours = (wakeTime - bedTime) / (1000 * 60 * 60);

      // Heuristic Quality (Google doesn't always send score)
      let quality = 3;
      if (durationHours > 7) quality = 5;
      else if (durationHours < 5) quality = 2;

      await SleepLog.findOneAndUpdate(
        { userId: user._id, date: dateKey },
        {
          bedTime,
          wakeTime,
          duration: durationHours,
          sleepQuality: quality,
          source: "google_fit",
          mood: "neutral"
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      syncedCount++;
    }

    return { success: true, count: syncedCount };

  } catch (err) {
    console.error("Google Sync Error:", err);
    throw new Error("Failed to sync with Google Fit");
  }
};