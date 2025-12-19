const dayjs = require("dayjs");

exports.calculateStats = (logs) => {
  if (!logs || logs.length === 0) {
    return {
      avgHours: 0,
      avgQuality: 0,
      consistencyRange: 0,
      weekendAvg: 0,
      weekdayAvg: 0
    };
  }

  const durations = logs.map((l) => l.duration);
  const qualities = logs.map((l) => l.sleepQuality);

  // bedtime in minutes from midnight for consistency
  const bedtimes = logs.map((l) => {
    const d = dayjs(l.bedTime);
    return d.hour() * 60 + d.minute();
  });

  const sum = (arr) => arr.reduce((a, b) => a + b, 0);

  const avgHours = sum(durations) / durations.length;
  const avgQuality = sum(qualities) / qualities.length;

  const minBed = Math.min(...bedtimes);
  const maxBed = Math.max(...bedtimes);
  const consistencyRange = maxBed - minBed; // in minutes

  let weekendDurations = [];
  let weekdayDurations = [];

  logs.forEach((log) => {
    const day = dayjs(log.date).day(); // 0 = Sun, 6 = Sat
    if (day === 0 || day === 6) {
      weekendDurations.push(log.duration);
    } else {
      weekdayDurations.push(log.duration);
    }
  });

  const weekendAvg = weekendDurations.length
    ? sum(weekendDurations) / weekendDurations.length
    : 0;

  const weekdayAvg = weekdayDurations.length
    ? sum(weekdayDurations) / weekdayDurations.length
    : 0;

  return {
    avgHours,
    avgQuality,
    consistencyRange,
    weekendAvg,
    weekdayAvg
  };
};
