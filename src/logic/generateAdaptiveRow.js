import { LEVEL_CONFIG } from "./levels";
import { analyzeBoardState, findStragglerCells } from "./AnalyzeBoard";

const countStragglers = (board) =>
  findStragglerCells(board).length;

/* ---------------------------------
   CONNECTIVITY CHECK (NEW SPACE ONLY)
--------------------------------- */
const getFixModes = (level) => {
  if (level <= 2) return ["DIAGONAL", "VERTICAL"];
  if (level <= 4) return ["DIAGONAL", "H_NEAR", "VERTICAL"];
  if (level <= 6) return ["DIAGONAL", "H_NEAR"];
  return ["DIAGONAL", "H_NEAR", "WRAP"];
};

const canConnectViaAddRow = (sr, sc, newRow, c, cols) => {
  if (c === sc) return true;
  const start = sr * cols + sc;
  const end = newRow * cols + c;
  return end > start;
};

/* ---------------------------------
   ROWS PER ADD
--------------------------------- */
const getRowsPerAdd = (level, addRowUsed, MAX_ADD_ROWS) => {
  let base =
  level <= 1 ? 4 :
    level <= 3 ? 2 :
    level <= 5 ? 3 :
    level <= 7 ? 5 :
    level <= 9 ? 6 :
    level <= 11 ? 7 :
    8;

  const decayRatio = addRowUsed / MAX_ADD_ROWS;
  const decayFactor = 0.5;

  const rows = Math.ceil(base * (1 - decayRatio * decayFactor));
  return Math.max(1, rows);
};


/* ---------------------------------
   MERCY SCALING
--------------------------------- */
const getEffectiveHelp = (levelCfg, addRowUsed, MAX_ADD_ROWS) => {
  const base = levelCfg.addRow.stragglerHelp;
  const mercy = addRowUsed / MAX_ADD_ROWS;
  return Math.min(1, base + mercy * 0.6);
};

/* ---------------------------------
   STRAGGLER FIX COUNT
--------------------------------- */
const getRepairCount = (levelCfg, total, addRowUsed, MAX_ADD_ROWS) => {
  if (!total) return 0;
  const help = getEffectiveHelp(levelCfg, addRowUsed, MAX_ADD_ROWS);
  if (help >= 0.95) return total;
  return Math.max(1, Math.ceil(total * help));
};

/* ---------------------------------
   TRUE DIAGONAL FIX (SAME COLUMN)
--------------------------------- */
const placeDiagonalFixSameColumn = (row, s, rowFix, cols, isLast) => {
  const d = rowFix - s.row;
  if (d <= 0) return false;

  const complement = 10 - s.val;
  if (complement < 1 || complement > 9) return false;

  // last straggler → vertical allowed
  if (isLast && row[s.col] === null) {
    row[s.col] = complement;
    return true;
  }

  // left diagonal
  const left = s.col - d;
  if (left >= 0 && row[left] === null) {
    row[left] = complement;
    return true;
  }

  // right diagonal
  const right = s.col + d;
  if (right < cols && row[right] === null) {
    row[right] = complement;
    return true;
  }

  return false;
};

const getRealMatchDensity = (level) => {
  if (level <= 2) return 0.8;
  if (level <= 4) return 0.65;
  if (level <= 6) return 0.5;
  if (level <= 8) return 0.35;
  return 0.25; // level 9+
};
const getRowFillTarget = (level) => {
  if (level <= 1) return 0.30;
  if (level === 2) return 0.35;
  if (level === 3) return 0.40;
  if (level === 4) return 0.45;
  if (level === 5) return 0.50;
  if (level === 6) return 0.55;
  if (level === 7) return 0.60;
  if (level === 8) return 0.65;
  return 0.70; // 9+
};


const getCrowdDensity = (level) => {
  if (level <= 2) return 0.02;
  if (level <= 4) return 0.08;
  if (level <= 6) return 0.15;
  if (level <= 8) return 0.25;
  return 0.45;
};

/* ---------------------------------
   MAIN GENERATOR
--------------------------------- */
export const generateAdaptiveRow = (
  board,
  level,
  addRowUsed,
  MAX_ADD_ROWS
) => {
  if (addRowUsed >= MAX_ADD_ROWS) return [];

  const levelCfg = LEVEL_CONFIG[level] || LEVEL_CONFIG[1];
  const cols = board[0].length;

  const state = analyzeBoardState(board);
  const stragglers = findStragglerCells(board);
  if (!stragglers.length) return [];
/* ---------------------------------
   🔒 LEVEL 1: TERMINAL CONVERGENCE
--------------------------------- */
if (level === 1) {
  const cols = board[0].length;
  const newRow = Array(cols).fill(null);

  for (const s of stragglers) {
    const complement = 10 - s.val;
    if (complement < 1 || complement > 9) continue;

    if (newRow[s.col] === null) {
      newRow[s.col] = complement;
    } else {
      for (let dc = 1; dc < cols; dc++) {
        if (s.col - dc >= 0 && newRow[s.col - dc] === null) {
          newRow[s.col - dc] = complement;
          break;
        }
        if (s.col + dc < cols && newRow[s.col + dc] === null) {
          newRow[s.col + dc] = complement;
          break;
        }
      }
    }
  }

  return [newRow];
}

  /* ---------------------------------
   🟢 TERMINAL STRAGGLER RESOLUTION
--------------------------------- */
if (stragglers.length <= 2) {
  const cols = board[0].length;
  const newRow = Array(cols).fill(null);

  for (const s of stragglers) {
    const complement = 10 - s.val;
    if (complement < 1 || complement > 9) continue;

    // Prefer same column
    if (newRow[s.col] === null) {
      newRow[s.col] = complement;
    } else {
      // fallback: nearest empty
      for (let dc = 1; dc < cols; dc++) {
        if (s.col - dc >= 0 && newRow[s.col - dc] === null) {
          newRow[s.col - dc] = complement;
          break;
        }
        if (s.col + dc < cols && newRow[s.col + dc] === null) {
          newRow[s.col + dc] = complement;
          break;
        }
      }
    }
  }

  return [newRow]; // 🔒 deterministic exit
}


  /* ---------------------------------
     STRAGGLERS BY COLUMN
  --------------------------------- */
  const stragglersByCol = {};
  for (const s of stragglers) {
    stragglersByCol[s.col] = (stragglersByCol[s.col] || 0) + 1;
  }

  const rowsLimit = getRowsPerAdd(level, addRowUsed, MAX_ADD_ROWS);
  const rowsToAdd = [];

  /* ---------------------------------
     🔴 SAME-COLUMN DIAGONAL RULE
     (your rule, clean + isolated)
  --------------------------------- */
  for (const col in stragglersByCol) {
    if (stragglersByCol[col] <= 1) continue;

    const sameCol = stragglers
      .filter(s => s.col === Number(col))
      .sort((a, b) => a.row - b.row);

    const last = sameCol[sameCol.length - 1];
    const rowFix = last.row + 1;

    const newRow = Array(cols).fill(null);

    for (let i = 0; i < sameCol.length; i++) {
      const s = sameCol[i];
      const isLast = i === sameCol.length - 1;

      placeDiagonalFixSameColumn(
        newRow,
        s,
        rowFix,
        cols,
        isLast
      );
    }

   rowsToAdd.push(newRow);
break; // exit diagonal rule, NOT the function
// ✅ stop here, deterministic
  }

  /* ---------------------------------
     NORMAL FLOW (UNCHANGED)
  --------------------------------- */
  let repairCount = getRepairCount(
    levelCfg,
    stragglers.length,
    addRowUsed,
    MAX_ADD_ROWS
  );

  
  let fixed = 0;
  let nextRowIndex = board.length;
  const fixModes = getFixModes(level);

    for (const s of stragglers) {
    if (fixed >= repairCount) break;
    if (rowsToAdd.length >= rowsLimit) break;

    const complement = 10 - s.val;
    if (complement < 1 || complement > 9) continue;

    let placed = false;

    for (let r = 0; r < rowsToAdd.length && !placed; r++) {
      const row = rowsToAdd[r];

      if (
        fixModes.includes("VERTICAL") &&
        stragglersByCol[s.col] <= 1 &&
        row[s.col] === null
      ) {
        row[s.col] = complement;
        placed = true;
      }

      if (!placed && fixModes.includes("H_NEAR")) {
        for (const dc of [-1, 1, -2, 2]) {
          const nc = s.col + dc;
          if (nc >= 0 && nc < cols && row[nc] === null) {
            row[nc] = complement;
            placed = true;
            break;
          }
        }
      }

      if (placed) fixed++;
    }

    if (!placed && rowsToAdd.length < rowsLimit) {
      const newRow = Array(cols).fill(null);

      if (stragglersByCol[s.col] <= 1) {
        newRow[s.col] = complement;
        rowsToAdd.push(newRow);
        fixed++;
      }
    }
  }

  /* ---------------------------------
     🟣 CROWD INJECTION (CORRECT PLACE)
  --------------------------------- */
  const realMatchChance = getConvergingMatchDensity(
  level,
  addRowUsed,
  MAX_ADD_ROWS
);

const crowdChance = Math.min(
  0.6,
  getCrowdDensity(level) + 0.1
);


for (const row of rowsToAdd) {
  let c = 0;
  let filled = row.filter(v => v !== null).length;
  const maxFill = Math.floor(cols * getRowFillTarget(level));
  while (c < cols - 1) {
    if (row[c] !== null) {
      c++;
      continue;
    }

    const roll = Math.random();

    // Helpful real match (rarer at higher levels)
    if (
  roll < realMatchChance &&
  filled + 2 <= maxFill
) {
  const base = Math.floor(Math.random() * 9) + 1;
  row[c] = base;
  row[c + 1] = 10 - base;
  filled += 2;
  c += 2;
  continue;
}


    // Crowd / decoy
    if (
  roll < realMatchChance + crowdChance &&
  filled + 1 <= maxFill
) {
  row[c] = Math.floor(Math.random() * 9) + 1;
  filled += 1;
  c++;
  continue;
}


    // Leave empty
    c++;
  }
}

  return rowsToAdd;
};

/* ---------------------------------
   ADD-ROW MATCH DENSITY (NEW)
--------------------------------- */
const getBaseAddRowMatchDensity = (level) => {
  if (level <= 3) return 0.38;
  if (level <= 5) return 0.28;
  if (level <= 7) return 0.25;
  if (level <= 9) return 0.28;
  if (level <= 11) return 0.32;
  return 0.35;
};

const getConvergingMatchDensity = (
  level,
  addRowUsed,
  MAX_ADD_ROWS
) => {
  const base = getBaseAddRowMatchDensity(level);

  // convergence toward solvability
  const convergeBoost =
    (addRowUsed / MAX_ADD_ROWS) * 0.18;

  return Math.min(0.6, base + convergeBoost);
};

