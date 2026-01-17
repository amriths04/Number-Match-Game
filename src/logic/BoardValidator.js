export const isNeighbor = (a, b, c, d) => {
  if (a == c && b == d) return false;
  const rowDiff = Math.abs(a - c);
  const colDiff = Math.abs(b - d);
  if (rowDiff <= 1 && colDiff <= 1) {
    return true;
  }
  const totalCols = 9;
  if (b===totalCols-1 && d === 0 && c === a+1) {
    return true;
  }
  if (d===totalCols-1 && b === 0 && a === c+1) {
    return true;
  }
  return false;
};

export const isLineClear = (board, r1, c1, r2, c2) => {
  if (r1 !== r2 && c1 !== c2) return false;
  if (r1 === r2) {
    const start = Math.min(c1, c2) + 1;
    const end = Math.max(c1, c2);

    for (let c = start; c < end; c++) {
      if (board[r1][c] !== null) return false;
    }
    return true;
  }
  if (c1 === c2) {
    const start = Math.min(r1, r2) + 1;
    const end = Math.max(r1, r2);

    for (let r = start; r < end; r++) {
      if (board[r][c1] !== null) return false;
    }
    return true;
  }

  return false;
};

export const isDiagonalLineClear = (board, r1, c1, r2, c2) => {
  const rowDiff = r2 - r1;
  const colDiff = c2 - c1;
  if (Math.abs(rowDiff) !== Math.abs(colDiff)) return false;

  const rowStep = rowDiff > 0 ? 1 : -1;
  const colStep = colDiff > 0 ? 1 : -1;

  let r = r1 + rowStep;
  let c = c1 + colStep;

  while (r !== r2 && c !== c2) {
    if (board[r][c] !== null) return false;
    r += rowStep;
    c += colStep;
  }
  return true;
};
export const matchValidation = (a,b)=>{
    if(a+b===10){
        return true;
    }
    else if(a==b)
    {
        return true;
    }
    return false;
}

export function hasValidMove(board) {
  const rows = board.length;
  const cols = board[0]?.length || 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const val1 = board[r][c];
      if (!val1) continue;

      for (let nr = 0; nr < rows; nr++) {
        for (let nc = 0; nc < cols; nc++) {
          if (r === nr && c === nc) continue;

          const val2 = board[nr][nc];
          if (!val2) continue;

          const validConnection =
            isNeighbor(r, c, nr, nc) ||
            isLineClear(board, r, c, nr, nc) ||
            isDiagonalLineClear(board, r, c, nr, nc);

          if (!validConnection) continue;

          if (matchValidation(val1, val2)) {
            return true; // ONE valid match is enough
          }
        }
      }
    }
  }

  return false;
}
