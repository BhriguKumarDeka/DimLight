function normalize(v, min, max) {
  if (v <= min) return 0;
  if (v >= max) return 1;
  return (v - min) / (max - min);
}

exports.calculateSleepScore = ({ avgHours, avgQuality, consistencyRange }, recentLog = {}) => {
  const weights = {
    duration: 0.4,
    quality: 0.3,
    consistency: 0.2,
    lifestyle: 0.1
  };

  // Duration: target 7–9 hrs
  const durationNorm = normalize(avgHours, 4, 9);
  const durationScore = durationNorm * 100;

  // Quality: 1–5 scale
  const qualityNorm = normalize(avgQuality, 1, 5);
  const qualityScore = qualityNorm * 100;

  // Consistency: lower variation = better
  const consistencyNorm = 1 - normalize(consistencyRange, 0, 150);
  const consistencyScore = consistencyNorm * 100;

  // Lifestyle penalties (stress, caffeine)
  let lifestyle = 100;
  if (recentLog.stressLevel >= 4) lifestyle -= 10;
  if (recentLog.caffeineIntake) lifestyle -= 8;

  const lifestyleScore = lifestyle;

  const rawScore =
    durationScore * weights.duration +
    qualityScore * weights.quality +
    consistencyScore * weights.consistency +
    lifestyleScore * weights.lifestyle;

  const final = Math.round(Math.min(100, Math.max(0, rawScore)));

  return {
    score: final,
    breakdown: {
      durationScore: Math.round(durationScore),
      qualityScore: Math.round(qualityScore),
      consistencyScore: Math.round(consistencyScore),
      lifestyleScore: Math.round(lifestyleScore),
      weights
    }
  };
};
