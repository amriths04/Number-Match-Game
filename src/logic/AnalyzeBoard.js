import { countRemainingMatches } from "./Board";
import { isNeighbor, isLineClear, isDiagonalLineClear } from "./Helper";

export const analyzeBoardState = (board) => {
  if (!board || board.length === 0) {
    return {
      remainingMatches: 0,
      possiblePairs: 0,
      matchDensity: 0,
      frequencyMap: {},
      lonelyNumbers: [],
    };
  }

  const remainingMatches = countRemainingMatches(board);
  const possiblePairs = countPossiblePairs(board);

  const frequencyMap = {};
  const lonelyNumbers = new Set();

  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[0].length; c++) {
      const val = board[r][c];
      if (val !== null) {
        frequencyMap[val] = (frequencyMap[val] || 0) + 1;
        lonelyNumbers.add(val);
      }
    }
  }

  for (const num in frequencyMap) {
    if (frequencyMap[num] > 1) {
      lonelyNumbers.delete(Number(num));
    }
  }

  const matchDensity =
    possiblePairs === 0 ? 0 : remainingMatches / possiblePairs;

  return {
    remainingMatches,
    possiblePairs,
    matchDensity,
    frequencyMap,
    lonelyNumbers: Array.from(lonelyNumbers),
  };
};

export const countPossiblePairs = (board) => {
  if (!board || board.length === 0) return 0;

  const rows = board.length;
  const cols = board[0].length;

  let possiblePairs = 0;

  for (let r1 = 0; r1 < rows; r1++) {
    for (let c1 = 0; c1 < cols; c1++) {
      if (board[r1][c1] === null) continue;

      for (let r2 = r1; r2 < rows; r2++) {
        for (let c2 = 0; c2 < cols; c2++) {
          if (r1 === r2 && c2 <= c1) continue;
          if (board[r2][c2] === null) continue;

          const canConnect =
            isNeighbor(r1, c1, r2, c2) ||
            isLineClear(board, r1, c1, r2, c2) ||
            isDiagonalLineClear(board, r1, c1, r2, c2);

          if (canConnect) {
            possiblePairs++;
          }
        }
      }
    }
  }

  return possiblePairs;
};
