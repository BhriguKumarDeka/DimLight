import { useEffect, useState, useRef } from "react";
import API from "../api/api";
import {
  Lightbulb,
  Zap,
  TrendingUp,
  Sparkles,
  Activity,
  Clock,
  Calendar,
  Brain,
  Radio
} from "lucide-react";
import { motion } from "motion/react";
import Typewriter from "typewriter-effect";

/* Remi Avatar */
const RemiAvatar = () => {
  return (
    <div className="relative w-48 h-40 md:w-48 md:h-36 shrink-0 flex items-center justify-center">
      <div className="absolute inset-0 bg-amber-400/10 blur-lg rounded-full animate-pulse"></div>

      <motion.img
        src="/remi-ai.png"
        alt="Remi AI"
        animate={{ y: [-3, 3, -3] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 w-full h-full object-contain contrast-125 brightness-110"
        style={{
          filter:
            "drop-shadow(0 0 10px rgba(100,40,50,0.35)) grayscale(0.15)"
        }}
      />
    </div>
  );
};

/* Insights */
export default function Insights() {
  const [summary, setSummary] = useState(null);
  const [patterns, setPatterns] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [coachData, setCoachData] = useState(null);
  const [loading, setLoading] = useState(true);

  const cacheKey = useRef("insights-cache");

  const applyData = (payload) => {
    setSummary(payload?.summary || null);
    setPatterns(payload?.patterns || []);
    setRecommendations(payload?.recommendations || []);
    setCoachData(payload?.coachData || null);
  };

  const readCache = () => {
    try {
      const raw = sessionStorage.getItem(cacheKey.current);
      return raw ? JSON.parse(raw) : null;
    } catch (err) {
      console.error("Failed to read insights cache", err);
      return null;
    }
  };

  const writeCache = (payload) => {
    try {
      sessionStorage.setItem(cacheKey.current, JSON.stringify(payload));
    } catch (err) {
      console.error("Failed to write insights cache", err);
    }
  };

  const loadInsights = async (force = false) => {
    const cached = readCache();
    if (!force && cached) {
      applyData(cached);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const [statsRes, aiRes] = await Promise.all([
        API.get("/insights/weekly"),
        API.get(`/ai/weekly-coach${force ? "?force=true" : ""}`)
      ]);

      const payload = {
        summary: statsRes.data.summary,
        patterns: statsRes.data.patterns || [],
        recommendations: statsRes.data.recommendations || [],
        coachData: aiRes.data.analysis ? aiRes.data : null
      };

      applyData(payload);
      writeCache(payload);
    } catch (err) {
      console.error("Insights load failed", err);
      if (cached) applyData(cached);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInsights(false);
  }, []);

  /* Loading */
  if (loading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-8 relative overflow-hidden">

        {/* Remi */}
        <motion.div
          animate={{
            rotate: 360
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "linear"
          }}
          className="relative w-44 h-44 flex items-center justify-center"
        >
          {/* Orbit */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <motion.img
              src="/remi-think.png"
              alt="Remi AI"
              animate={{ y: [-4, 4, -4] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-24 h-24 object-contain contrast-125 brightness-110"
              style={{
                filter:
                  "drop-shadow(0 0 12px rgba(100,40,50,0.35)) grayscale(0.15)"
              }}
            />
          </motion.div>

          {/* Glow */}
          <div className="absolute inset-0 bg-amber-400/10 blur-xl rounded-full animate-pulse"></div>
        </motion.div>

        {/* Loader */}
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 rounded-full border-2 border-border border-t-primary"
        />

        {/* Status */}
        <p className="text-[10px] font-bold text-textMuted uppercase tracking-[0.25em] animate-pulse">
          Remi is thinking...
        </p>
      </div>
    );
  }


  return (
    <div className="max-w-6xl mx-auto space-y-6 p-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6">
        <div>
          <h1 className="text-2xl font-light tracking-tight text-text mb-2">
            Remi’s Weekly Insight
          </h1>
          <p className="text-textMuted text-xs flex items-center gap-2">
            <Radio size={14} className="text-primary animate-pulse" />
            Based on your last 7 nights of sleep
          </p>
        </div>

        <motion.button
          onClick={() => loadInsights(true)}
          className="bg-text text-black px-3 sm:px-5 py-2.5 rounded-full font-bold text-xs transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] flex items-center gap-2 active:scale-95 hover:scale-105 group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Sparkles size={14} className="text-black" />
          Refresh Analysis
        </motion.button>
      </div>

      {/* Coach */}
      {coachData ? (
        <div className="rounded-3xl bg-surface overflow-hidden">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-10 p-8 md:p-10">

            <RemiAvatar />

            <div className="flex-1 w-full">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                  <Brain size={12} />
                  Coach Analysis
                </span>
                <span className="h-px flex-1 bg-border"></span>
                <span className="text-[9px] font-mono text-textMuted">
                  SIGNAL_LOCKED
                </span>
              </div>

              <div className="max-w-[58ch] text-text text-[15px] font-light leading-relaxed min-h-[100px]">
                <Typewriter
                  options={{
                    delay: 28,
                    cursor: "|"
                  }}
                  onInit={(tw) => {
                    tw.typeString(coachData.analysis).start();
                  }}
                  key={coachData.analysis}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 rounded-3xl border border-border border-dashed bg-surface/30 text-center flex flex-col items-center gap-4">
          <div className="opacity-30 grayscale">
            <RemiAvatar />
          </div>
          <p className="text-textMuted text-sm">
            Log at least 3 nights of sleep to unlock insights.
          </p>
        </div>
      )}

      {/* Metrics */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={Clock} label="Avg Duration" value={`${summary.avgHours.toFixed(1)}h`} sub="Target: 8h" />
          <StatCard icon={Sparkles} label="Avg Quality" value={`${summary.avgQuality.toFixed(1)}`} sub="/ 5.0" />
          <StatCard icon={Activity} label="Consistency" value={`±${Math.round(summary.consistencyRange)}m`} sub="Variance" />
          <StatCard icon={Calendar} label="Weekend Avg" value={`${summary.weekendAvg.toFixed(1)}h`} sub="vs Weekday" />
        </div>
      )}

      {/* Patterns & Actions */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* Patterns */}
        <div className="rounded-3xl bg-surface flex flex-col">
          <div className="p-6 border-b border-border flex items-center gap-3">
            <div className="p-2 rounded-lg bg-background text-textMuted">
              <TrendingUp size={16} />
            </div>
            <h2 className="text-[10px] font-bold text-textMuted uppercase tracking-[0.2em]">
              Detected Patterns
            </h2>
          </div>

          <div className="p-6 flex-1">
            {patterns.length === 0 ? (
              <p className="text-xs text-textMuted italic">
                Insufficient data for pattern recognition.
              </p>
            ) : (
              <ul className="space-y-4">
                {patterns.map((p, i) => (
                  <li
                    key={i}
                    className="flex gap-4 text-sm text-textMuted hover:text-text transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    <span className="leading-relaxed">{p}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* OPTIMIZATIONS */}
        <div className="rounded-3xl bg-surface flex flex-col">
          <div className="p-6 border-b border-border flex items-center gap-3">
            <div className="p-2 rounded-lg bg-background text-textMuted">
              <Lightbulb size={16} />
            </div>
            <h2 className="text-[10px] font-bold text-textMuted uppercase tracking-[0.2em]">
              Optimizations
            </h2>
          </div>

          <div className="p-6 flex-1">
            {recommendations.length === 0 ? (
              <p className="text-xs text-textMuted italic">
                No critical optimizations needed.
              </p>
            ) : (
              <ul className="space-y-5">
                {recommendations.map((r, i) => (
                  <li
                    key={i}
                    className="flex gap-4 text-sm text-textMuted hover:text-text transition-colors"
                  >
                    <Zap size={14} className="text-success mt-0.5 shrink-0" />
                    <span className="leading-relaxed">{r}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

/* =======================
   STAT CAPSULE
======================= */
function StatCard({ icon: Icon, label, value, sub }) {
  return (
    <div className="rounded-2xl border border-border bg-surface/50 p-5 hover:bg-surface transition-colors">
      <div className="flex items-start justify-between mb-3">
        <span className="text-[9px] font-bold text-textMuted uppercase tracking-widest">
          {label}
        </span>
        {Icon && <Icon size={14} className="text-textMuted" />}
      </div>

      <p className="text-2xl font-light text-text tracking-tight">{value}</p>
      <p className="text-[10px] text-textMuted font-mono mt-1">{sub}</p>
    </div>
  );
}
