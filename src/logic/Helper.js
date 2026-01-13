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
