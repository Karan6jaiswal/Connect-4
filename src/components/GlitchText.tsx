import { motion } from "framer-motion";

interface GlitchTextProps {
  text: string;
  className?: string;
}

const GlitchText = ({ text, className = "" }: GlitchTextProps) => {
  return (
    <div className={`relative inline-block ${className}`}>
      {/* Main text */}
      <span className="relative z-10">{text}</span>
      {/* Glitch layers */}
      <motion.span
        className="absolute inset-0 text-neon-cyan opacity-0"
        aria-hidden
        animate={{
          opacity: [0, 0.8, 0, 0, 0.6, 0],
          x: [0, -2, 0, 1, -1, 0],
          y: [0, 1, 0, -1, 0, 0],
        }}
        transition={{ repeat: Infinity, duration: 4, repeatDelay: 3 }}
      >
        {text}
      </motion.span>
      <motion.span
        className="absolute inset-0 text-neon-magenta opacity-0"
        aria-hidden
        animate={{
          opacity: [0, 0, 0.6, 0, 0, 0.7, 0],
          x: [0, 1, 2, 0, -1, 0, 0],
          y: [0, -1, 0, 1, 0, -1, 0],
        }}
        transition={{ repeat: Infinity, duration: 4, repeatDelay: 3, delay: 0.05 }}
      >
        {text}
      </motion.span>
    </div>
  );
};

export default GlitchText;
