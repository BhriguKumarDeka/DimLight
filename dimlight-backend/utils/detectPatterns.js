exports.detectPatterns = (logs, summary) => {
  const patterns = [];
  const recommendations = [];

  if (!logs || logs.length === 0) {
    return { patterns, recommendations };
  }

  const {
    avgHours,
    avgQuality,
    consistencyRange,
    weekendAvg,
    weekdayAvg
  } = summary;

  // --- RULE 1: Low sleep duration ---
  if (avgHours < 6) {
    patterns.push("You are consistently sleeping less than 6 hours on average.");
    recommendations.push("Aim for at least 7 hours of sleep by going to bed earlier or cutting late-night screen time.");
  }

  // --- RULE 2: Bedtime inconsistency ---
  if (consistencyRange > 90) { // > 1.5 hours
    patterns.push("Your bedtime varies by more than 1.5 hours across the week.");
    recommendations.push("Try keeping your bedtime within a 30–45 minute window each night for more stable sleep.");
  }

  // --- RULE 3: Low sleep quality ---
  if (avgQuality < 3) {
    patterns.push("Your sleep quality has been generally low this week.");
    recommendations.push("Consider adding a pre-sleep wind-down routine like breathing exercises or avoiding heavy meals late at night.");
  }

  // --- RULE 4: Weekend vs Weekday difference ---
  if (weekendAvg - weekdayAvg > 1) {
    patterns.push("You sleep significantly more on weekends than weekdays.");
    recommendations.push("Try to keep your sleep and wake times more consistent across the whole week to avoid 'social jetlag'.");
  }

  // --- RULE 5: Stress vs quality ---
  const highStressLogs = logs.filter((l) => l.stressLevel >= 4);
  const highStressLowQuality = highStressLogs.filter((l) => l.sleepQuality <= 2);

  if (highStressLowQuality.length >= 2) {
    patterns.push("High stress levels appear to be linked to poor sleep quality.");
    recommendations.push("Try a short relaxation technique (like body-scan or 4-7-8 breathing) before bed on stressful days.");
  }

  // --- RULE 6: Caffeine vs quality ---
  const caffeineLogs = logs.filter((l) => l.caffeineIntake);
  const nonCaffeineLogs = logs.filter((l) => !l.caffeineIntake);

  if (caffeineLogs.length >= 2 && nonCaffeineLogs.length >= 2) {
    const avgQ = (arr) =>
      arr.reduce((s, l) => s + l.sleepQuality, 0) / arr.length;

    const avgCaffeineQuality = avgQ(caffeineLogs);
    const avgNonCaffeineQuality = avgQ(nonCaffeineLogs);

    if (avgCaffeineQuality < avgNonCaffeineQuality) {
      patterns.push("Caffeine appears to be reducing your sleep quality.");
      recommendations.push("Try avoiding caffeine later in the day (e.g., after 5–6 PM) and see if sleep improves.");
    }
  }

  // --- RULE 7: Mood & poor sleep correlation ---
  const lowQualityLogs = logs.filter((l) => l.sleepQuality <= 2);
  const badMoodOnLowSleep = lowQualityLogs.filter((l) =>
    ["😞", "😐"].includes(l.mood)
  );

  if (badMoodOnLowSleep.length >= 2) {
    patterns.push("Poor sleep seems to be affecting your mood on the next day.");
    recommendations.push("Improving sleep consistency and quality may help stabilize your mood and energy.");
  }

  return { patterns, recommendations };
};
