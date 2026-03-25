import { motion } from "framer-motion";

const RobotMascot = ({ thinking = false }: { thinking?: boolean }) => {
  return (
    <motion.div
      className="relative select-none"
      animate={{ y: [0, -8, 0] }}
      transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
    >
      {/* Robot body */}
      <div className="relative w-16 h-20 md:w-20 md:h-24">
        {/* Antenna */}
        <motion.div
          className="absolute -top-3 left-1/2 -translate-x-1/2 flex flex-col items-center"
          animate={thinking ? { rotateZ: [-10, 10, -10] } : {}}
          transition={{ repeat: Infinity, duration: 0.5 }}
        >
          <motion.div
            className="w-2 h-2 rounded-full bg-neon-cyan"
            animate={{ opacity: [1, 0.3, 1], scale: [1, 1.3, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            style={{ boxShadow: "0 0 8px hsl(var(--neon-cyan))" }}
          />
          <div className="w-0.5 h-3 bg-border" />
        </motion.div>

        {/* Head */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-10 md:w-14 md:h-12 rounded-lg border-2 border-neon-cyan/60 bg-card/80"
          style={{ boxShadow: "inset 0 0 12px hsl(var(--neon-cyan) / 0.15)" }}
        >
          {/* Eyes */}
          <div className="flex justify-center gap-2 pt-2.5 md:pt-3">
            <motion.div
              className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-sm bg-neon-cyan"
              animate={thinking 
                ? { scaleY: [1, 0.2, 1], backgroundColor: ["hsl(var(--neon-magenta))", "hsl(var(--neon-cyan))", "hsl(var(--neon-magenta))"] } 
                : { scaleY: [1, 0.1, 1] }
              }
              transition={thinking 
                ? { repeat: Infinity, duration: 0.4 } 
                : { repeat: Infinity, duration: 3, repeatDelay: 2 }
              }
              style={{ boxShadow: "0 0 6px hsl(var(--neon-cyan))" }}
            />
            <motion.div
              className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-sm bg-neon-cyan"
              animate={thinking 
                ? { scaleY: [1, 0.2, 1], backgroundColor: ["hsl(var(--neon-magenta))", "hsl(var(--neon-cyan))", "hsl(var(--neon-magenta))"] } 
                : { scaleY: [1, 0.1, 1] }
              }
              transition={thinking 
                ? { repeat: Infinity, duration: 0.4, delay: 0.1 } 
                : { repeat: Infinity, duration: 3, repeatDelay: 2, delay: 0.1 }
              }
              style={{ boxShadow: "0 0 6px hsl(var(--neon-cyan))" }}
            />
          </div>
          {/* Mouth */}
          <motion.div
            className="mx-auto mt-1 h-0.5 rounded-full bg-neon-cyan/50"
            animate={thinking ? { width: ["40%", "60%", "30%", "50%"] } : { width: "40%" }}
            transition={thinking ? { repeat: Infinity, duration: 0.6 } : {}}
            style={{ boxShadow: "0 0 4px hsl(var(--neon-cyan) / 0.3)" }}
          />
        </div>

        {/* Body */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-8 md:w-12 md:h-10 rounded-md border-2 border-neon-cyan/40 bg-card/60"
          style={{ boxShadow: "inset 0 0 8px hsl(var(--neon-cyan) / 0.1)" }}
        >
          {/* Chest light */}
          <motion.div
            className="mx-auto mt-1.5 w-4 h-1 md:w-5 md:h-1.5 rounded-full"
            animate={{
              backgroundColor: thinking
                ? ["hsl(var(--neon-magenta))", "hsl(var(--neon-cyan))", "hsl(var(--neon-magenta))"]
                : ["hsl(var(--neon-cyan))", "hsl(var(--neon-green))", "hsl(var(--neon-cyan))"],
            }}
            transition={{ repeat: Infinity, duration: thinking ? 0.5 : 2 }}
            style={{ boxShadow: "0 0 8px hsl(var(--neon-cyan) / 0.4)" }}
          />
          {/* Chest lines */}
          <div className="flex flex-col items-center gap-0.5 mt-1">
            <div className="w-6 h-px bg-neon-cyan/20" />
            <div className="w-4 h-px bg-neon-cyan/15" />
          </div>
        </div>

        {/* Arms */}
        <motion.div
          className="absolute top-12 md:top-14 -left-1.5 w-1.5 h-5 md:w-2 md:h-6 rounded-full bg-border"
          animate={thinking ? { rotateZ: [0, -15, 0] } : { rotateZ: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: thinking ? 0.6 : 2 }}
          style={{ transformOrigin: "top center" }}
        />
        <motion.div
          className="absolute top-12 md:top-14 -right-1.5 w-1.5 h-5 md:w-2 md:h-6 rounded-full bg-border"
          animate={thinking ? { rotateZ: [0, 15, 0] } : { rotateZ: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: thinking ? 0.6 : 2, delay: 0.3 }}
          style={{ transformOrigin: "top center" }}
        />
      </div>
    </motion.div>
  );
};

export default RobotMascot;
