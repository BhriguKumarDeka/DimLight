import { useEffect, useState, useMemo, useCallback } from "react";
import { motion } from "motion/react";
import API from "../api/api";
import { BarChart2, Wind, Plus, Moon, Sparkles, ChevronRight, Play, Target, CheckCircle2, Zap, TrendingUp, Calendar, ArrowUpRight } from "lucide-react";
import dayjs from "dayjs";
import dayOfYear from "dayjs/plugin/dayOfYear";
import SleepScoreCard from "../components/SleepScoreCard";
import SleepCalendar from "../components/SleepCalendar";
import TrendChart from "../components/TrendChart";
import LogSleepModal from "../components/LogSleepModal";
import DayDetailModal from "../components/DayDetailModal";
import { Link } from "react-router-dom";

dayjs.extend(dayOfYear);

// Static Data
const FOCUS_QUESTS = [
  { id: 1, category: "Consistency", title: "The 1-Hour Window", text: "Sleep within the same 1-hour window tonight.", icon: Target },
  { id: 2, category: "Wind Down", title: "No Blue Light", text: "Put your phone away 30 minutes before bed.", icon: Moon },
  { id: 3, category: "Recovery", title: "Cool The Room", text: "Drop thermostat to 65-68°F (18°C).", icon: Wind },
  { id: 4, category: "Habit", title: "Caffeine Curfew", text: "Avoid caffeine after 2:00 PM today.", icon: Zap },
  { id: 5, category: "Mind", title: "Brain Dump", text: "Journal your worries for 5 minutes before bed.", icon: Sparkles },
];

// DashboardCard
const DashboardCard = ({ children, className = "", title, icon: Icon, action, onClick, variant = "solid" }) => {
  const bgClass = variant === "glass"
    ? "bg-surface/30 border border-border hover:bg-surface/10"
    : "bg-surface ";

  return (
    <div
      onClick={onClick}
      className={`
        relative rounded-3xl overflow-hidden flex flex-col group transition-all duration-500
         ${bgClass}
        ${className}
      `}
    >
      {/* Header */}
      {(title || action) && (
        <div className="flex justify-between items-center px-6 py-5 shrink-0 relative z-20">
          <div className="flex items-center gap-2.5 text-textMuted group-hover:text-text transition-colors">
            {Icon && <Icon size={14} strokeWidth={2.5} />}
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{title}</span>
          </div>
          {action && (
            <div className="text-[10px] font-medium text-textMuted group-hover:text-text transition-colors cursor-pointer flex items-center gap-1">
              {action} <ChevronRight size={12} />
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 px-6 pb-6 relative z-10 text-text min-h-0 flex flex-col">
        {children}
      </div>
    </div>
  );
};

export default function Dashboard() {
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [techniques, setTechniques] = useState([]);

  // Robust State for Data
  const [dashboardData, setDashboardData] = useState({
    sleepScore: 0,
    scoreBreakdown: { duration: 0, quality: 0, consistency: 0 },
    chartData: [],
    hasData: false
  });

  const [chartTab, setChartTab] = useState("score");
  const [selectedLog, setSelectedLog] = useState(null);
  const [isFocusCompleted, setIsFocusCompleted] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const firstName = user.name ? user.name.split(" ")[0] : "Dreamer";

  const todaysFocus = useMemo(() => {
    const dayIndex = dayjs().dayOfYear();
    return FOCUS_QUESTS[dayIndex % FOCUS_QUESTS.length];
  }, []);

  // Memoized event handlers
  const handleFocusToggle = useCallback(() => {
    setIsFocusCompleted(prev => !prev);
  }, []);

  const handleChartTabChange = useCallback((tab) => {
    setChartTab(tab);
  }, []);

  const handleDayClick = useCallback((log) => {
    setSelectedLog(log);
  }, []);

  const handleLogSleepOpen = useCallback(() => {
    setIsLogOpen(true);
  }, []);

  const handleLogSleepClose = useCallback(() => {
    setIsLogOpen(false);
  }, []);

  const handleDayDetailClose = useCallback(() => {
    setSelectedLog(null);
  }, []);

  const trendAnalysis = useMemo(() => {
    const data = dashboardData.chartData;
    if (!data || data.length < 2) return "Gathering data...";

    const lastScore = data[data.length - 1].score || 0;
    const avg = data.reduce((acc, c) => acc + c.score, 0) / data.length;

    if (lastScore > avg) return "Trending up! Better than average.";
    if (lastScore < avg - 5) return "Slight dip. Focus on consistency.";
    return "Your sleep pattern is stable.";
  }, [dashboardData.chartData]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [trendRes, scoreRes, techniquesRes] = await Promise.all([
        API.get("/trends?range=week"),
        API.get("/score?days=7"),
        API.get("/techniques").catch(err => {
          console.error("Failed to load techniques:", err);
          return { data: [] };
        })
      ]);

      const trends = trendRes.data.series || [];
      const scores = scoreRes.data.series || [];
      const allTechniques = techniquesRes.data.techniques || [];

      const selectedTechniques = allTechniques.slice(0, 3);
      setTechniques(selectedTechniques);

      const mergedData = trends.map((item) => {
        const scoreItem = scores.find((s) => s.date === item.date);
        return {
          ...item,
          score: scoreItem ? scoreItem.score : 0,
          quality: item.quality <= 5 ? item.quality * 20 : item.quality
        };
      });
      let avgDuration = 0, avgQuality = 0, avgConsistency = 0, latestScore = 0;

      // Get latest valid score with its breakdown
      const scoresWithValues = scores.filter(s => s.score > 0);
      if (scoresWithValues.length > 0) {
        const latestScoreData = scoresWithValues[scoresWithValues.length - 1];
        latestScore = latestScoreData.score;

        if (latestScoreData.breakdown) {
          avgDuration = parseFloat(((latestScoreData.breakdown.durationScore / 100) * 5 + 4).toFixed(1));
          avgQuality = latestScoreData.breakdown.qualityScore;
          avgConsistency = latestScoreData.breakdown.consistencyScore;
        } else {
          // Fallback: calculate from trends data
          const totalDur = mergedData.reduce((acc, curr) => acc + (curr.duration || 0), 0);
          const totalQual = mergedData.reduce((acc, curr) => acc + (curr.quality || 0), 0);
          avgDuration = parseFloat((totalDur / mergedData.length).toFixed(1));
          avgQuality = Math.round(totalQual / mergedData.length);
          avgConsistency = 85;
        }
      }

      setDashboardData({
        sleepScore: latestScore,
        scoreBreakdown: { duration: avgDuration, quality: avgQuality, consistency: avgConsistency },
        chartData: mergedData,
        hasData: mergedData.length > 0
      });

    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  // Chart Configuration
  const getChartData = () => {
    if (chartTab === "score") return { data: dashboardData.chartData, color: "#0caffb", key: "score", label: "Sleep Score" };
    if (chartTab === "duration") return { data: dashboardData.chartData, color: "#CDF2FF", key: "duration", label: "Hours" };
    if (chartTab === "quality") return { data: dashboardData.chartData, color: "#10b981", key: "quality", label: "Quality" };
    return { data: [], color: "#ffffff", key: "", label: "" };
  };
  const chartConfig = getChartData();

  return (
    <div className="w-full min-h-screen lg:h-screen flex flex-col p-4 lg:p-8 overflow-y-auto lg:overflow-hidden relative z-10">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 sm:mb-6 shrink-0">
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl font-light tracking-tight text-text">
            Namaste, <span className="font-normal text-textMuted">{firstName}</span>
          </h1>
          <p className="text-textMuted text-xs mt-1">Here is your daily wellness overview.</p>
        </div>
        <motion.button
          onClick={handleLogSleepOpen}
          className="bg-white text-black px-3 sm:px-5 py-2.5 rounded-full font-bold text-xs transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] flex items-center gap-2 active:scale-95 hover:scale-105 group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="transition-transform duration-200 group-hover:rotate-90">
            <Plus size={14} strokeWidth={3} />
          </div>
          <span className="hidden sm:inline">Log Sleep</span>
        </motion.button>
      </div>

      {/* Grid */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 lg:grid-rows-[55%_45%] gap-3  lg:gap-4 min-h-0 pb-4 auto-rows-max md:auto-rows-fr lg:auto-rows-unset">

        {/* Top Row */}

        {/* Readiness */}
        <div className="lg:col-span-4 h-80 md:h-96 lg:h-full">
          <DashboardCard title="Readiness" icon={Moon} variant="solid" className="h-full">
            {loading ? (
              <div className="h-full flex items-center justify-center text-textMuted animate-pulse text-xs uppercase tracking-widest">Calculating...</div>
            ) : (dashboardData.hasData) ? (
              <SleepScoreCard score={dashboardData.sleepScore} breakdown={dashboardData.scoreBreakdown} />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                <div className="w-16 h-16 rounded-full border border-border flex items-center justify-center mb-4">
                  <Moon size={24} className="text-textMuted" />
                </div>
                <p className="text-xs text-zinc-600">No Data Yet</p>
              </div>
            )}
          </DashboardCard>
        </div>

        {/* Focus */}
        <div className="lg:col-span-4 h-80 md:h-96 lg:h-full">
          <DashboardCard title="Tonight's Focus" icon={Target} variant="glass" className="h-full">
            <div className="flex flex-col h-full justify-between">
              <div className="flex-1 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 px-2 py-1 rounded border border-primary/20 bg-primary/5 mb-4 w-fit">
                  <Target size={10} className="text-primary" />
                  <span className="text-[9px] font-bold uppercase tracking-wider text-primary">{todaysFocus.category}</span>
                </div>
                <h3 className="text-xl font-medium text-text mb-2 leading-snug">{todaysFocus.title}</h3>
                <p className="text-xs text-textMuted leading-relaxed font-light">{todaysFocus.text}</p>
              </div>

              <button
                onClick={handleFocusToggle}
                className={`w-full py-3.5 rounded-xl border flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${isFocusCompleted
                  ? "bg-success/10 border-success/20 text-success"
                  : "bg-white/5 border-border text-textMuted hover:bg-white/10 hover:text-text"
                  }`}
              >
                {isFocusCompleted ? <CheckCircle2 size={14} /> : <div className="w-3 h-3 rounded-full border-2 border-zinc-600" />}
                {isFocusCompleted ? "Complete" : "Mark Complete"}
              </button>
            </div>
          </DashboardCard>
        </div>

        {/* Quick Relief */}
        <div className="lg:col-span-4 h-80 md:h-96 lg:h-full">
          <DashboardCard title="Quick Relief" icon={Wind} variant="glass" className="h-full">
            <div className="flex flex-col gap-3 h-full justify-center">
              {loading ? (
                <div className="h-full flex items-center justify-center text-zinc-600 text-xs">Loading techniques...</div>
              ) : techniques.length > 0 ? (
                techniques.map((technique) => (
                  <Link key={technique._id} to={`/techniques/${technique._id}`} className="flex items-center justify-between p-3 rounded-xl border-border bg-white/5 hover:bg-white/10 hover:border-border transition-all group border">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-black/40 text-textMuted group-hover:text-text transition-colors">
                        <Play size={10} fill="currentColor" />
                      </div>
                      <div>
                        <h4 className="font-medium text-xs text-text group-hover:text-text transition-colors">{technique.name}</h4>
                        <span className="text-[9px] text-textMuted font-bold uppercase tracking-wider">{technique.duration} • {technique.type}</span>
                      </div>
                    </div>
                    <ArrowUpRight size={14} className="text-textMuted group-hover:text-text transition-colors" />
                  </Link>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                  <Wind size={24} className="text-textMuted mb-2" />
                  <p className="text-xs text-textMuted">No techniques available</p>
                </div>
              )}
            </div>
          </DashboardCard>
        </div>

        {/* Bottom Row */}

        {/* Trends */}
        <div className="md:col-span-2 lg:col-span-8 h-80 md:h-96 lg:h-full">
          <DashboardCard title="Trends" icon={TrendingUp} variant="solid" className="h-full">
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center mb-2 shrink-0 flex-wrap gap-2">
                <p className="text-xs text-textMuted flex items-center gap-2">
                  {trendAnalysis}
                </p>
                <div className="flex bg-black/40 p-0.5 rounded-lg border border-border scale-75 sm:scale-100 origin-right">
                  {['score', 'duration', 'quality'].map((tab) => (
                    <button key={tab} onClick={() => handleChartTabChange(tab)} className={`px-3 py-1 text-[9px] font-bold uppercase tracking-widest rounded-md transition-all ${chartTab === tab ? "bg-secondary text-black shadow-sm" : "text-textMuted hover:text-text"}`}>
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 min-h-0 w-full relative">
                {dashboardData.hasData ? (
                  <TrendChart data={chartConfig.data} dataKey={chartConfig.key} label={chartConfig.label} color={chartConfig.color} />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-xs text-textMuted">
                    <BarChart2 size={24} className="mb-2 opacity-20" />
                    No data yet
                  </div>
                )}
              </div>
            </div>
          </DashboardCard>
        </div>

        {/* History */}
        <div className="md:col-span-2 lg:col-span-4 h-80 md:h-96 lg:h-full">
          <DashboardCard title="History" icon={Calendar} variant="solid" className="h-full">
            <SleepCalendar onDayClick={handleDayClick} />
          </DashboardCard>
        </div>
      </div>

      {/* Modals */}
      <LogSleepModal isOpen={isLogOpen} onClose={handleLogSleepClose} onSuccess={loadData} />
      <DayDetailModal log={selectedLog} onClose={handleDayDetailClose} />
    </div>
  );
}
