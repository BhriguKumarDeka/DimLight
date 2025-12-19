import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, Pause, RefreshCw } from "lucide-react";

export default function BreathingVisualizer({ sequence = [], onStepChange }) {
  const [isActive, setIsActive] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState("idle");
  const [label, setLabel] = useState("Ready");
  const [nextLabel, setNextLabel] = useState(null);

  const timerRef = useRef(null);
  const preCueRef = useRef(null);

  const currentStep = sequence[currentIndex];

  const intensity = useMemo(() => {
    if (!sequence.length) return 0.6;
    const progress = currentIndex / sequence.length;
    return Math.min(1, 0.6 + progress * 0.4);
  }, [currentIndex, sequence.length]);

  // --- VARIANTS ---
  const orbVariant = (p) => {
    switch (p) {
      case "inhale":
        return { scale: 1.4 * intensity, opacity: 1 };
      case "hold":
        return { scale: 1.4 * intensity, opacity: 0.85 };
      case "exhale":
        return { scale: 1.0, opacity: 0.6 };
      default:
        return { scale: 1.0, opacity: 0.6 };
    }
  };

  // --- MAIN LOOP ---
  useEffect(() => {
    if (!isActive || !currentStep) {
      clearTimeout(timerRef.current);
      clearTimeout(preCueRef.current);
      if (!isActive && currentIndex === 0) {
          setPhase("idle");
          setLabel("Ready");
          setNextLabel(null);
      }
      return;
    }

    const runStep = () => {
      const step = sequence[currentIndex];
      const nextIndex = (currentIndex + 1) % sequence.length;

      setPhase(step.mode);
      setLabel(step.label);
      setNextLabel(null);
      onStepChange?.(currentIndex);

      const cueTime = Math.max(step.duration - 1500, step.duration * 0.8);
      
      preCueRef.current = setTimeout(() => {
        setNextLabel(sequence[nextIndex]?.label);
      }, cueTime);

      timerRef.current = setTimeout(() => {
        setCurrentIndex(nextIndex);
      }, step.duration);
    };

    runStep();

    return () => {
      clearTimeout(timerRef.current);
      clearTimeout(preCueRef.current);
    };
  }, [isActive, currentIndex, sequence]);

  const toggleSession = () => {
    if (!isActive && currentIndex === sequence.length) setCurrentIndex(0); 
    setIsActive(!isActive);
  };

  const resetSession = () => {
    setIsActive(false);
    setCurrentIndex(0);
    setPhase("idle");
    setLabel("Ready");
    setNextLabel(null);
    onStepChange?.(0);
  };

  const durationSec = currentStep ? currentStep.duration / 1000 : 0.5;

  if (!sequence.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-textMuted">
        No breathing steps defined.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full select-none w-full">

      {/* VISUAL CORE */}
      <div className="relative w-72 h-72 flex items-center justify-center mb-8">

        {/* 1. Progress Ring Background (Static Track) */}
        <svg className="absolute w-full h-full opacity-10" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>

        {/* 2. Active Progress Ring */}
        <motion.svg
          className="absolute w-full h-full -rotate-90"
          viewBox="0 0 100 100"
        >
          <motion.circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke="rgb(var(--primary))"
            strokeWidth="2"
            strokeLinecap="round"
            // Circumference = 2 * PI * 46 ≈ 289
            strokeDasharray="289"
            initial={{ strokeDashoffset: 289 }}
            animate={{
              strokeDashoffset:
                phase === "inhale" ? 0 :
                phase === "exhale" ? 289 :
                phase === "hold" ? (0) : 
                289
            }}
            transition={{
              duration: durationSec,
              ease: "linear"
            }}
          />
        </motion.svg>

        {/* 3. Orb Glow (Background Bloom) */}
        <motion.div
          animate={orbVariant(phase)}
          transition={{ duration: durationSec, ease: "easeInOut" }}
          className="absolute w-32 h-32 rounded-full bg-primary blur-[60px]"
        />

        {/* 4. Core Orb (Center) */}
        <motion.div
          animate={orbVariant(phase)}
          transition={{ duration: durationSec, ease: "easeInOut" }}
          className="
            relative z-10
            w-40 h-40 rounded-full
            bg-background/30
            border border-primary
            backdrop-blur-md
            flex flex-col items-center justify-center
          "
        >
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-text">
            {label}
          </span>
          
          {/* 5. Next Label (Absolute to prevent jumping) */}
          <div className="absolute top-24 w-full text-center h-4 overflow-visible">
              <AnimatePresence>
                {nextLabel && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 0.6, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-[9px] uppercase tracking-widest text-text"
                  >
                    Next · {nextLabel}
                  </motion.div>
                )}
              </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* CONTROLS (Fixed Height Container) */}
      <div className="h-12 flex gap-4">
        <button
          onClick={toggleSession}
          className="flex items-center gap-2 px-8 py-2.5 rounded-full bg-text text-background font-bold text-sm active:scale-95 transition-all hover:opacity-90 shadow-lg"
        >
          {isActive ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
          {isActive ? "Pause" : "Start"}
        </button>

        <button
          onClick={resetSession}
          className="p-2.5 rounded-full border border-border text-textMuted hover:text-text hover:bg-surface transition-all active:scale-95"
          aria-label="Reset Session"
        >
          <RefreshCw size={16} />
        </button>
      </div>
    </div>
  );
}