import { LEVEL_CONFIG } from "./levels";
import { hasValidMove } from "./BoardValidator";
import { matchValidation } from "./Helper";

const COLS = 9;

const rand = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

export const generateInitialBoard = (level, attempt = 0) => {
  const MAX_ATTEMPTS = 15;
const SEED_MATCH_BUDGET =
  level <= 1 ? 20 :
  level <= 2 ? 10 :
  level <= 3 ? 9  :
  level <= 4 ? 8  :
  level <= 5 ? 6  :
  level <= 6 ? 6  :
  level <= 7 ? 5  :
  level <= 8 ? 4  :
  level <= 9 ? 3  :
  2;

  const MATCH_DIRECTIONS_BY_LEVEL = (level) => {
  if (level <= 3) return ["H"]; // training
  if (level <= 4) return ["H", "D"]; // diagonal appears
  if (level <= 6) return ["H", "D", "V"]; // vertical
  if (level <= 8) return ["H", "D", "V", "WRAP_NEAR"];
  return ["H", "D", "V", "WRAP_NEAR", "WRAP_FAR"];
};

  const cfg = LEVEL_CONFIG[level] || LEVEL_CONFIG[1];
  const {
    orderRobustness,
    dominantChoiceRatio,
    decoyDensity,
    initialMatchDensity = 0.4,
  } = cfg;
const TARGET_DENSITY =
  level <= 1 ? 2.6 :
  level <= 2 ? 1.5 :
  level <= 3 ? 1.3 :
  level <= 4 ? 1.2 :
  level <= 5 ? 0.8 :
  level <= 6 ? 0.65 :
  level <= 7 ? 0.5 :
  level <= 8 ? 0.35 :
  level <= 9 ? 0.25 :
  0.18;


  /* --------------------------------
     🔧 SAFETY GUARD
  -------------------------------- */
  if (attempt > MAX_ATTEMPTS) {
    console.warn("⚠️ Board fallback at level", level);
  }

  /* --------------------------------
     🔥 ROW COUNT
  -------------------------------- */
  const ROWS =
    level <= 2 ? 3 :
    level <= 4 ? 4 :
    level <= 6 ? 5 :
    level <= 8 ? 6 :
    level <= 10 ? 7 :
    level <= 12 ? 8 :
    9;

  const board = Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => null)
  );

  /* --------------------------------
     1️⃣ PAIR TARGET (LEVEL-SCALED)
  -------------------------------- */
  const filledCellsTarget = ROWS * COLS * 0.9;
const MAX_MATCHES = Math.floor(
  TARGET_DENSITY * (ROWS * COLS * 0.9) / 2
);
  // ❗ Relax ONLY at low levels
  const densityRelax =
    level <= 4 && attempt > 5 ? 1.15 :
    level <= 4 && attempt > 10 ? 1.3 :
    1;

  const effectiveDensity = initialMatchDensity * densityRelax;

  const rawTargetPairs = Math.floor(
  (filledCellsTarget * effectiveDensity) / 2
);



  // 🔒 HARD PAIR CAP (CRITICAL)
  const finalTargetPairs =
    level <= 2 ? Math.max(3, rawTargetPairs) :
    level <= 4 ? Math.min(rawTargetPairs, 10) :
    level <= 6 ? Math.min(rawTargetPairs, 8) :
    level <= 8 ? Math.min(rawTargetPairs, 6) :
    Math.min(rawTargetPairs, 4);

  /* --------------------------------
     2️⃣ ROBUST PAIRS
  -------------------------------- */
  const rawRobustPairs = Math.floor(
  finalTargetPairs * orderRobustness
);

  let robustPairs =
  level <= 2 ? rawRobustPairs :
  level === 3 ? Math.min(rawRobustPairs, 3) :
  level === 4 ? Math.min(rawRobustPairs, 2) :
  level <= 6 ? Math.min(rawRobustPairs, 2) :
  1;

// 🔒 HARD SEED MATCH CAP (THIS IS THE KEY)
robustPairs = Math.min(robustPairs, SEED_MATCH_BUDGET);


  let placedPairs = 0;
  let safety = 0;

  while (placedPairs < robustPairs && safety++ < 400) {
    const n = rand(1, 9);
const r = rand(0, ROWS - 1);
const minGap = level >= 4 ? 2 : 1;
const c = rand(0, COLS - (minGap + 1));

if (board[r][c] || board[r][c + minGap]) continue;

const useSum10 = Math.random() < 0.75;
board[r][c] = n;
board[r][c + minGap] = useSum10 ? 10 - n : n;

placedPairs++;

  }

  /* --------------------------------
     3️⃣ FRAGILE PAIRS
  -------------------------------- */
  const remainingSeedBudget =
  Math.max(0, SEED_MATCH_BUDGET - robustPairs);

const fragilePairs =
  Math.min(
    Math.max(0, finalTargetPairs - robustPairs),
    remainingSeedBudget
  );

  let fragilePlaced = 0;

  while (fragilePlaced < fragilePairs && safety++ < 600) {
    const n = rand(1, 9);
    const r1 = rand(0, ROWS - 1);
    const c1 = rand(0, COLS - 1);

    if (board[r1][c1]) continue;
    const dirs = MATCH_DIRECTIONS_BY_LEVEL(level);
const dir = pick(dirs);

let r2 = r1, c2 = c1;

if (dir === "D") {
  r2 = r1 + (Math.random() < 0.5 ? 1 : -1);
  c2 = c1 + (Math.random() < 0.5 ? 1 : -1);
}
else if (dir === "V") {
  r2 = r1 + (Math.random() < 0.5 ? 2 : -2);
}
else if (dir === "WRAP_NEAR") {
  c2 = (c1 + COLS - 2) % COLS;
}
else if (dir === "WRAP_FAR") {
  c2 = (c1 + Math.floor(COLS / 2)) % COLS;
}
else {
  const gap = level >= 6 ? 3 : 2;
  c2 = c1 + gap;
}


if (
  r2 < 0 || r2 >= ROWS ||
  c2 < 0 || c2 >= COLS ||
  board[r2][c2]
) continue;


    board[r1][c1] = n;
    board[r2][c2] = n;
    fragilePlaced++;
  }
console.log(
  "SEED:",
  "robust =", robustPairs,
  "fragile =", fragilePairs,
  "total =", robustPairs + fragilePairs,
  "budget =", SEED_MATCH_BUDGET
);

  /* --------------------------------
     4️⃣ NOISE (ANTI-MATCH AT HIGH LEVELS)
  -------------------------------- */
  const noisePool = [1,2,3,4,5,6,7,8,9];

  const forceAntiMatch = level >= 8;

  for (let r = 0; r < ROWS; r++) {
  for (let c = 0; c < COLS; c++) {
    if (board[r][c] != null) continue;

    let val;
    let attempts = 0;

    const blockMatch =
      forceAntiMatch ||
      level >= 4 ||
      Math.random() < decoyDensity;

    do {
      val = pick(noisePool);
      attempts++;
    } while (
      attempts < 20 &&
      blockMatch &&
      wouldCreateImmediateMatch(board, r, c, val, level)
    );

    board[r][c] = val;
  }
}

if (countRemainingMatches(board) > SEED_MATCH_BUDGET * 1.5) {
  pruneExcessMatches(board, TARGET_DENSITY);
}


  /* --------------------------------
     5️⃣ SOLVABILITY (LIMITED RETRY)
  -------------------------------- */
  if (!hasValidMove(board) && attempt < MAX_ATTEMPTS) {
    return generateInitialBoard(level, attempt + 1);
  }

  /* --------------------------------
     6️⃣ FINAL METRIC (LOG ONLY)
  -------------------------------- */
  const finalDensity =
    countRemainingMatches(board) /
    Math.max(1, filledCellsTarget / 2);

  console.log(
    `Level ${level} | Initial Match Density: ${finalDensity.toFixed(2)}`
  );

  return board;
};

/* --------------------------------
   Helper: avoid free dominant matches
-------------------------------- */
function wouldCreateImmediateMatch(board, r, c, val, level) {
  const dirs = level >= 4
  ? [[0,1],[1,0],[0,-1],[-1,0],[-1,-1],[-1,1],[1,-1],[1,1]]
  : [[0,1],[1,0],[0,-1],[-1,0]];


  for (const [dr, dc] of dirs) {
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

const pruneExcessMatches = (board, targetDensity, maxPasses = 25) => {
  let passes = 0;

  while (passes++ < maxPasses) {
    const filled = board.flat().filter(v => v != null).length;
    const density =
      countRemainingMatches(board) / Math.max(1, filled / 2);

    if (density <= targetDensity) return;

    let broken = false;

    for (let r = 0; r < board.length && !broken; r++) {
      for (let c = 0; c < board[0].length && !broken; c++) {
        const v = board[r][c];
        if (v == null) continue;

        const dirs = [[0,1],[1,0],[0,-1],[-1,0],[-1,-1],[-1,1],[1,-1],[1,1]];

        for (const [dr, dc] of dirs) {
          const nr = r + dr;
          const nc = c + dc;

          if (
            nr >= 0 && nr < board.length &&
            nc >= 0 && nc < board[0].length &&
            board[nr][nc] != null &&
            matchValidation(v, board[nr][nc])
          ) {
            let tries = 0;
            let newVal;

            do {
              newVal = rand(1, 9);
              tries++;
            } while (
              tries < 15 &&
              matchValidation(v, newVal)
            );

            board[nr][nc] = newVal;
            broken = true;
            break;
          }
        }
      }
    }

    if (!broken) return; // nothing left to break
  }
};

