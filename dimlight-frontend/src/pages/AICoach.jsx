import { useState } from "react";
import { showSuccess, showError, showInfo } from "../utils/toastUtils";
import API from "../api/api";
import { Sparkles, Lightbulb } from "lucide-react";
import { motion } from "motion/react";

export default function AICoach() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadCoach = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await API.get("/ai/weekly-coach");

      // Handle case where API returns 200 OK but no specific message
      if (res.data.coachMessage === null && !res.data.analysis) {
        setError("Not enough data yet.");
        setData(null);
        showInfo("Need more sleep data for accurate analysis.");
      } else {
        setData(res.data);
        showSuccess("Analysis generated successfully!");
      }
    } catch (err) {
      const errorMsg = "Unable to load AI coach. Please try again.";
      setError(errorMsg);
      showError(errorMsg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto pt-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Header (Always Visible) */}
        <div className="text-center space-y-3 mb-12">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-text">Weekly Insights</h1>
          <p className="text-textMuted">Your personal sleep analysis powered by AI.</p>
        </div>

        {/* STATE 1: Initial (Show Button) */}
        {!data && !loading && !error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center p-12 border border-border border-dashed rounded-3xl bg-surface/50"
          >
            <div className="max-w-2xl mx-auto space-y-6">
              <p className="text-text leading-relaxed">
                Ready to analyze your logs? This will generate a fresh report based on your recent sleep patterns.
              </p>
              <button
                onClick={loadCoach}
                className="btn btn-primary w-full md:w-auto shadow-glow hover:scale-105 active:scale-95"
              >
                <Sparkles size={18} className="mr-2" /> Generate Analysis
              </button>
              <p className="text-xs text-textMuted">
                *This action uses 1 API Token
              </p>
            </div>
          </motion.div>
        )}

        {/* STATE 2: Loading */}
        {loading && (
          <div className="space-y-4 p-8 rounded-2xl border border-border bg-background/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-4 h-4 rounded-full bg-primary animate-ping"></div>
              <span className="text-sm text-textMuted animate-pulse">Consulting the oracle...</span>
            </div>
            <div className="h-4 bg-surface rounded-full w-3/4 animate-pulse"></div>
            <div className="h-4 bg-surface rounded-full w-full animate-pulse"></div>
            <div className="h-4 bg-surface rounded-full w-5/6 animate-pulse"></div>
          </div>
        )}

        {/* STATE 3: Error */}
        {error && (
          <div className="text-center p-8 border border-error/20 bg-error/10 rounded-2xl">
            <p className="text-error font-medium mb-4">
              {error === "Not enough data yet." ? "Log more sleep data to unlock your coach!" : "Something went wrong."}
            </p>
            <button onClick={loadCoach} className="btn btn-outline text-xs">
              Try Again
            </button>
          </div>
        )}

        {/* STATE 4: Success (Data) */}
        {data && (
          <>
            {/* Analysis Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 rounded-3xl border border-primary/20 bg-linear-to-br from-primary/10 to-primary/5"
            >
              <h3 className="text-primary font-semibold mb-4 text-sm uppercase tracking-wider">Analysis</h3>
              <p className="text-lg leading-relaxed text-text">{data.analysis || data.coachMessage}</p>
            </motion.div>

            {/* Tips Grid */}
            <div className="grid gap-4">
              <h3 className="text-text font-bold ml-1 text-lg">Recommended Actions</h3>
              {data.tips?.map((tip, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-4 p-5 rounded-2xl bg-surface border border-border hover:border-primary/30 transition-colors"
                >
                  <div className="shrink-0 w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <Lightbulb size={20} className="text-accent" />
                  </div>
                  <p className="text-text text-sm font-medium pt-1 leading-relaxed">{tip}</p>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}