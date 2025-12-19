import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";

export default function NightSky({ minimal = false }) {
  const { scrollY } = useScroll();
  const [stars, setStars] = useState([]);
  const [shootingStars, setShootingStars] = useState([]);

  // Parallax Transforms
  const yBack = useTransform(scrollY, [0, 1000], [0, 50]);
  const yFront = useTransform(scrollY, [0, 1000], [0, 100]);

  useEffect(() => {
    const starCount = minimal ? 60 : 100;

    const generatedStars = Array.from({ length: starCount }).map((_, i) => {
      // Logic: 40% of stars forced to top-right quadrant (x > 50, y < 40)
      const isBiased = Math.random() > 0.6;

      let x, y;
      if (isBiased) {
        x = 50 + (Math.random() * 50); // 50% to 100%
        y = Math.random() * 40;        // 0% to 40%
      } else {
        x = Math.random() * 100;
        y = Math.random() * 100;
      }

      return {
        id: i,
        x,
        y,
        size: Math.random() * (minimal ? 1.5 : 2) + 0.5,
        opacity: Math.random() * 0.5 + 0.2,
        layer: Math.random() > 0.6 ? 'front' : 'back'
      };
    });
    setStars(generatedStars);
  }, [minimal]);

  // Shooting Star Logic
  useEffect(() => {
    const interval = setInterval(() => {
      const id = Date.now();
      const newStar = {
        id,
        x: 60 + Math.random() * 40, // Start in right side
        y: Math.random() * 30,      // Start in top area
        delay: 0
      };

      setShootingStars(prev => [...prev, newStar]);

      // Remove after animation
      setTimeout(() => {
        setShootingStars(prev => prev.filter(s => s.id !== id));
      }, 2000);

    }, 4000); // New trail every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-2">

      {/* Back */}
      <motion.div style={{ y: yBack }} className="absolute inset-0">
        {stars.filter(s => s.layer === 'back').map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-text/40"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size,
              height: star.size,
              opacity: star.opacity,
            }}
          />
        ))}
      </motion.div>

      {/* Front */}
      <motion.div style={{ y: yFront }} className="absolute inset-0">
        {stars.filter(s => s.layer === 'front').map((star) => (
          <motion.div
            key={star.id}
            className="absolute rounded-full bg-text"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size,
              height: star.size,
              opacity: star.opacity,
              boxShadow: minimal ? 'none' : `0 0 ${star.size * 2}px rgba(255,255,255,0.8)`
            }}
            animate={{ opacity: [star.opacity, 1, star.opacity] }}
            transition={{ duration: Math.random() * 3 + 2, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </motion.div>

      {/* Trails */}
      {shootingStars.map(star => (
        <div
          key={star.id}
          className="absolute h-px bg-linear-to-r from-transparent via-text/70 to-transparent"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: '60px',
            transform: 'rotate(-45deg)',
            animation: 'shoot 1.5s linear forwards',
            opacity: 0.6
          }}
        />
      ))}

      <style>{`
        @keyframes shoot {
            0% { transform: translateX(0) translateY(0) rotate(-45deg); opacity: 0; }
            10% { opacity: 0.8; }
            100% { transform: translateX(-200px) translateY(200px) rotate(-45deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}