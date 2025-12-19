import { Moon, Sparkles, Clock, Activity } from "lucide-react";
import { motion } from "motion/react";
import { memo, useMemo, useCallback } from "react";

const MetricItem = memo(({ icon: Icon, label, value, formattedValue }) => (
  <motion.div
    className="relative flex flex-col items-center justify-center p-3 rounded-2xl bg-white/5 overflow-hidden group"
    whileHover="hover"
    initial="rest"
  >
    <div className="text-[8px] md:text-[9px] font-bold text-textMuted uppercase mb-1 z-10 flex items-center gap-1.5 cursor-default">
      <Icon size={10} className="text-textMuted/70" /> {label}
    </div>

    {/* Swap */}
    <div className="relative h-6 w-full z-10">
      {/* Label */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center font-normal text-sm text-text"
        variants={{ rest: { y: 0, opacity: 1 }, hover: { y: -10, opacity: 0 } }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {value}
      </motion.div>

      {/* Value */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center font-mono text-xs text-primary cursor-default"
        variants={{ rest: { y: 10, opacity: 0 }, hover: { y: 0, opacity: 1 } }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {formattedValue}
      </motion.div>
    </div>
  </motion.div>
));
MetricItem.displayName = 'MetricItem';

const SleepScoreCard = memo(({ score = 0, breakdown }) => {

  // Memoize helper functions
  const getQualitativeLabel = useCallback((type, value) => {
    if (value === undefined || value === null) return "No Data";
    switch (type) {
      case "duration": return value >= 7 && value <= 9 ? "Optimal" : value > 9 ? "High" : "Short";
      case "quality": return value >= 85 ? "Excellent" : value >= 70 ? "Good" : "Restless";
      case "consistency": return value >= 90 ? "High" : value >= 75 ? "Moderate" : "Low";
      default: return value;
    }
  }, []);

  const getRingColor = useCallback((s) => s >= 80 ? "stroke-primary" : s >= 60 ? "stroke-primary" : "stroke-secondary", []);
  const getScoreColor = useCallback((s) => s >= 80 ? "text-primary" : s >= 60 ? "text-primary" : "text-secondary", []);

  const metrics = useMemo(() => ({
    duration: breakdown?.duration || 0,
    quality: breakdown?.quality || 0,
    consistency: breakdown?.consistency || 0
  }), [breakdown]);

  return (
    <div className="h-full flex flex-col justify-between relative">

      {/* Score Ring */}
      <div className="flex-1 flex flex-col items-center justify-center z-10 my-2">
        <div className="relative w-40 h-40 flex items-center justify-center">
          {/* Track */}
          <svg className="absolute inset-0 w-full h-full transform -rotate-90">
            <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-white/5" />
            {/* Progress */}
            <circle
              cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="4" fill="transparent"
              strokeDasharray={440}
              strokeDashoffset={440 - (440 * score) / 100}
              strokeLinecap="round"
              className={`transition-all duration-1000 ease-out ${getRingColor(score)} drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]`}
            />
          </svg>
          <div className="text-center flex flex-col">
            <span className={`text-5xl font-light tracking-tighter ${getScoreColor(score)}`}>{score}</span>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-1 md:gap-2 mt-auto z-10">
        <MetricItem icon={Clock} label="Duration" value={getQualitativeLabel("duration", metrics.duration)} formattedValue={`${metrics.duration}h`} />
        <MetricItem icon={Sparkles} label="Quality" value={getQualitativeLabel("quality", metrics.quality)} formattedValue={`${metrics.quality}%`} />
        <MetricItem icon={Activity} label="Stability" value={getQualitativeLabel("consistency", metrics.consistency)} formattedValue={`${metrics.consistency}%`} />
      </div>
    </div>
  );
});
SleepScoreCard.displayName = 'SleepScoreCard';

export default SleepScoreCard;