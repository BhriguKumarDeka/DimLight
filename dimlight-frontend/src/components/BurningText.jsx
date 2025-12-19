import { useRef, useEffect, useState } from 'react';
import { motion } from 'motion/react';

export function BurningText({
  text = '',
  delay = 200,
  animateBy = 'words', // 'words' or 'letters'
  className = '',
  threshold = 0.1,
  rootMargin = '0px',
}) {
  const elements = animateBy === 'words' ? text.split(' ') : text.split('');
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (ref.current) observer.unobserve(ref.current);
        }
      },
      { threshold, rootMargin }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return (
    <p ref={ref} className={`blur-text ${className} ${animateBy === 'words' ? 'flex flex-wrap gap-2 justify-center' : 'inline-block'}`}>
      {elements.map((word, index) => (
        <motion.span
          key={index}
          initial={{ filter: 'blur(10px)', opacity: 0 }}
          animate={inView ? { filter: 'blur(0px)', opacity: 1 } : { filter: 'blur(10px)', opacity: 0 }}
          transition={{
            duration: 1, // Smooth duration
            delay: (index * delay) / 1000,
            ease: [0.25, 0.4, 0.25, 1], // Soft easing
          }}
          className="inline-block will-change-[filter,opacity]"
        >
          {word === ' ' ? '\u00A0' : word}
        </motion.span>
      ))}
    </p>
  );
}