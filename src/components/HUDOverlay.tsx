import { motion } from "framer-motion";
import { useMemo } from "react";
import { scorePosition, PLAYER_PIECE, AI_PIECE, type Board, type GameStatus } from "@/lib/gameLogic";

interface HUDOverlayProps {
  moveCount: number;
  status: GameStatus;
  board: Board;
  thinking: boolean;
}

const HUDOverlay = ({ moveCount, status, board, thinking }: HUDOverlayProps) => {
  const { playerPct, aiPct, playerThreat, aiThreat } = useMemo(() => {
    const playerScore = scorePosition(board, PLAYER_PIECE);
    const aiScore = scorePosition(board, AI_PIECE);
    // Normalize scores to a 10-95% range for the bars
    const maxScore = Math.max(Math.abs(playerScore), Math.abs(aiScore), 1);
    const pPct = Math.min(95, Math.max(10, 10 + (playerScore / maxScore) * 85));
    const aPct = Math.min(95, Math.max(10, 10 + (aiScore / maxScore) * 85));
    // Threat level labels
    const toThreat = (pct: number) =>
      pct > 75 ? "CRITICAL" : pct > 50 ? "HIGH" : pct > 30 ? "MODERATE" : "LOW";
    return { playerPct: pPct, aiPct: aPct, playerThreat: toThreat(pPct), aiThreat: toThreat(aPct) };
  }, [board]);

  const playerBarColor =
    playerPct > 75 ? "bg-neon-green" : playerPct > 50 ? "bg-neon-cyan" : playerPct > 30 ? "bg-neon-yellow" : "bg-destructive";
  const aiBarColor =
    aiPct > 75 ? "bg-neon-magenta" : aiPct > 50 ? "bg-secondary" : aiPct > 30 ? "bg-neon-yellow" : "bg-destructive";

  const statusLabel =
    status === "player_wins" ? "VICTORY" :
    status === "ai_wins" ? "DEFEATED" :
    status === "draw" ? "STALEMATE" :
    thinking ? "PROCESSING" : "STANDBY";

  return (
    <div className="w-full max-w-md flex justify-between font-body text-[10px] tracking-[0.2em] text-muted-foreground/50 px-2">
      {/* Left HUD - Player */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1.5">
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-neon-green"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
          <span>HUMAN.SYS</span>
        </div>
        <span className={playerPct > 60 ? "text-neon-cyan/70" : "text-muted-foreground/40"}>
          THREAT: {playerThreat}
        </span>
        <div className="flex items-center gap-1">
          <span>PWR:</span>
          <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden relative">
            <motion.div
              className={`h-full rounded-full ${playerBarColor}`}
              animate={{ width: `${playerPct}%` }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
            />
            {playerPct > 60 && (
              <motion.div
                className="absolute inset-0 rounded-full bg-neon-cyan/20"
                animate={{ opacity: [0, 0.4, 0] }}
                transition={{ repeat: Infinity, duration: 1 }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Center status */}
      <div className="flex flex-col items-center gap-1">
        <motion.span
          className={`text-[9px] tracking-[0.3em] ${thinking ? "text-neon-magenta/60" : "text-muted-foreground/40"}`}
          animate={thinking ? { opacity: [0.4, 1, 0.4] } : {}}
          transition={{ repeat: Infinity, duration: 0.8 }}
        >
          [{statusLabel}]
        </motion.span>
        <span>MOVES: {String(moveCount).padStart(3, "0")}</span>
        <span>DEPTH: LVL-5</span>
      </div>

      {/* Right HUD - AI */}
      <div className="flex flex-col gap-1 items-end">
        <div className="flex items-center gap-1.5">
          <span>AI.CORE</span>
          <motion.div
            className={`w-1.5 h-1.5 rounded-full ${thinking ? "bg-neon-magenta" : "bg-neon-magenta/50"}`}
            animate={thinking ? { opacity: [1, 0.2, 1], scale: [1, 1.3, 1] } : { opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: thinking ? 0.4 : 2 }}
          />
        </div>
        <span className={aiPct > 60 ? "text-neon-magenta/70" : "text-muted-foreground/40"}>
          THREAT: {aiThreat}
        </span>
        <div className="flex items-center gap-1">
          <span>PWR:</span>
          <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden relative">
            <motion.div
              className={`h-full rounded-full ${aiBarColor}`}
              animate={{ width: `${aiPct}%` }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
            />
            {aiPct > 60 && (
              <motion.div
                className="absolute inset-0 rounded-full bg-neon-magenta/20"
                animate={{ opacity: [0, 0.4, 0] }}
                transition={{ repeat: Infinity, duration: 1 }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HUDOverlay;
