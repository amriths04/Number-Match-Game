import { matchValidation } from "./Helper";
import { LEVEL_CONFIG } from "./levels.js";
import { analyzeBoardState } from "./AnalyzeBoard.js";
export function countRemainingMatches(board) {
  let matchCount = 0;
  board = clearEmptyRowsAndShiftUp(board);
  const rows = board.length;
  const cols = board[0].length;

  const directions = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const current = board[r][c];
      if (current === null) continue;

      for (let d = 0; d < directions.length; d++) {
        const newRow = r + directions[d][0];
        const newCol = c + directions[d][1];

        if (newRow < 0 || newRow >= rows || newCol < 0 || newCol >= cols) {
          continue;
        }

        const neighbor = board[newRow][newCol];
        if (neighbor === null) continue;

        if (matchValidation(current, neighbor)) {
          matchCount++;
        }
      }
    }
  }
  return Math.floor(matchCount / 2);
}

export const clearEmptyRowsAndShiftUp = (board) => {
  const cols = board[0]?.length || 0;
  const remainingRows = [];
  for (let r = 0; r < board.length; r++) {
    let isEmptyRow = true;

    for (let c = 0; c < cols; c++) {
      if (board[r][c] !== null) {
        isEmptyRow = false;
        break;
      }
    }

    if (!isEmptyRow) {
      remainingRows.push(board[r]);
    }
  }
  return remainingRows;
};

export const generateAdaptiveRow = (board, level) => {
  const levelConfig = LEVEL_CONFIG[level] || LEVEL_CONFIG[1];
  const {
    targetMatchDensity,
    ratios,
    rescueThreshold
  } = levelConfig;

  const {
    matchDensity,
    remainingMatches,
    frequencyMap,
    lonelyNumbers
  } = analyzeBoardState(board);

  const cols = board[0].length;

  let intent = "neutral";

  if (remainingMatches <= rescueThreshold) {
    intent = "help";
  } else {
    const delta = targetMatchDensity - matchDensity;

    if (delta > 0.08) intent = "help";
    else if (delta < -0.08) intent = "disrupt";
  }

  const pool = [];

  const addToPool = (num, weight) => {
    for (let i = 0; i < weight; i++) pool.push(num);
  };

  Object.keys(frequencyMap).forEach(num => {
    const count = frequencyMap[num];

    if (intent === "help") {
      addToPool(Number(num), Math.max(1, 5 - count));
    } else if (intent === "disrupt") {
      addToPool(Number(num), count === 1 ? 6 : 1);
    } else {
      addToPool(Number(num), 2);
    }
  });

  if (pool.length === 0) {
    Object.keys(frequencyMap).forEach(num => {
      addToPool(Number(num), 1);
    });
  }
  const newRow = [];

  for (let i = 0; i < cols; i++) {
    const pick = pool[Math.floor(Math.random() * pool.length)];
    newRow.push(pick);
  }

  return newRow;
};