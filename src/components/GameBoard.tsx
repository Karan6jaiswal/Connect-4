import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  createBoard,
  isValidLocation,
  getNextOpenRow,
  dropPiece,
  getAIMove,
  getGameStatus,
  getWinningCells,
  ROWS,
  COLS,
  EMPTY,
  PLAYER_PIECE,
  AI_PIECE,
  type Board,
  type GameStatus,
} from "@/lib/gameLogic";
import RobotMascot from "./RobotMascot";
import HUDOverlay from "./HUDOverlay";

const GameBoard = () => {
  const [board, setBoard] = useState<Board>(createBoard);
  const [status, setStatus] = useState<GameStatus>("playing");
  const [turn, setTurn] = useState<"player" | "ai">("player");
  const [thinking, setThinking] = useState(false);
  const [hoverCol, setHoverCol] = useState<number | null>(null);
  const [winCells, setWinCells] = useState<[number, number][]>([]);
  const [moveCount, setMoveCount] = useState(0);

  const isWinCell = (r: number, c: number) =>
    winCells.some(([wr, wc]) => wr === r && wc === c);

  const handleDrop = useCallback(
    (col: number) => {
      if (status !== "playing" || turn !== "player" || thinking) return;
      if (!isValidLocation(board, col)) return;

      const row = getNextOpenRow(board, col);
      if (row === null) return;

      const newBoard = dropPiece(board, row, col, PLAYER_PIECE);
      setBoard(newBoard);
      setMoveCount((c) => c + 1);

      const newStatus = getGameStatus(newBoard);
      if (newStatus !== "playing") {
        setStatus(newStatus);
        if (newStatus === "player_wins")
          setWinCells(getWinningCells(newBoard, PLAYER_PIECE));
        return;
      }
      setTurn("ai");
    },
    [board, status, turn, thinking]
  );

  useEffect(() => {
    if (turn !== "ai" || status !== "playing") return;
    setThinking(true);
    const timer = setTimeout(() => {
      const col = getAIMove(board);
      const row = getNextOpenRow(board, col);
      if (row === null) return;
      const newBoard = dropPiece(board, row, col, AI_PIECE);
      setBoard(newBoard);
      setMoveCount((c) => c + 1);

      const newStatus = getGameStatus(newBoard);
      if (newStatus !== "playing") {
        setStatus(newStatus);
        if (newStatus === "ai_wins")
          setWinCells(getWinningCells(newBoard, AI_PIECE));
      } else {
        setTurn("player");
      }
      setThinking(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [turn, status, board]);

  const resetGame = () => {
    setBoard(createBoard());
    setStatus("playing");
    setTurn("player");
    setThinking(false);
    setHoverCol(null);
    setWinCells([]);
    setMoveCount(0);
  };

  const statusText = () => {
    if (status === "player_wins") return "◈ YOU WIN ◈";
    if (status === "ai_wins") return "◈ AI WINS ◈";
    if (status === "draw") return "◈ DRAW ◈";
    if (thinking) return "AI PROCESSING...";
    return "▸ YOUR TURN";
  };

  const statusColor = () => {
    if (status === "player_wins") return "text-neon-cyan text-glow-cyan";
    if (status === "ai_wins") return "text-neon-magenta text-glow-magenta";
    if (status === "draw") return "text-neon-yellow";
    if (thinking) return "text-neon-magenta text-glow-magenta animate-pulse";
    return "text-neon-cyan text-glow-cyan";
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* HUD */}
      <HUDOverlay moveCount={moveCount} status={status} board={board} thinking={thinking} />

      {/* Status with robot */}
      <div className="flex items-center gap-4">
        <RobotMascot thinking={thinking} />
        <motion.h2
          key={statusText()}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className={`font-display text-xl md:text-2xl font-bold tracking-widest ${statusColor()}`}
        >
          {statusText()}
        </motion.h2>
      </div>

      {/* Board */}
      <div className="relative p-3 md:p-4 rounded-2xl bg-card/50 border border-border backdrop-blur-sm box-glow-cyan">
        {/* Board frame glow */}
        <motion.div
          className="absolute -inset-px rounded-2xl pointer-events-none"
          style={{
            border: "1px solid transparent",
            background: "linear-gradient(135deg, hsl(var(--neon-cyan) / 0.2), transparent, hsl(var(--neon-magenta) / 0.2)) border-box",
            mask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
            WebkitMask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 3 }}
        />

        {/* Column hover indicators */}
        <div className="flex gap-1 md:gap-1.5 mb-2">
          {Array.from({ length: COLS }).map((_, c) => (
            <motion.div
              key={c}
              className="w-10 h-1.5 md:w-14 md:h-2 rounded-full"
              animate={{
                backgroundColor:
                  hoverCol === c && turn === "player" && status === "playing"
                    ? "hsl(190 100% 50% / 0.6)"
                    : "hsl(190 100% 50% / 0)",
                boxShadow:
                  hoverCol === c && turn === "player" && status === "playing"
                    ? "0 0 8px hsl(190 100% 50% / 0.4)"
                    : "none",
              }}
              transition={{ duration: 0.2 }}
            />
          ))}
        </div>

        {/* Grid */}
        <div className="flex flex-col gap-1 md:gap-1.5">
          {board.map((row, r) => (
            <div key={r} className="flex gap-1 md:gap-1.5">
              {row.map((cell, c) => (
                <motion.button
                  key={`${r}-${c}`}
                  onClick={() => handleDrop(c)}
                  onMouseEnter={() => setHoverCol(c)}
                  onMouseLeave={() => setHoverCol(null)}
                  className="w-10 h-10 md:w-14 md:h-14 rounded-full border-2 transition-colors duration-200 relative overflow-hidden"
                  style={{
                    borderColor:
                      cell === EMPTY
                        ? "hsl(200 60% 20%)"
                        : cell === PLAYER_PIECE
                        ? "hsl(190 100% 50%)"
                        : "hsl(310 100% 60%)",
                    backgroundColor:
                      cell === EMPTY
                        ? "hsl(220 20% 6%)"
                        : "transparent",
                    cursor:
                      turn === "player" && status === "playing" && cell === EMPTY
                        ? "pointer"
                        : "default",
                  }}
                  whileHover={
                    cell === EMPTY && turn === "player" && status === "playing"
                      ? { scale: 1.08, borderColor: "hsl(190 100% 50% / 0.6)" }
                      : {}
                  }
                  whileTap={
                    cell === EMPTY && turn === "player" && status === "playing"
                      ? { scale: 0.92 }
                      : {}
                  }
                >
                  <AnimatePresence>
                    {cell !== EMPTY && (
                      <motion.div
                        initial={{ y: -(r + 1) * 48, opacity: 0, scale: 0.5 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 18,
                        }}
                        className="absolute inset-1 rounded-full"
                        style={{
                          background:
                            cell === PLAYER_PIECE
                              ? "radial-gradient(circle at 35% 35%, hsl(190 100% 70%), hsl(190 100% 40%))"
                              : "radial-gradient(circle at 35% 35%, hsl(310 100% 75%), hsl(310 100% 45%))",
                          boxShadow: isWinCell(r, c)
                            ? cell === PLAYER_PIECE
                              ? "0 0 15px hsl(190 100% 50%), 0 0 30px hsl(190 100% 50% / 0.5)"
                              : "0 0 15px hsl(310 100% 60%), 0 0 30px hsl(310 100% 60% / 0.5)"
                            : cell === PLAYER_PIECE
                            ? "0 0 6px hsl(190 100% 50% / 0.3)"
                            : "0 0 6px hsl(310 100% 60% / 0.3)",
                        }}
                      />
                    )}
                  </AnimatePresence>

                  {/* Win pulse */}
                  {isWinCell(r, c) && (
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      animate={{ opacity: [0, 0.5, 0], scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      style={{
                        backgroundColor:
                          board[r][c] === PLAYER_PIECE
                            ? "hsl(190 100% 50%)"
                            : "hsl(310 100% 60%)",
                      }}
                    />
                  )}

                  {/* Empty cell subtle pulse on hover column */}
                  {cell === EMPTY && hoverCol === c && turn === "player" && status === "playing" && (
                    <motion.div
                      className="absolute inset-2 rounded-full border border-neon-cyan/20"
                      animate={{ opacity: [0.2, 0.5, 0.2] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Info bar */}
      <div className="flex items-center gap-6 font-body text-sm tracking-wider text-muted-foreground">
        <div className="flex items-center gap-2">
          <motion.span
            className="w-3 h-3 rounded-full bg-neon-cyan"
            animate={{ boxShadow: ["0 0 4px hsl(var(--neon-cyan) / 0.3)", "0 0 12px hsl(var(--neon-cyan) / 0.8)", "0 0 4px hsl(var(--neon-cyan) / 0.3)"] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
          <span>HUMAN</span>
        </div>
        <div className="flex items-center gap-1 text-border">
          {[...Array(3)].map((_, i) => (
            <motion.span
              key={i}
              className="w-0.5 h-3 bg-border/50"
              animate={{ scaleY: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <motion.span
            className="w-3 h-3 rounded-full bg-neon-magenta"
            animate={{ boxShadow: ["0 0 4px hsl(var(--neon-magenta) / 0.3)", "0 0 12px hsl(var(--neon-magenta) / 0.8)", "0 0 4px hsl(var(--neon-magenta) / 0.3)"] }}
            transition={{ repeat: Infinity, duration: 2, delay: 1 }}
          />
          <span>AI</span>
        </div>
      </div>

      {/* Controls */}
      <div className="h-14 mt-2 flex items-center justify-center">
        {status !== "playing" ? (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={resetGame}
            className="group relative px-8 py-3 font-display text-sm tracking-widest rounded-lg border border-neon-cyan bg-neon-cyan/10 text-neon-cyan hover:bg-neon-cyan/20 transition-all box-glow-cyan overflow-hidden"
          >
            <motion.span
              className="absolute inset-0 bg-neon-cyan/5"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            />
            <span className="relative">▸ PLAY AGAIN</span>
          </motion.button>
        ) : moveCount === 0 && !thinking ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-4">
            <button
              onClick={() => setTurn("player")}
              className="px-6 py-2 font-display text-xs tracking-widest rounded border border-neon-cyan bg-neon-cyan/10 text-neon-cyan hover:bg-neon-cyan/20 transition-all box-glow-cyan"
            >
              ▸ YOU START
            </button>
            <button
              onClick={() => setTurn("ai")}
              className="px-6 py-2 font-display text-xs tracking-widest rounded border border-neon-magenta bg-neon-magenta/10 text-neon-magenta hover:bg-neon-magenta/20 transition-all shadow-[0_0_15px_rgba(255,0,255,0.4)]"
            >
              ▸ AI STARTS
            </button>
          </motion.div>
        ) : (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={resetGame}
            className="px-6 py-2 font-display text-xs tracking-widest rounded border border-muted-foreground/20 text-muted-foreground hover:text-foreground hover:border-muted-foreground/50 hover:bg-muted-foreground/5 transition-all"
          >
            ▸ RESTART GAME
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default GameBoard;
