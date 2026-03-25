export const ROWS = 6;
export const COLS = 7;
export const EMPTY = 0;
export const PLAYER_PIECE = 1;
export const AI_PIECE = 2;
const MAX_DEPTH = 5;

export type Board = number[][];
export type GameStatus = 'playing' | 'player_wins' | 'ai_wins' | 'draw';

export function createBoard(): Board {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(EMPTY));
}

export function isValidLocation(board: Board, col: number): boolean {
  return col >= 0 && col < COLS && board[0][col] === EMPTY;
}

export function getNextOpenRow(board: Board, col: number): number | null {
  for (let r = ROWS - 1; r >= 0; r--) {
    if (board[r][col] === EMPTY) return r;
  }
  return null;
}

export function dropPiece(board: Board, row: number, col: number, piece: number): Board {
  const newBoard = board.map(r => [...r]);
  newBoard[row][col] = piece;
  return newBoard;
}

export function winningMove(board: Board, piece: number): boolean {
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS - 3; c++)
      if (board[r][c] === piece && board[r][c+1] === piece && board[r][c+2] === piece && board[r][c+3] === piece) return true;
  for (let c = 0; c < COLS; c++)
    for (let r = 0; r < ROWS - 3; r++)
      if (board[r][c] === piece && board[r+1][c] === piece && board[r+2][c] === piece && board[r+3][c] === piece) return true;
  for (let r = 0; r < ROWS - 3; r++)
    for (let c = 0; c < COLS - 3; c++)
      if (board[r][c] === piece && board[r+1][c+1] === piece && board[r+2][c+2] === piece && board[r+3][c+3] === piece) return true;
  for (let r = 3; r < ROWS; r++)
    for (let c = 0; c < COLS - 3; c++)
      if (board[r][c] === piece && board[r-1][c+1] === piece && board[r-2][c+2] === piece && board[r-3][c+3] === piece) return true;
  return false;
}

function getValidLocations(board: Board): number[] {
  return Array.from({ length: COLS }, (_, i) => i).filter(c => isValidLocation(board, c));
}

function isBoardFull(board: Board): boolean {
  return board[0].every(cell => cell !== EMPTY);
}

function evaluateWindow(window: number[], piece: number): number {
  let score = 0;
  const opp = piece === AI_PIECE ? PLAYER_PIECE : AI_PIECE;
  const pieceCount = window.filter(v => v === piece).length;
  const emptyCount = window.filter(v => v === EMPTY).length;
  const oppCount = window.filter(v => v === opp).length;

  if (pieceCount === 4) score += 100;
  else if (pieceCount === 3 && emptyCount === 1) score += 5;
  else if (pieceCount === 2 && emptyCount === 2) score += 2;
  if (oppCount === 3 && emptyCount === 1) score -= 4;
  return score;
}

export function scorePosition(board: Board, piece: number): number {
  let score = 0;
  const center = Math.floor(COLS / 2);
  score += board.filter((_, r) => board[r][center] === piece).length * 3;

  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS - 3; c++)
      score += evaluateWindow([board[r][c], board[r][c+1], board[r][c+2], board[r][c+3]], piece);
  for (let c = 0; c < COLS; c++)
    for (let r = 0; r < ROWS - 3; r++)
      score += evaluateWindow([board[r][c], board[r+1][c], board[r+2][c], board[r+3][c]], piece);
  for (let r = 0; r < ROWS - 3; r++)
    for (let c = 0; c < COLS - 3; c++)
      score += evaluateWindow([0,1,2,3].map(i => board[r+i][c+i]), piece);
  for (let r = 3; r < ROWS; r++)
    for (let c = 0; c < COLS - 3; c++)
      score += evaluateWindow([0,1,2,3].map(i => board[r-i][c+i]), piece);
  return score;
}

function isTerminal(board: Board): boolean {
  return winningMove(board, PLAYER_PIECE) || winningMove(board, AI_PIECE) || isBoardFull(board);
}

function minimax(board: Board, depth: number, alpha: number, beta: number, maximizing: boolean): [number | null, number] {
  const valid = getValidLocations(board);
  const terminal = isTerminal(board);

  if (depth === 0 || terminal) {
    if (terminal) {
      if (winningMove(board, AI_PIECE)) return [null, 1000000];
      if (winningMove(board, PLAYER_PIECE)) return [null, -1000000];
      return [null, 0];
    }
    return [null, scorePosition(board, AI_PIECE)];
  }

  if (maximizing) {
    let value = -Infinity;
    let bestCol = valid[Math.floor(Math.random() * valid.length)];
    for (const col of valid) {
      const row = getNextOpenRow(board, col)!;
      const temp = dropPiece(board, row, col, AI_PIECE);
      const [, newScore] = minimax(temp, depth - 1, alpha, beta, false);
      if (newScore > value) { value = newScore; bestCol = col; }
      alpha = Math.max(alpha, value);
      if (alpha >= beta) break;
    }
    return [bestCol, value];
  } else {
    let value = Infinity;
    let bestCol = valid[Math.floor(Math.random() * valid.length)];
    for (const col of valid) {
      const row = getNextOpenRow(board, col)!;
      const temp = dropPiece(board, row, col, PLAYER_PIECE);
      const [, newScore] = minimax(temp, depth - 1, alpha, beta, true);
      if (newScore < value) { value = newScore; bestCol = col; }
      beta = Math.min(beta, value);
      if (alpha >= beta) break;
    }
    return [bestCol, value];
  }
}

export function getAIMove(board: Board): number {
  const [col] = minimax(board, MAX_DEPTH, -Infinity, Infinity, true);
  return col!;
}

export function getGameStatus(board: Board): GameStatus {
  if (winningMove(board, PLAYER_PIECE)) return 'player_wins';
  if (winningMove(board, AI_PIECE)) return 'ai_wins';
  if (isBoardFull(board)) return 'draw';
  return 'playing';
}

export function getWinningCells(board: Board, piece: number): [number, number][] {
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS - 3; c++)
      if (board[r][c] === piece && board[r][c+1] === piece && board[r][c+2] === piece && board[r][c+3] === piece)
        return [[r,c],[r,c+1],[r,c+2],[r,c+3]];
  for (let c = 0; c < COLS; c++)
    for (let r = 0; r < ROWS - 3; r++)
      if (board[r][c] === piece && board[r+1][c] === piece && board[r+2][c] === piece && board[r+3][c] === piece)
        return [[r,c],[r+1,c],[r+2,c],[r+3,c]];
  for (let r = 0; r < ROWS - 3; r++)
    for (let c = 0; c < COLS - 3; c++)
      if (board[r][c] === piece && board[r+1][c+1] === piece && board[r+2][c+2] === piece && board[r+3][c+3] === piece)
        return [[r,c],[r+1,c+1],[r+2,c+2],[r+3,c+3]];
  for (let r = 3; r < ROWS; r++)
    for (let c = 0; c < COLS - 3; c++)
      if (board[r][c] === piece && board[r-1][c+1] === piece && board[r-2][c+2] === piece && board[r-3][c+3] === piece)
        return [[r,c],[r-1,c+1],[r-2,c+2],[r-3,c+3]];
  return [];
}
