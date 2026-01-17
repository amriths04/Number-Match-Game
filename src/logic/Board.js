import { LEVEL_CONFIG } from "./levels";
import { hasValidMove } from "./BoardValidator";
import { matchValidation } from "./Helper";

const ROWS = 3;
const COLS = 9;

const rand = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

export const generateInitialBoard = (level) => {
  const cfg = LEVEL_CONFIG[level] || LEVEL_CONFIG[1];
  const {
    tension,
    entropyBudget,
    matchSpacingBias,
  } = cfg;

  const board = Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => null)
  );

  /* -----------------------------
     1️⃣ PAIR BUDGET (CRITICAL)
     High tension → fewer pairs
  ----------------------------- */
  const basePairs = 6;
  const targetPairs = Math.max(
    2,
    basePairs - Math.floor(tension * 0.6)
  );

  let placedPairs = 0;
  let safety = 0;

  /* -----------------------------
     2️⃣ CONTROLLED MATCH PLACEMENT
  ----------------------------- */
  while (placedPairs < targetPairs && safety++ < 200) {
    const n = rand(1, 9);

    // EASY / LOW TENSION
    if (matchSpacingBias === "adjacent") {
      const r = rand(0, ROWS - 1);
      const c = rand(0, COLS - 2);
      if (board[r][c] || board[r][c + 1]) continue;
      board[r][c] = n;
      board[r][c + 1] = n;
    }

    // MEDIUM
    else if (matchSpacingBias === "row") {
      const c = rand(0, COLS - 1);
      if (board[0][c] || board[2][c]) continue;
      board[0][c] = n;
      board[2][c] = n;
    }

    // HARD / CHAOTIC
    else {
      const r1 = rand(0, ROWS - 1);
      const c1 = rand(0, COLS - 1);
      const r2 = rand(0, ROWS - 1);
      const c2 = rand(0, COLS - 1);

      if (board[r1][c1] || board[r2][c2]) continue;
      if (Math.abs(r1 - r2) + Math.abs(c1 - c2) < 4) continue;

      board[r1][c1] = n;
      board[r2][c2] = n;
    }

    placedPairs++;
  }

  /* -----------------------------
     3️⃣ ENTROPY-BASED NOISE FILL
     Prevent accidental matches
  ----------------------------- */
  const usedNumbers = new Set(board.flat().filter(Boolean));
  const noisePool = [1,2,3,4,5,6,7,8,9];

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board[r][c] != null) continue;

      let attempts = 0;
      let val;

      do {
        val = pick(noisePool);
        attempts++;
      } while (
        attempts < 10 &&
        wouldCreateEasyMatch(board, r, c, val) &&
        Math.random() < entropyBudget
      );

      board[r][c] = val;
    }
  }

  /* -----------------------------
     4️⃣ HARD SOLVABILITY RULE
  ----------------------------- */
  if (!hasValidMove(board)) {
    return generateInitialBoard(level);
  }

  return board;
};

/* --------------------------------
   Helper: avoid accidental freebies
-------------------------------- */
function wouldCreateEasyMatch(board, r, c, val) {
  const dirs = [
    [0,1],[1,0],[0,-1],[-1,0]
  ];

  for (const [dr,dc] of dirs) {
    const nr = r + dr;
    const nc = c + dc;
    if (
      nr >= 0 && nr < board.length &&
      nc >= 0 && nc < board[0].length &&
      board[nr][nc] != null &&
      matchValidation(val, board[nr][nc])
    ) {
      return true;
    }
  }
  return false;
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
