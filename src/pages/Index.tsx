import { motion } from "framer-motion";
import GameBoard from "@/components/GameBoard";
import CircuitBackground from "@/components/CircuitBackground";
import GlitchText from "@/components/GlitchText";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Scanline overlay */}
      <div className="scanlines absolute inset-0 pointer-events-none z-20" />

      {/* Circuit background */}
      <CircuitBackground />

      {/* Glow orbs */}
      <motion.div
        className="absolute top-1/4 -left-20 w-80 h-80 rounded-full opacity-10 blur-3xl bg-primary"
        animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.15, 0.08] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full opacity-10 blur-3xl bg-secondary"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.08, 0.15, 0.08] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 3 }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 flex flex-col items-center gap-6"
      >
        <div className="text-center">
          <h1 className="font-display text-4xl md:text-6xl font-black tracking-wider text-glow-cyan text-foreground">
            <GlitchText text="CONNECT" />
            <span className="text-neon-cyan">4</span>
          </h1>
          <motion.p
            className="font-body text-muted-foreground tracking-[0.3em] text-xs mt-2"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            ▸ MINIMAX AI • ALPHA-BETA PRUNING ◂
          </motion.p>
        </div>

        <GameBoard />
      </motion.div>

      {/* Bottom tech bar */}
      <motion.div
        className="absolute bottom-2 left-0 right-0 flex justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="flex items-center gap-3 font-body text-[9px] tracking-[0.3em] text-muted-foreground/30">
          <motion.div
            className="w-1 h-1 rounded-full bg-neon-green/50"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
          
          <motion.div
            className="w-1 h-1 rounded-full bg-neon-green/50"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 2, delay: 1 }}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default Index;
