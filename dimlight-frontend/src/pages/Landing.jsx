import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform, useMotionValue, animate, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Moon,
  Plus,
  Minus,
  CheckCircle2,
  Pause,
  Play,
} from "lucide-react";
import { BurningText } from "../components/BurningText";
import AvatarGroup from "../components/AvatarGroup";

// --- Visual Components ---

const NightSky = () => {
  const { scrollY } = useScroll();
  const [stars, setStars] = useState([]);
  const [meteors, setMeteors] = useState([]);

  const yBack = useTransform(scrollY, [0, 1000], [0, 600]);
  const yMid = useTransform(scrollY, [0, 1000], [0, 400]);
  const yFront = useTransform(scrollY, [0, 1000], [0, 100]);

  useEffect(() => {
    const starCount = 100;
    const generatedStars = Array.from({ length: starCount }).map((_, i) => {
      const size = Math.random() * 2 + 0.5;
      let layer = "back";
      if (size > 2) layer = "front";
      else if (size > 1.2) layer = "mid";

      return {
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size,
        opacity: Math.random() * 0.7 + 0.2,
        layer,
      };
    });
    setStars(generatedStars);

    const meteorCount = 5;
    const generatedMeteors = Array.from({ length: meteorCount }).map(
      (_, i) => ({
        id: i,
        left: Math.floor(Math.random() * 150) - 50 + "%",
        delay: Math.random() * 12,
        duration: Math.random() * 3 + 2.5,
      })
    );
    setMeteors(generatedMeteors);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <motion.div style={{ y: yBack }} className="absolute inset-0">
        {stars
          .filter((s) => s.layer === "back")
          .map((star) => (
            <motion.div
              key={star.id}
              className="absolute rounded-full bg-text"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                opacity: star.opacity,
              }}
              animate={{ opacity: [star.opacity, 1, star.opacity] }}
              transition={{
                duration: Math.random() * 3 + 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
      </motion.div>

      <motion.div style={{ y: yMid }} className="absolute inset-0">
        {stars
          .filter((s) => s.layer === "mid")
          .map((star) => (
            <motion.div
              key={star.id}
              className="absolute rounded-full bg-text"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: star.size,
                height: star.size,
                opacity: star.opacity,
              }}
              animate={{ opacity: [star.opacity, 1, star.opacity] }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
      </motion.div>

      <motion.div style={{ y: yFront }} className="absolute inset-0">
        {stars
          .filter((s) => s.layer === "front")
          .map((star) => (
            <motion.div
              key={star.id}
              className="absolute rounded-full bg-text"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: star.size,
                height: star.size,
                opacity: star.opacity,
                boxShadow: `0 0 ${star.size * 2}px rgba(255,255,255,0.8)`,
              }}
              animate={{ opacity: [star.opacity, 1, star.opacity] }}
              transition={{
                duration: Math.random() * 2 + 1,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}

        {meteors.map((meteor) => (
          <span
            key={meteor.id}
            className="absolute meteor-rotate flex items-center pointer-events-none"
            style={{
              top: -120,
              left: meteor.left,
              animation: `meteor ${meteor.duration}s linear infinite`,
              animationDelay: `${meteor.delay}s`,
              opacity: 0,
            }}
          >
            <div
              className="shrink-0 rounded-full"
              style={{
                width: "5px",
                height: "5px",
                background:
                  "radial-gradient(circle, rgba(255,255,255,1) 55%, rgba(167,139,250,0.9) 100%)",
                boxShadow:
                  "0 0 14px 5px rgba(100,200, 235,0.5), 0 0 8px 3px rgba(255,255,255,0.9)",
                mixBlendMode: "additive",
              }}
            />
            <div
              className="-ml-1"
              style={{
                width: "140px",
                height: "1.8px",
                borderRadius: "2px",
                background:
                  "linear-gradient(90deg, rgba(255,255,255,255) 0%, rgba(100,200,250,0.55) 45%, rgba(94,234,212,0.3) 65%, rgba(255,255,255,0) 100%)",
                filter: "blur(0.35px)",
                boxShadow: "0 0 12px 3px rgba(167,139,250,0.25)",
                mixBlendMode: "screen",
              }}
            />
          </span>
        ))}
      </motion.div>

      <style>{`
        @keyframes meteor {
          0% { transform: rotate(215deg) translateX(0); opacity: 0; }
          10% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: rotate(215deg) translateX(-600px); opacity: 0; }
        }
        .meteor-rotate { transform: rotate(215deg); }
      `}</style>
    </div>
  );
};

const HeroImage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
      className="mt-16 relative w-full max-w-6xl mx-auto z-10"
    >
      <div className="relative rounded-xl overflow-hidden shadow-2xl">
        <img
          src="/hero-img.png"
          alt="DimLight Dashboard"
          className="w-full h-auto object-cover"
        />

        {/* Optional: Inner shadow for depth */}
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]" />
      </div>
    </motion.div>
  );
};

const FloatingAstronaut = () => {
  return (
    <motion.div
      className="absolute z-50 hidden xl:block cursor-grab active:cursor-grabbing"
      drag
      dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
      dragElastic={0.1}
      whileDrag={{ scale: 1.1, cursor: "grabbing" }}
      whileHover="sleep"
      initial={{ x: 0, y: 0 }}
      style={{ top: "15%", right: "10%" }}
    >
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative"
      >
        <img
          src="/remi.png"
          alt="Floating Astronaut"
          className="w-64 h-auto drop-shadow-[0_0_50px_rgba(12, 175, 235, 0.5)] pointer-events-none"
        />
      </motion.div>
    </motion.div>
  );
};

const DashboardCard = ({
  children,
  className = "",
  title,
  subtitle,
  icon: Icon,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className={`relative rounded-3xl border border-white/5 bg-surface overflow-hidden group flex flex-col transition-colors ${className}`}
    >
      {/* Header */}
      <div className="relative z-20 p-6 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <h3 className="text-sm font-bold text-white tracking-wide uppercase">
              {title}
            </h3>
          </div>
          <p className="text-xs text-textMuted font-light leading-relaxed max-w-[260px]">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Content Area */}
      <div className="relative z-20 flex-1 w-full flex items-center justify-center pb-6">
        {children}
      </div>
    </motion.div>
  );
};

const TrendsVisual = () => {
  return (
    <div className="relative w-full h-full flex items-end opacity-90 overflow-hidden">
      <svg className="w-full h-32" viewBox="0 0 600 120" preserveAspectRatio="none">
        <defs>
          <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#22D3EE" stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.g
          animate={{ x: [-300, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <path
            d="M0 80 Q 50 40, 100 80 T 200 80 T 300 50 T 400 80 T 500 90 T 600 80 T 700 40 T 800 80 T 900 80"
            fill="url(#trendFill)"
            stroke="#22D3EE"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M0 90 Q 50 100, 100 90 T 200 60 T 300 90 T 400 100 T 500 80 T 600 90 T 700 100 T 800 60 T 900 90"
            fill="none"
            stroke="#22D3EE"
            strokeWidth="1"
            strokeOpacity="0.3"
            strokeLinecap="round"
            strokeDasharray="4 4"
          />
        </motion.g>
      </svg>
    </div>
  );
};

const BreathingVisual = () => {
  const tracks = [
    { title: "Box Breathing", duration: "5 min", active: true },
    { title: "NSDR Protocol", duration: "20 min", active: false },
    { title: "Deep Focus", duration: "45 min", active: false },
    { title: "Sleep Inducer", duration: "60 min", active: false },
  ];

  return (
    <div className="w-full h-full flex flex-col gap-3 justify-center px-4">
      {tracks.map((track, i) => (
        <motion.div
          key={i}
          className={`group flex items-center justify-between p-3.5 rounded-xl border transition-all duration-300 ${track.active
            ? "bg-primary/5 border-primary/20"
            : "bg-[#15151A] border-white/5 hover:border-white/10"
            }`}
        >
          <div className="flex items-center gap-3.5">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${track.active ? "bg-primary text-black" : "bg-white/5 text-gray-400"
              }`}>
              {track.active ? <Pause size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" />}
            </div>
            <div>
              <div className={`text-xs font-medium ${track.active ? "text-white" : "text-gray-400"}`}>
                {track.title}
              </div>
              <div className="text-[10px] text-gray-600 font-mono mt-0.5">{track.duration}</div>
            </div>
          </div>

          {/* Minimal Equalizer for Active Track */}
          {track.active && (
            <div className="flex gap-0.5 items-end h-3">
              {[1, 2, 3, 4].map((bar) => (
                <motion.div
                  key={bar}
                  className="w-0.5 bg-secondary"
                  animate={{ height: [4, 12, 6, 12, 4] }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: bar * 0.1,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

const ReadinessVisual = () => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    // Simple count up from 0 to 76
    const controls = animate(count, 76, { duration: 1.5, ease: "easeOut" });
    return controls.stop;
  }, []);

  return (
    <div className="relative flex items-center justify-center">
      <svg className="w-32 h-32 -rotate-90">
        <circle cx="64" cy="64" r="52" stroke="#1F1F25" strokeWidth="6" fill="none" />

        <motion.circle
          cx="64" cy="64" r="52"
          stroke="#22D3EE" strokeWidth="6" fill="none"
          strokeLinecap="round"
          strokeDasharray="326"
          initial={{ strokeDashoffset: 326 }}
          whileInView={{ strokeDashoffset: 78 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {/* The Counter */}
        <motion.span className="text-4xl font-bold text-white tracking-tighter">
          {rounded}
        </motion.span>
        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
          Optimal
        </span>
      </div>
    </div>
  );
};

const ConsistencyVisual = () => {
  const days = Array.from({ length: 35 });
  const activeIndices = [0, 1, 3, 4, 6, 7, 8, 10, 14, 15, 16, 18, 20, 21, 22, 24, 25, 27, 28, 29, 31, 32];

  return (
    <div className="w-full flex items-center justify-center">
      <div className="grid grid-cols-7 gap-1.5">
        {days.map((_, i) => {
          const isActive = activeIndices.includes(i);
          const isToday = i === 34;

          return (
            <motion.div
              key={i}
              className={`w-3 h-3 rounded-sm ${isActive ? 'bg-primary' : 'bg-white/10'}`}
              // Base opacity: dim if inactive, bright if active
              initial={{ opacity: isActive ? 0.8 : 1 }}
              // Breathing Animation
              animate={isActive ? {
                opacity: [0.5, 1, 0.5],
                scale: [1, 1.1, 1],
              } : {}}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut"
              }}
            >
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

const FAQItem = ({ question, answer, isOpen, onClick }) => (
  <div className="border-b border-border">
    <button
      onClick={onClick}
      className="flex w-full items-center justify-between py-6 text-left focus:outline-none group"
    >
      <span
        className={`text-sm font-medium transition-colors ${isOpen ? "text-text" : "text-textMuted group-hover:text-text"
          }`}
      >
        {question}
      </span>
      {isOpen ? (
        <Minus className="h-4 w-4 text-primary" />
      ) : (
        <Plus className="h-4 w-4 text-textMuted group-hover:text-primary" />
      )}
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden"
        >
          <div className="pb-6 text-sm text-textMuted pr-8 leading-relaxed">
            {answer}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

// --- Main Page ---

export default function Landing() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="relative min-h-screen bg-background text-text font-sans selection:bg-primary/30 overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-4 left-0 right-0 z-50 flex justify-center">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center gap-8 rounded-full border border-border bg-surface/30 px-6 py-3 backdrop-blur-md shadow-sm"
        >
          <div className="flex items-center gap-2">
            <Moon className="h-4 w-4 fill-white text-white" />
            <span className="text-sm font-light tracking-tight text-text">
              DimLight
            </span>
          </div>
          <div className="hidden items-center gap-6 text-xs font-medium text-textMuted md:flex">
            <a
              href="#features"
              className="text-xs font-medium text-textMuted hover:text-text transition-colors"
            >
              Features
            </a>
            <a
              href="#faq"
              className="text-xs font-medium text-textMuted hover:text-text transition-colors"
            >
              FAQ
            </a>
            <a
              href="#pricing"
              className="text-xs font-medium text-textMuted hover:text-text transition-colors"
            >
              Pricing
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-xs font-medium text-textMuted hover:text-text transition-colors"
            >
              Log in
            </Link>
            <Link
              to="/signup"
              className="rounded-full bg-white px-4 py-1.5 text-xs font-bold text-black transition-transform hover:scale-105"
            >
              Start
            </Link>
          </div>
        </motion.div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden border-b border-border pt-32 pb-20 bg-background">
        <NightSky />
        <FloatingAstronaut />

        <motion.div
          style={{ y }}
          className="relative z-10 text-center px-6 max-w-4xl mx-auto w-full"
        >
          <h1 className="text-5xl md:text-7xl font-extralight tracking-tighter leading-[1.1] mb-4 text-text">
            <BurningText text="Understand Your Sleep" />
          </h1>

          <p className="text-textMuted max-w-6xl mx-auto mb-8 text-md md:text-base leading-relaxed">
            DimLight analyzes your sleep patterns, mood and habits <br />
            to give you personalized wellness guidance.
          </p>

          <div className="flex justify-center gap-4 mb-12">
            <Link
              to="/signup"
              className="btn-primary rounded-full px-8 py-3 flex items-center gap-2 group"
            >
              Start My Journey
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <HeroImage />
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="py-32 px-6 bg-background relative max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-2">
            Your Wellness Overview.
          </h2>
          <p className="text-textMuted text-light text-sm">
            A comprehensive dashboard that translates complex biometric signals into clear, daily readiness scores.
          </p>
        </div>

        {/* THE NEW LAYOUT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[240px]">
          <DashboardCard
            className="md:col-span-2"
            title="Sleep Trends"
            subtitle="Correlate your sleep depth with daily recovery metrics over time."
          >
            <TrendsVisual />
          </DashboardCard>

          <DashboardCard
            className="md:col-span-1 md:row-span-2"
            title="Breathing Library"
            subtitle="Instant access to guided NSDR, breathing, and focus sessions."
          >
            <BreathingVisual />
          </DashboardCard>

          <DashboardCard
            title="Daily Readiness"
            subtitle="Your body's capacity to perform."
          >
            <ReadinessVisual />
          </DashboardCard>

          <DashboardCard
            title="Consistency"
            subtitle="Visualize your logging streaks."
          >
            <ConsistencyVisual />
          </DashboardCard>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 px-6 max-w-4xl mx-auto bg-background">
        <div className="mb-12">
          <h2 className="text-3xl font-semibold text-text">Common Questions</h2>
          <p className="text-textMuted text-sm mt-2">
            Is DimLight right for you?
          </p>
        </div>
        <div className="space-y-1">
          {[
            {
              q: "Do I need a wearable device?",
              a: "No. DimLight works perfectly with manual logging. We focus on how you feel and your habits, not just heart rate numbers.",
            },
            {
              q: "How is this different from a normal alarm app?",
              a: "Normal apps just wake you up. DimLight explains *why* you feel tired, tracks your mood, and acts as a coach to help you build better hygiene.",
            },
            {
              q: "Is the AI Coach a real person?",
              a: "It is an advanced AI trained on sleep science and behavioral wellness. It provides instant, personalized feedback based on your logs.",
            },
            {
              q: "Is my journal private?",
              a: "Absolutely. Your journal entries and sleep data are stored locally in your browser. We prioritize your privacy.",
            },
          ].map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.q}
              answer={faq.a}
              isOpen={openFaq === index}
              onClick={() => setOpenFaq(openFaq === index ? null : index)}
            />
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-32 px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10 px-6">

          {/* Section Header */}
          <div className="mb-20">
            <h2 className="text-3xl md:text-3xl font-semibold text-text mb-4 tracking-tight">
              Pricing Tier
            </h2>
            <p className="text-textMuted text-sm">
              Start building better habits today. Upgrade for deep biometric insights.
            </p>
          </div>

          {/* Pricing Grid */}
          <div className="grid md:grid-cols-2 gap-6 lg:gap-12 items-start">
            <div className="p-8 rounded-lg bg-surface flex flex-col justify-between h-full border border-transparent hover:border hover:border-border transition-colors duration-300">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-sm font-bold text-textMuted uppercase tracking-widest">
                    Starter
                  </h3>
                </div>

                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl font-bold text-text">₹0</span>
                  <span className="text-textMuted font-medium">/ forever</span>
                </div>

                <p className="text-sm text-textMuted mb-8 border-b border-white/5 pb-8">
                  Essential tools to start tracking your sleep consistency.
                </p>

                <ul className="space-y-4 mb-8">
                  {[
                    "Manual Sleep Logging",
                    "7-Day History Access",
                    "Basic Sleep Score",
                    "Daily Reminder Notifications"
                  ].map((feature, i) => (
                    <li key={i} className="flex gap-3 text-sm text-textMuted">
                      <CheckCircle2 className="w-5 h-5 text-textMuted shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                to="/signup"
                className="w-full py-4 rounded-xl border border-border text-text text-sm font-bold hover:bg-white/5 transition-all text-center block"
              >
                Get Started
              </Link>
            </div>

            <div className="relative p-8 rounded-lg border-2 border-primary/30 hover:border-primary/60 bg-surface flex flex-col justify-between h-full shadow-[0_0_40px_-10px_rgba(34,211,238,0.1)] overflow-hidden group">

              <div className="absolute inset-0 bg-linear-to-b from-primary/5 to-transparent pointer-events-none" />

              <div>
                <div className="flex justify-between items-center mb-6 relative z-10">
                  <h3 className="text-sm font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                    Premium
                  </h3>
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold border border-primary/20">
                    RECOMMENDED
                  </span>
                </div>

                <div className="flex items-baseline gap-1 mb-8 relative z-10">
                  <span className="text-5xl font-bold text-text tracking-tight">₹199</span>
                  <span className="text-textMuted font-medium">/ month</span>
                </div>

                <p className="text-sm text-textMuted mb-8 border-b border-border pb-8 relative z-10">
                  Unlock the full power of the AI Coach and deep trend analytics.
                </p>

                <ul className="space-y-4 mb-8 relative z-10">
                  {[
                    "Everything in Starter",
                    "Personalized AI Wellness Coach",
                    "Unlimited Journal History",
                    "Mood & Trend Correlations",
                    "Exclusive Recovery Protocols"
                  ].map((feature, i) => (
                    <li key={i} className="flex gap-3 text-sm text-text font-medium">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                to="/signup"
                className="relative z-10 w-full py-4 rounded-xl bg-primary text-white text-sm font-bold hover:opacity-90 hover:scale-[1.02] transition-all text-center block shadow-lg shadow-primary/20"
              >
                Start 14-Day Free Trial
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-white/5 pt-20 pb-8 px-6 relative overflow-hidden">

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 mb-20 relative z-10">
        
        {/* BRAND COLUMN */}
        <div className="md:col-span-4">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-xl font-bold tracking-tighter text-text">
              DIMLIGHT
            </span>
          </div>
          <p className="text-xs text-textMuted font-mono leading-relaxed uppercase mb-6">
            Optimizing sleep at <span className="text-text font-bold lowercase">www.dimlight.space</span>
            <br />
            through data, insight, and support.
            <br />
            <br />
            Made with care.
          </p>
          
          {/* Social Links */}
          <div className="flex gap-4">
            <a 
              href="https://github.com/BhriguKumarDeka/DimLight" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-textMuted hover:text- transition-colors"
              aria-label="View source on GitHub"
            >
              <img src="/github-mark-white.svg" alt="GitHub logo" className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* QUICK LINKS */}
        <div className="md:col-span-2">
          <h4 className="text-text text-xs font-bold uppercase tracking-wider mb-6">
            Quick Links
          </h4>
          <ul className="space-y-4 text-xs text-textMuted font-mono">
            <li>
              <a href="#features" className="hover:text-primary transition-colors">Features</a>
            </li>
            <li>
              <a href="#faq" className="hover:text-primary transition-colors">FAQ</a>
            </li>
            <li>
              <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
            </li>
            <li>
              <a href="/NotFound" className="hover:text-primary transition-colors">Easter Egg</a>
            </li>
          </ul>
        </div>

        {/* SUPPORT */}
        <div className="md:col-span-3">
          <h4 className="text-text text-xs font-bold uppercase tracking-wider mb-6">
            Support
          </h4>
          <ul className="space-y-4 text-xs text-textMuted font-mono">
            <li>
              <a href="#" className="hover:text-primary transition-colors">Guide</a>
            </li>
            <li>
              <a href="#" className="hover:text-primary  transition-colors">Privacy Policy</a>
            </li>
            <li>
              <a href="#" className="hover:text-primary  transition-colors">Terms of Service</a>
            </li>
             <li>
              <a href="mailto:support@dimlight.space" className="hover:text-primary transition-colors">
                support@dimlight.space
              </a>
            </li>
          </ul>
        </div>

        <div className="md:col-span-3">
           <div className="opacity-80 hover:opacity-100 transition-opacity">
              <AvatarGroup />
           </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-[10px] text-textMuted font-mono uppercase border-t border-white/5 pt-8">
        <div>
          © 2025 DIMLIGHT INC. | <a href="https://dimlight.space" className="hover:text-text transition-colors">dimlight.space</a>
        </div>
        <div className="flex gap-4 mt-4 md:mt-0">
          <span>v3.0.0</span>
          <span className="w-1.5 h-1.5 rounded-full bg-green-500/50 inline-block my-auto ml-2"></span>
          <span>Online</span>
        </div>
      </div>
    </footer>
    </div>
  );
}
