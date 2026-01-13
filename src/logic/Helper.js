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
  // must be same row or same column
  if (r1 !== r2 && c1 !== c2) return false;

  // same row
  if (r1 === r2) {
    const start = Math.min(c1, c2) + 1;
    const end = Math.max(c1, c2);

    for (let c = start; c < end; c++) {
      if (board[r1][c] !== null) return false;
    }
    return true;
  }

  // same column
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
