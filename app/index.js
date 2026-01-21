import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";
import styles from "./styles";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  isNeighbor,
  matchValidation,
  removeMatchedCells,
  isLineClear,
  isDiagonalLineClear,
  isExtendedWrapClear,
  findOneHint,
} from "../src/logic/Helper";
import {
  countRemainingMatches,
  clearEmptyRowsAndShiftUp,
  generateInitialBoard,
} from "../src/logic/Board";
import { findStragglerCells } from "../src/logic/AnalyzeBoard";
import { generateAdaptiveRow } from "../src/logic/generateAdaptiveRow";
import { LEVEL_CONFIG } from "../src/logic/levels";
import { analyzeBoardState } from "../src/logic/AnalyzeBoard";
import { hasValidMove } from "../src/logic/BoardValidator";
import { computeSeedMetrics } from "../src/logic/DebugMetrics";

export default function App() {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [hintCells, setHintCells] = useState([]);
  const [addRowUsed, setAddRowUsed] = useState(0);
  const [hintCooldown, setHintCooldown] = useState(false);
  const [gameStatus, setGameStatus] = useState(null);

  const [selectedCell, setSelectedCell] = useState(null);
  const [secselectedCell, setSecSelectedCell] = useState(null);
  const [ismatchpair, setismatchPair] = useState(false);
  const [board, setBoard] = useState([]);

  const MAX_ADD_ROWS = 6;
  const LEVEL_MIN = 1;
  const LEVEL_MAX = 11;

  const levelCfg = LEVEL_CONFIG[level];

  /* -----------------------------
     START / RESET
  ----------------------------- */
  const handleStartGame = () => {
    setScore(0);
    setGameStatus(null);
    setSelectedCell(null);
    setSecSelectedCell(null);
    setismatchPair(false);
    setAddRowUsed(0);
    setBoard(generateInitialBoard(level));
    setHasStarted(true);
  };

  const handleEndGame = () => {
    setHasStarted(false);
    setBoard([]);
    setAddRowUsed(0);
    setScore(0);
    setSelectedCell(null);
    setSecSelectedCell(null);
    setismatchPair(false);
  };

  /* -----------------------------
     BOARD METRICS (DEBUG / LOGIC)
  ----------------------------- */
  const boardStats =
    board.length > 0
      ? analyzeBoardState(board)
      : {
          remainingMatches: 0,
          possiblePairs: 0,
          matchDensity: 0,
          frequencyMap: {},
          lonelyNumbers: [],
        };

  const seedMetrics =
    board.length > 0 ? computeSeedMetrics(board) : null;

  const totalFilledCells =
    board.flat().filter(v => v != null).length;

  const noValidMoves = !hasValidMove(board);

  /* -----------------------------
     HARD GAME RULES (FINAL)
  ----------------------------- */
  const isWin =
    hasStarted &&
    totalFilledCells === 0;

  const isFail =
    hasStarted &&
    noValidMoves &&
    addRowUsed >= MAX_ADD_ROWS;

  const canAddRow =
    hasStarted &&
    !isWin &&
    noValidMoves &&
    addRowUsed < MAX_ADD_ROWS;

  /* -----------------------------
     WIN / FAIL EFFECT
  ----------------------------- */
  useEffect(() => {
    if (!hasStarted) return;

    if (isWin) {
      console.log("LEVEL CLEARED ✅");
      setGameStatus("success");
      setHasStarted(false);
    }

    if (isFail) {
      console.log("LEVEL FAILED ❌");
      setGameStatus("fail");
      setHasStarted(false);
    }
  }, [isWin, isFail, hasStarted]);

  /* -----------------------------
     CELL PRESS HANDLER
  ----------------------------- */
  const oncellpress = (row, col) => {
    if (hintCells.length) setHintCells([]);

    if (
      selectedCell &&
      selectedCell.row === row &&
      selectedCell.col === col
    ) {
      setSelectedCell(null);
      setSecSelectedCell(null);
      setismatchPair(false);
      return;
    }

    if (!selectedCell) {
      setSelectedCell({ row, col });
      setismatchPair(false);
      return;
    }

    const val1 = board[selectedCell.row][selectedCell.col];
    const val2 = board[row][col];

    const isAdj = isNeighbor(
      selectedCell.row,
      selectedCell.col,
      row,
      col
    );

    const isClearLine = isLineClear(
      board,
      selectedCell.row,
      selectedCell.col,
      row,
      col
    );

    const isClearDiagonal = isDiagonalLineClear(
      board,
      selectedCell.row,
      selectedCell.col,
      row,
      col
    );

    const isExtendedWrap = isExtendedWrapClear(
  board,
  selectedCell.row,
  selectedCell.col,
  row,
  col
);

if (!isAdj && !isClearLine && !isClearDiagonal && !isExtendedWrap) {
  setSelectedCell({ row, col });
  setSecSelectedCell(null);
  setismatchPair(false);
  return;
}


    if (!matchValidation(val1, val2)) {
      setSelectedCell({ row, col });
      setSecSelectedCell(null);
      setismatchPair(false);
      return;
    }

    const first = selectedCell;
    const second = { row, col };

    setSecSelectedCell(second);
    setismatchPair(true);

    setTimeout(() => {
      setBoard(prev => {
  const afterMatch = removeMatchedCells(prev, first, second);
  const cleaned = clearEmptyRowsAndShiftUp(afterMatch);

  // 🔑 force new reference → analysis recalculates
  return cleaned.map(row => [...row]);
});


      setScore(prev => prev + 1);
      setSelectedCell(null);
      setSecSelectedCell(null);
      setismatchPair(false);
    }, 300);
  };

  /* -----------------------------
     ADD ROW
  ----------------------------- */
const handleAddRow = () => {
  if (!canAddRow) return;

  const stragglers = findStragglerCells(board);

  // 📍 LOG STRAGGLERS WITH POSITIONS (FIXED)
  const detailed = [];
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[0].length; c++) {
      const v = board[r][c];
      if (
        v != null &&
        stragglers.some(s => s.row === r && s.col === c)
      ) {
        detailed.push({ row: r, col: c, val: v });
      }
    }
  }

  console.group("➕ ADD ROW DEBUG");
  console.log("Level:", level);
  console.log("Total Stragglers:", stragglers.length);
  console.log(detailed);
  console.log("Board before:", board);
  console.groupEnd();

  // ➕ ADD ROWS ONLY (NO BOARD MODIFICATION)
  setBoard(prev => [
    ...prev,
    ...generateAdaptiveRow(prev, level, addRowUsed, MAX_ADD_ROWS),
  ]);

  setAddRowUsed(prev => prev + 1);
};





  /* -----------------------------
     LEVEL CONTROLS
  ----------------------------- */
  const handleLevelUp = () =>
    setLevel(prev => Math.min(prev + 1, LEVEL_MAX));

  const handleLevelDown = () =>
    setLevel(prev => Math.max(prev - 1, LEVEL_MIN));

  /* -----------------------------
     UI
  ----------------------------- */
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {!hasStarted && (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          {gameStatus === "success" && (
            <Text style={{ color: "#4caf50", fontSize: 28, marginBottom: 20 }}>
              🎉 GAME CLEAR
            </Text>
          )}

          {gameStatus === "fail" && (
            <Text style={{ color: "#f44336", fontSize: 28, marginBottom: 20 }}>
              ❌ GAME OVER
            </Text>
          )}

          <Text style={{ color: "#fff", fontSize: 22, marginBottom: 20 }}>
            Choose Level
          </Text>

          <View style={styles.levelControls}>
            <TouchableOpacity onPress={handleLevelDown} style={styles.levelButton}>
              <Text style={styles.levelButtonText}>−</Text>
            </TouchableOpacity>

            <Text style={styles.levelText}>Level {level}</Text>

            <TouchableOpacity onPress={handleLevelUp} style={styles.levelButton}>
              <Text style={styles.levelButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.addButton, { marginTop: 30 }]}
            onPress={handleStartGame}
          >
            <Text style={styles.addButtonText}>START</Text>
          </TouchableOpacity>
        </View>
      )}

      {hasStarted && (
        <>
          {/* DEBUG PANEL (UNCHANGED VISUALLY) */}
          <View style={{ padding: 10, backgroundColor: "#111" }}>
  <Text style={{ color: "#0f0", fontSize: 12 }}>
    Level: {level}
  </Text>

  <Text style={{ color: "#0f0", fontSize: 12 }}>
    Solvable: {hasValidMove(board) ? "YES" : "NO"}
  </Text>

  <Text style={{ color: "#fff", fontSize: 12 }}>
    Total Cells: {seedMetrics?.totalCells ?? "—"}
  </Text>

  <Text style={{ color: "#fff", fontSize: 12 }}>
    Match-Capable Cells: {seedMetrics?.matchCapableCount ?? "—"}
  </Text>

  <Text style={{ color: "#fff", fontSize: 12 }}>
    Stragglers: {seedMetrics?.stragglers ?? "—"}
  </Text>

  <Text style={{ color: "#fff", fontSize: 12 }}>
    Potential Density: {seedMetrics?.matchDensity?.toFixed(3) ?? "—"}
  </Text>

  <Text style={{ color: "#ffa726", fontSize: 12 }}>
    Seed Matches: {seedMetrics?.seedMatches ?? "—"}
  </Text>

  <Text style={{ color: "#ffa726", fontSize: 12 }}>
    Seed Match Ratio: {seedMetrics?.seedMatchRatio?.toFixed(3) ?? "—"}
  </Text>
  <Text style={{ color: "#aaa", fontSize: 12 }}>
  Seed: {seedMetrics?.isGenerousSeed ? "Generous" : seedMetrics?.isHarshSeed ? "Harsh" : "Balanced"}
</Text>

</View>


          {/* BOARD */}
          <ScrollView style={styles.board}>
  {board.map((row, r) => (
    <View key={r} style={styles.row}>
      {row.map((cell, c) => (
        <View key={c} style={styles.cell}>
          <TouchableOpacity
            style={[
              styles.pressnumber,
              selectedCell &&
                selectedCell.row === r &&
                selectedCell.col === c &&
                (ismatchpair
                  ? styles.validCell
                  : styles.selectedCell),
              secselectedCell &&
                secselectedCell.row === r &&
                secselectedCell.col === c &&
                (ismatchpair
                  ? styles.validCell
                  : styles.selectedCell),
              hintCells.some(h => h.row === r && h.col === c) &&
                styles.hintCell,
            ]}
            onPress={() => oncellpress(r, c)}
          >
            <Text style={styles.cellText}>{cell}</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  ))}
</ScrollView>

          {/* ADD ROW */}
          <View style={{ alignItems: "center", marginTop: 8 }}>
            <TouchableOpacity
              style={[
                styles.addButton,
                !canAddRow && { opacity: 0.4 },
              ]}
              onPress={handleAddRow}
              disabled={!canAddRow}
            >
              <Text style={styles.addButtonText}>+ ADD ROW</Text>
            </TouchableOpacity>

            <Text style={{ color: "#aaa", fontSize: 12, marginTop: 4 }}>
              Add Row: {addRowUsed} / {MAX_ADD_ROWS}
            </Text>
          </View>

          {/* HINT */}
          <TouchableOpacity
            style={[
              styles.hintButton,
              (hintCooldown || !boardStats.possiblePairs) &&
                styles.hintButtonDisabled,
            ]}
            disabled={hintCooldown || !boardStats.possiblePairs}
            onPress={() => {
              setHintCooldown(true);
              const pair = findOneHint(board);
              if (pair) setHintCells(pair);
              setTimeout(() => setHintCooldown(false), 1200);
            }}
          >
            <Text style={styles.hintButtonText}>💡 Hint</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: "#8b0000" }]}
            onPress={handleEndGame}
          >
            <Text style={styles.addButtonText}>END GAME</Text>
          </TouchableOpacity>
        </>
      )}
    </SafeAreaView>
  );
}
