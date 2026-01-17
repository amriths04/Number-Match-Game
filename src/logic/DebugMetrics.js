import {
  isNeighbor,
  isLineClear,
  isDiagonalLineClear,
  matchValidation,
} from "./Helper";

export function computeSeedMetrics(board) {
  const rows = board.length;
  const cols = board[0]?.length || 0;
  const totalCells = rows * cols;

  let matchCapableCount = 0;
  let stragglerCount = 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const v1 = board[r][c];
      if (!v1) continue;

      let hasAnyMatch = false;

      for (let r2 = 0; r2 < rows && !hasAnyMatch; r2++) {
        for (let c2 = 0; c2 < cols; c2++) {
          if (r === r2 && c === c2) continue;

          const v2 = board[r2][c2];
          if (!v2) continue;

          const connected =
            isNeighbor(r, c, r2, c2) ||
            isLineClear(board, r, c, r2, c2) ||
            isDiagonalLineClear(board, r, c, r2, c2);

          if (!connected) continue;

          if (matchValidation(v1, v2)) {
            hasAnyMatch = true;
            break;
          }
        }
      }

      if (hasAnyMatch) {
        matchCapableCount++;
      } else {
        stragglerCount++;
      }
    }
  }

  const matchDensity =
    totalCells > 0 ? matchCapableCount / totalCells : 0;

  return {
    totalCells,              
    matchCapableCount,      
    stragglers: stragglerCount,
    matchDensity,           
  };
}
