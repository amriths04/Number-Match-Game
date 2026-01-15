import { matchValidation } from "./Helper";
import { LEVEL_CONFIG } from "./levels";

const COLS = 9;
const ROWS = 3;
const rand = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const generateInitialBoard = (level) => {
  const cfg = LEVEL_CONFIG[level] || LEVEL_CONFIG[1];
  const { ratios } = cfg;

  const board = Array.from({ length: ROWS }, () =>
    Array(COLS).fill(null)
  );

  const guaranteedMatches =
    level <= 2 ? 4 :
    level <= 4 ? 3 :
    level <= 6 ? 3 :
    level <= 8 ? 2 : 1;

  let placed = 0;

  while (placed < guaranteedMatches) {
    const r = rand(0, ROWS - 1);
    const c = rand(0, COLS - 2);

    if (board[r][c] !== null || board[r][c + 1] !== null) continue;

    const roll = Math.random();

    if (roll < ratios.easy) {
      const n = rand(1, 9);
      board[r][c] = n;
      board[r][c + 1] = n;
    } else {
      const a = rand(1, 9);
      const b = 10 - a;
      if (b < 1 || b > 9) continue;
      board[r][c] = a;
      board[r][c + 1] = b;
    }

    placed++;
  }

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board[r][c] !== null) continue;
      board[r][c] = rand(1, 9);
    }
  }

  return board;
};

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
