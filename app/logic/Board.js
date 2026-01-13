import { matchValidation } from "../Helper";

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
