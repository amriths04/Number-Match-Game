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
export const isExtendedWrapClear = (board, r1, c1, r2, c2) => {
  if (!board || board.length === 0) return false;
  if (!board[0] || board[0].length === 0) return false;

  const rows = board.length;
  const cols = board[0].length;

  // ❌ same cell or backward movement not allowed
  if (r2 < r1) return false;
  if (r2 === r1 && c2 <= c1) return false;

  /* ---------------------------------
     SAME ROW → SIMPLE LINE CHECK
  --------------------------------- */
  if (r1 === r2) {
    for (let c = c1 + 1; c < c2; c++) {
      if (board[r1][c] !== null) return false;
    }
    return true;
  }

  /* ---------------------------------
     1️⃣ Finish row r1 (right side)
  --------------------------------- */
  for (let c = c1 + 1; c < cols; c++) {
    if (board[r1][c] !== null) return false;
  }

  /* ---------------------------------
     2️⃣ Full rows strictly in between
  --------------------------------- */
  for (let r = r1 + 1; r < r2; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c] !== null) return false;
    }
  }

  /* ---------------------------------
     3️⃣ Enter row r2 from left
  --------------------------------- */
  for (let c = 0; c < c2; c++) {
    if (board[r2][c] !== null) return false;
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

export function findOneHint(board) {
  if (!board || board.length === 0) return null;
  if (!board[0] || board[0].length === 0) return null;
  const rows = board.length;
  const cols = board[0].length;

  const validPairs = [];

  for (let r1 = 0; r1 < rows; r1++) {
    for (let c1 = 0; c1 < cols; c1++) {
      const val1 = board[r1][c1];
      if (val1 === null) continue;

      for (let r2 = 0; r2 < rows; r2++) {
        for (let c2 = 0; c2 < cols; c2++) {
          if (r1 === r2 && c1 === c2) continue;

          const val2 = board[r2][c2];
          if (val2 === null) continue;

          if (!matchValidation(val1, val2)) continue;

          const validMove =
  isNeighbor(r1, c1, r2, c2) ||
  isLineClear(board, r1, c1, r2, c2) ||
  isDiagonalLineClear(board, r1, c1, r2, c2) ||
  isExtendedWrapClear(board, r1, c1, r2, c2);


          if (!validMove) continue;

          validPairs.push([
            { row: r1, col: c1 },
            { row: r2, col: c2 },
          ]);
        }
      }
    }
  }

  if (validPairs.length === 0) return null;

  const index = Math.floor(Math.random() * validPairs.length);
  return validPairs[index];
}

