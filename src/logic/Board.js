import { matchValidation } from "./Helper";
import { LEVEL_CONFIG } from "./levels";
import { hasValidMove } from "./BoardValidator";

const ROWS = 3;
const COLS = 9;

const rand = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const generateInitialBoard = (level) => {
  const cfg = LEVEL_CONFIG[level] || LEVEL_CONFIG[1];
  const { ratios, targetMatchDensity, maxStragglers } = cfg;

  const board = Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => null)
  );

  const totalCells = ROWS * COLS;
  const matchCellsTarget = Math.floor(totalCells * targetMatchDensity);

  const easyCells   = Math.floor(matchCellsTarget * ratios.easy);
  const mediumCells = Math.floor(matchCellsTarget * ratios.medium);
  const hardCells   = Math.floor(matchCellsTarget * ratios.hard);

  let placedCells = 0;
  let safety = 0;

  // 2️⃣ EASY matches (adjacent)
  while (placedCells < easyCells && safety++ < 200) {
    const r = rand(0, ROWS - 1);
    const c = rand(0, COLS - 2);

    if (board[r][c] || board[r][c + 1]) continue;

    const n = rand(1, 9);
    board[r][c] = n;
    board[r][c + 1] = n;

    placedCells += 2;
  }

  // 3️⃣ MEDIUM matches (same number, spaced)
  safety = 0;
  while (placedCells < easyCells + mediumCells && safety++ < 200) {
    const c = rand(0, COLS - 1);

    if (!board[0][c] && !board[2][c]) {
      const n = rand(1, 9);
      board[0][c] = n;
      board[2][c] = n;
      placedCells += 2;
    }
  }

  // 4️⃣ HARD matches (few, delayed)
  safety = 0;
  while (placedCells < matchCellsTarget && safety++ < 200) {
    const r1 = rand(0, ROWS - 1);
    const c1 = rand(0, COLS - 1);
    const r2 = rand(0, ROWS - 1);
    const c2 = rand(0, COLS - 1);

    if (board[r1][c1] || board[r2][c2]) continue;
    if (Math.abs(r1 - r2) + Math.abs(c1 - c2) < 3) continue;

    const n = rand(1, 9);
    board[r1][c1] = n;
    board[r2][c2] = n;

    placedCells += 2;
  }

  // 5️⃣ Fill remaining cells (controlled noise)
  const existingNumbers = board.flat().filter(Boolean);

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board[r][c] == null) {
        board[r][c] =
          existingNumbers.length > 0
            ? existingNumbers[rand(0, existingNumbers.length - 1)]
            : rand(1, 9);
      }
    }
  }

  // 6️⃣ Final validation (hard rule)
  if (!hasValidMove(board)) {
    // reseed (rare, cheap)
    return generateInitialBoard(level);
  }

  return board;
};

export function countRemainingMatches(board) {
  if (!board || board.length === 0 || !board[0]) return 0;
  let matchCount = 0;
  board = clearEmptyRowsAndShiftUp(board);
  if (board.length === 0 || !board[0]) return 0;
  const rows = board.length;
  const cols = board[0].length;

  const directions = [
    [-1,-1],[-1,0],[-1,1],
    [0,-1],[0,1],
    [1,-1],[1,0],[1,1]
  ];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const current = board[r][c];
      if (current == null) continue;

      for (const [dr, dc] of directions) {
        const nr = r + dr;
        const nc = c + dc;

        if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;

        const neighbor = board[nr][nc];
        if (neighbor == null) continue;

        if (matchValidation(current, neighbor)) {
          matchCount++;
        }
      }
    }
  }
  return Math.floor(matchCount / 2);
}

export const clearEmptyRowsAndShiftUp = (board) => {
  if (!board || board.length === 0 || !board[0]) return [];

  const cols = board[0].length;
  const remainingRows = [];
  for (let r = 0; r < board.length; r++) {
    let isEmptyRow = true;

    for (let c = 0; c < cols; c++) {
      if (board[r][c] != null) {
        isEmptyRow = false;
        break;
      }
    }

    if (!isEmptyRow) remainingRows.push(board[r]);
  }
  return remainingRows;
};
