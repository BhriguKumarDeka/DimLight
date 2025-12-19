import { useEffect, useState, useMemo } from "react";
import dayjs from "dayjs";
import API from "../api/api";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { motion } from "motion/react";

export default function SleepCalendar({ onDayClick }) {
  // Fixed to current date, no setter needed
  const [currentDate] = useState(dayjs());
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLogs = async () => {
      try {
        setLoading(true);
        const res = await API.get("/sleep/logs"); // Using your specific endpoint
        const rawLogs = Array.isArray(res.data) ? res.data : (res.data.logs || []);
        setLogs(rawLogs);
      } catch (err) {
        console.error("Calendar sync failed", err);
      } finally {
        setLoading(false);
      }
    };
    loadLogs();
  }, []);

  const startOfMonth = currentDate.startOf("month");

  const logMap = useMemo(() => {
    const map = {};
    logs.forEach((log) => {
      const dateKey = log.date || (log.bedTime ? dayjs(log.bedTime).format("YYYY-MM-DD") : null);
      if (dateKey) map[dateKey] = log;
    });
    return map;
  }, [logs]);

  // Opacity Logic for Heatmap
  const getDayStyle = (log) => {
    if (!log) return "bg-white/5 border border-transparent text-zinc-600 hover:bg-white/10";
    const score = log.score || log.sleepScore || 0;

    if (score >= 90) return "bg-primary border border-primary text-white shadow-glow z-10 font-bold";
    if (score >= 75) return "bg-primary/70 border border-primary/40 text-white/90";
    if (score >= 60) return "bg-primary/40 border border-primary/20 text-white/80";
    return "bg-primary/20 border border-primary/10 text-white/60";
  };

  return (
    <div className="h-full flex flex-col w-full">

      {/* Header */}
      <div className="flex justify-between items-center mb-4 px-1 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-text/40 uppercase tracking-wider">
            {currentDate.format("MMMM YYYY")}
          </span>
        </div>
        {/* Live */}
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
          </span>
          <span className="text-[9px] text-text/40 font-medium uppercase tracking-widest">Current</span>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 flex flex-col min-h-0">

        {/* Weekdays */}
        <div className="grid grid-cols-7 mb-2 text-center shrink-0">
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
            <div key={i} className="text-xs font-bold text-text/40">{d}</div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 gap-1.5 flex-1 auto-rows-fr">
          {loading ? (
            <div className="col-span-7 flex items-center justify-center text-primary/50 h-full">
              <Loader2 className="animate-spin" />
            </div>
          ) : (
            <>
              {[...Array(startOfMonth.day())].map((_, i) => <div key={`e-${i}`} />)}

              {[...Array(currentDate.daysInMonth())].map((_, index) => {
                const date = startOfMonth.add(index, "day");
                const key = date.format("YYYY-MM-DD");
                const log = logMap[key];
                const isToday = date.isSame(dayjs(), 'day');

                return (
                  <motion.button
                    key={key}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => log && onDayClick?.(log)}
                    disabled={!log}
                    className={`
                                    relative rounded-lg flex items-center justify-center text-[10px] transition-all group
                                    ${getDayStyle(log)}
                                    ${!log && "cursor-default"}
                                    ${isToday && !log && "border border-white/80 "} 
                                `}
                  >
                    {date.format("D")}
                  </motion.button>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
}