import { countRemainingMatches } from "./Board";
import { isNeighbor, isLineClear, isDiagonalLineClear,matchValidation } from "./Helper";

export const analyzeBoardState = (board) => {
  if (!board || board.length === 0) {
    return {
      remainingMatches: 0,
      possiblePairs: 0,
      matchDensity: 0,
      frequencyMap: {},
      lonelyNumbers: [],
      choiceMap: {}
    };
  }

  const remainingMatches = countRemainingMatches(board);
  const possiblePairs = countPossiblePairs(board);

  const frequencyMap = {};
  const lonelyNumbers = new Set();
  const choiceMap = {};

  const rows = board.length;
  const cols = board[0].length;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
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

  for (let r1 = 0; r1 < rows; r1++) {
    for (let c1 = 0; c1 < cols; c1++) {
      const v1 = board[r1][c1];
      if (v1 === null) continue;

      let choices = 0;

      for (let r2 = 0; r2 < rows; r2++) {
        for (let c2 = 0; c2 < cols; c2++) {
          if (r1 === r2 && c1 === c2) continue;
          const v2 = board[r2][c2];
          if (v2 === null) continue;

          const canConnect =
            isNeighbor(r1, c1, r2, c2) ||
            isLineClear(board, r1, c1, r2, c2) ||
            isDiagonalLineClear(board, r1, c1, r2, c2);

          if (canConnect && matchValidation(v1, v2)) {
            choices++;
          }
        }
      }

      choiceMap[v1] = (choiceMap[v1] || 0) + choices;
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
    choiceMap
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
