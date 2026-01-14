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

export const removeMatchedCells = (board, cell1, cell2) => {
  const newBoard = board.map(row => [...row]);

  newBoard[cell1.row][cell1.col] = null;
  newBoard[cell2.row][cell2.col] = null;

  return newBoard;
};
