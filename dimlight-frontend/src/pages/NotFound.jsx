import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Moon } from "lucide-react";
import NightSky from "../components/NightSky";

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-background text-text flex flex-col items-center justify-center overflow-hidden selection:bg-primary/30">

      {/* Background */}
      <NightSky />

      {/* 404 */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <h1 className="text-[30vw] font-black text-surface tracking-tighter select-none leading-none mix-blend-overlay">
          404
        </h1>
      </div>

      {/* Astronaut */}
      <div className="relative z-10 w-full max-w-4xl h-[60vh] flex items-center justify-center perspective-1000">

        {/* Container */}
        <motion.div
          drag
          dragConstraints={{ left: -200, right: 200, top: -100, bottom: 100 }}
          dragElastic={0.1}
          whileDrag={{ cursor: "grabbing", scale: 1.1 }}
          whileHover={{ cursor: "grab" }}
          initial={{ scale: 0, x: 300, y: -150, rotate: 45, opacity: 0 }}
          animate={{ scale: 1, x: 0, y: 0, rotate: 0, opacity: 1 }}
          transition={{
            duration: 2.5,
            ease: "easeOut" // Decelerates like a drifting object
          }}
          className="relative group"
        >
          {/* Float Loop */}
          <motion.div
            animate={{
              y: [-15, 15, -15],
              rotate: [-5, 5, -5]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="relative"
          >
            {/* Image */}
            <img
              src="/remi-cry.png"
              alt="Lost Astronaut"
              className="w-64 md:w-96 object-contain relative z-10 pointer-events-none drop-shadow-2xl"
            />

            {/* Glow */}
            <motion.div
              animate={{ opacity: [0.4, 0.8, 0.2, 0.9, 0.5] }} // Simulates broken light
              transition={{ duration: 2, repeat: Infinity, repeatType: "mirror" }}
              className="absolute top-[40%] left-[20%] w-32 h-32 bg-primary/30 rounded-full blur-[50px] mix-blend-screen pointer-events-none z-20"
            />

            {/* Reflection */}
            <motion.div
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute inset-0 rounded-full bg-primary/10 blur-3xl -z-10"
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.8 }} // Waits for astronaut to arrive
        className="relative z-20 text-center max-w-140 px-6 -mt-12"
      >

        <h2 className="text-2xl md:text-3xl font-noraml text-text mb-3 tracking-tight">
          Drifting in the Void?
        </h2>

        <p className="text-textMuted text-sm leading-relaxed mb-8">
          The page you're looking for has drifted into deep space.
          <br />Let's guide you back to the dashboard.
        </p>

        <Link
          to="/"
          className="group relative inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-full bg-text text-background font-bold text-sm transition-all hover:scale-105 active:scale-95 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
        >
          <Moon size={16} />
          <span>DimLight</span>
        </Link>
      </motion.div>

    </div>
  );
}