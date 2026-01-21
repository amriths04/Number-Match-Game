import {
  isNeighbor,
  isLineClear,
  isDiagonalLineClear,
  matchValidation,
} from "./Helper";

/* ---------------------------------
   COUNT RAW SEED MATCHES
--------------------------------- */
export const countSeedMatches = (board) => {
  let count = 0;
  const rows = board.length;
  const cols = board[0].length;
  const dirs = [[0, 1], [1, 0]];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const v = board[r][c];
      if (v == null) continue;

      for (const [dr, dc] of dirs) {
        const nr = r + dr;
        const nc = c + dc;
        if (
          nr < rows &&
          nc < cols &&
          board[nr][nc] != null &&
          matchValidation(v, board[nr][nc])
        ) {
          count++;
        }
      }
    }
  }
  return count;
};

/* ---------------------------------
   MAIN SEED METRICS
--------------------------------- */
export function computeSeedMetrics(board) {
  if (!board || board.length === 0) return null;

  const rows = board.length;
  const cols = board[0].length;
  const totalCells = rows * cols;

  let matchCapableCount = 0;
  let stragglerCount = 0;

  let totalChoices = 0;
  let maxChoicesForAnyCell = 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const v1 = board[r][c];
      if (v1 == null) continue;

      let choices = 0;
      let hasAnyMatch = false;

      for (let r2 = 0; r2 < rows; r2++) {
        for (let c2 = 0; c2 < cols; c2++) {
          if (r === r2 && c === c2) continue;

          const v2 = board[r2][c2];
          if (v2 == null) continue;

          const connected =
            isNeighbor(r, c, r2, c2) ||
            isLineClear(board, r, c, r2, c2) ||
            isDiagonalLineClear(board, r, c, r2, c2);

          if (!connected) continue;
          if (!matchValidation(v1, v2)) continue;

          choices++;
          hasAnyMatch = true;
        }
      }

      if (hasAnyMatch) matchCapableCount++;
      else stragglerCount++;

      totalChoices += choices;
      if (choices > maxChoicesForAnyCell) {
        maxChoicesForAnyCell = choices;
      }
    }
  }

  const seedMatches = countSeedMatches(board);

  const matchDensity =
    totalCells > 0 ? matchCapableCount / totalCells : 0;

  const seedMatchRatio =
    totalCells > 0 ? seedMatches / totalCells : 0;

  const avgChoicesPerCell =
    matchCapableCount > 0
      ? totalChoices / matchCapableCount
      : 0;

  const dominantChoiceRatio =
    avgChoicesPerCell > 0
      ? maxChoicesForAnyCell / avgChoicesPerCell
      : 0;

  return {
    /* size */
    totalCells,

    /* fairness */
    matchCapableCount,
    stragglers: stragglerCount,

    /* potential */
    matchDensity,

    /* generosity */
    seedMatches,
    seedMatchRatio,

    /* decision pressure */
    avgChoicesPerCell,
    maxChoicesForAnyCell,
    dominantChoiceRatio,

    /* qualitative flags */
    isGenerousSeed: seedMatchRatio > 0.12,
    isHarshSeed: seedMatchRatio < 0.05,
    isDominantChoiceBoard: dominantChoiceRatio > 1.6,
  };
}
