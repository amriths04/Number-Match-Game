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
    level <= 2 ? 2 :
    level <= 4 ? 3 :
    level <= 6 ? 3 :
    level <= 8 ? 3 : 4;

  const mercy = addRowUsed / MAX_ADD_ROWS;
  if (mercy > 0.6) base--;
  if (mercy > 0.85) base--;

  return Math.max(1, base);
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
  const crowdChance = levelCfg.addRow.decoyDensity || 0;

  if (crowdChance > 0) {
    for (const row of rowsToAdd) {
      let c = 0;
      while (c < cols - 1) {
        if (row[c] !== null) {
          c++;
          continue;
        }

        if (Math.random() > crowdChance) {
          c++;
          continue;
        }

        const base = Math.floor(Math.random() * 9) + 1;
        row[c] = base;
        row[c + 1] = 10 - base; // guaranteed match
        c += 2;
      }
    }
  }
  return rowsToAdd;
};
