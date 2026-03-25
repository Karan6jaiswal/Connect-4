import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  pathLength: number;
  direction: "horizontal" | "vertical";
}

const CircuitBackground = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const generated: Particle[] = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 8 + 4,
      delay: Math.random() * 5,
      pathLength: Math.random() * 30 + 10,
      direction: Math.random() > 0.5 ? "horizontal" : "vertical",
    }));
    setParticles(generated);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Circuit lines */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.04]">
        {/* Horizontal lines */}
        {[15, 30, 45, 60, 75, 90].map((y) => (
          <line
            key={`h-${y}`}
            x1="0"
            y1={`${y}%`}
            x2="100%"
            y2={`${y}%`}
            stroke="hsl(190 100% 50%)"
            strokeWidth="0.5"
            strokeDasharray="8 16"
          />
        ))}
        {/* Vertical lines */}
        {[10, 25, 40, 55, 70, 85].map((x) => (
          <line
            key={`v-${x}`}
            x1={`${x}%`}
            y1="0"
            x2={`${x}%`}
            y2="100%"
            stroke="hsl(190 100% 50%)"
            strokeWidth="0.5"
            strokeDasharray="8 16"
          />
        ))}
        {/* Circuit nodes */}
        {[
          [10, 15], [25, 30], [40, 45], [55, 60], [70, 75], [85, 90],
          [10, 60], [40, 15], [70, 45], [55, 90], [25, 75], [85, 30],
        ].map(([x, y], i) => (
          <circle
            key={`node-${i}`}
            cx={`${x}%`}
            cy={`${y}%`}
            r="2"
            fill="hsl(190 100% 50%)"
            opacity="0.3"
          />
        ))}
      </svg>

      {/* Scanning beam */}
      <motion.div
        className="absolute left-0 right-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, hsl(190 100% 50% / 0.15), transparent)",
          boxShadow: "0 0 20px 2px hsl(190 100% 50% / 0.05)",
        }}
        animate={{ top: ["-5%", "105%"] }}
        transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
      />

      {/* Floating particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-neon-cyan"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            boxShadow: `0 0 ${p.size * 2}px hsl(var(--neon-cyan) / 0.5)`,
          }}
          animate={
            p.direction === "horizontal"
              ? { x: [0, p.pathLength, 0], opacity: [0, 0.7, 0] }
              : { y: [0, p.pathLength, 0], opacity: [0, 0.7, 0] }
          }
          transition={{
            repeat: Infinity,
            duration: p.duration,
            delay: p.delay,
            ease: "linear",
          }}
        />
      ))}

      {/* Corner brackets - top left */}
      <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-neon-cyan/20 rounded-tl-sm" />
      {/* Corner brackets - top right */}
      <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-neon-cyan/20 rounded-tr-sm" />
      {/* Corner brackets - bottom left */}
      <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-neon-cyan/20 rounded-bl-sm" />
      {/* Corner brackets - bottom right */}
      <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-neon-cyan/20 rounded-br-sm" />

      {/* Data stream text */}
      <motion.div
        className="absolute top-6 left-6 font-body text-[8px] tracking-[0.3em] text-neon-cyan/20"
        animate={{ opacity: [0.1, 0.3, 0.1] }}
        transition={{ repeat: Infinity, duration: 4 }}
      >
        SYS://CONNECT4.AI
      </motion.div>
      <motion.div
        className="absolute bottom-6 right-6 font-body text-[8px] tracking-[0.3em] text-neon-magenta/20"
        animate={{ opacity: [0.1, 0.3, 0.1] }}
        transition={{ repeat: Infinity, duration: 4, delay: 2 }}
      >
        NEURAL.NET.v4.0
      </motion.div>
    </div>
  );
};

export default CircuitBackground;
