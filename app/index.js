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
  findOneHint,
} from "../src/logic/Helper";
import {
  countRemainingMatches,
  clearEmptyRowsAndShiftUp,
  generateInitialBoard,
} from "../src/logic/Board";
import { generateAdaptiveRow } from "../src/logic/generateAdaptiveRow";
import { LEVEL_CONFIG } from "../src/logic/levels";
import { analyzeBoardState } from "../src/logic/AnalyzeBoard";

export default function App() {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [hintCells, setHintCells] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [addRowUsed, setAddRowUsed] = useState(0);
  const [hintCooldown, setHintCooldown] = useState(false);
  const [gameStatus, setGameStatus] = useState(null);

  const [selectedCell, setSelectedCell] = useState(null);
  const [secselectedCell, setSecSelectedCell] = useState(null);
  const [ismatchpair, setismatchPair] = useState(false);
  const [board, setBoard] = useState([]);

  const handleStartGame = () => {
    setScore(0);
    setGameStatus(null);
    setSelectedCell(null);
    setAddRowUsed(0);
    setSecSelectedCell(null);
    setismatchPair(false);
    setBoard(generateInitialBoard(level));
    setTimeLeft(LEVEL_CONFIG[level].targetTime);
    setHasStarted(true);
  };

  //   const STATIC_ROW = [1, 9, 2, 8, 3, 7, 4, 6, 5];
  const LEVEL_MIN = 1;
  const LEVEL_MAX = 11;

  const levelCfg = LEVEL_CONFIG[level];
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

  const maxAddRows = levelCfg.idealAddRowUsage[1];
  const isAddRowExhausted = addRowUsed >= maxAddRows;
  const noRemainingMatches = boardStats.remainingMatches === 0;

  const isLevelSuccess = isAddRowExhausted && noRemainingMatches;

  useEffect(() => {
    if (!hasStarted || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [hasStarted, timeLeft]);
  useEffect(() => {
    if (!hasStarted) return;

    if (timeLeft === 0 && !isLevelSuccess) {
      console.log("LEVEL FAILED ❌ (TIME UP)");
      setGameStatus("fail");
      setHasStarted(false);
    }
  }, [timeLeft, hasStarted, isLevelSuccess]);

  useEffect(() => {
    if (!hasStarted) return;

    if (isLevelSuccess) {
      console.log("LEVEL SUCCESS ✅");
      setGameStatus("success");
      setHasStarted(false);

      // Later you can:
      // - show success modal
      // - auto-advance level
    }
  }, [isLevelSuccess, hasStarted]);
  const constrainedCount = Object.values(boardStats.choiceMap || {}).filter(
    (v) => v === 1
  ).length;

  const handleLevelUp = () => {
    setLevel((prev) => Math.min(prev + 1, LEVEL_MAX));
  };

  const handleLevelDown = () => {
    setLevel((prev) => Math.max(prev - 1, LEVEL_MIN));
  };

  const oncellpress = (row, col) => {
    if (hintCells.length) {
      setHintCells([]);
    }
    if (selectedCell && selectedCell.row === row && selectedCell.col === col) {
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
    if (!secselectedCell) {
      const val1 = board[selectedCell.row][selectedCell.col];
      const val2 = board[row][col];

      const isAdj = isNeighbor(selectedCell.row, selectedCell.col, row, col);

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

      if (!isAdj && !isClearLine && !isClearDiagonal) {
        setSelectedCell({ row, col });
        setSecSelectedCell(null);
        setismatchPair(false);
        return;
      }
      const isMatch = matchValidation(val1, val2);
      if (!isMatch) {
        setSelectedCell({ row, col });
        setSecSelectedCell(null);
        setismatchPair(false);
        return;
      }
      if (isMatch) {
        const first = selectedCell;
        const second = { row, col };

        setSecSelectedCell(second);
        setismatchPair(true);

        setTimeout(() => {
          setBoard((prev) => {
            const afterMatch = removeMatchedCells(prev, first, second);
            const shiftedBoard = clearEmptyRowsAndShiftUp(afterMatch);
            const matches = countRemainingMatches(shiftedBoard);
            return shiftedBoard;
          });
          setScore((prev) => prev + 1);
          setSelectedCell(null);
          setSecSelectedCell(null);
          setismatchPair(false);
        }, 300);
      }

      return;
    }
    setSelectedCell({ row, col });
    setSecSelectedCell(null);
    setismatchPair(false);
  };

  const handleAddRow = () => {
    const maxAddRows = levelCfg.idealAddRowUsage[1];

    if (addRowUsed >= maxAddRows) return;

    setBoard((prev) => {
      const newRow = generateAdaptiveRow(prev, level);
      return [...prev, newRow];
    });

    setAddRowUsed((prev) => prev + 1);
  };

  const handleEndGame = () => {
    setHasStarted(false);
    setBoard([]);
    setAddRowUsed(0);
    setScore(0);
    setSelectedCell(null);
    setSecSelectedCell(null);
    setTimeLeft(0);
    setismatchPair(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* START SCREEN */}
      {!hasStarted && (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          {gameStatus === "success" && (
            <Text style={{ color: "#4caf50", fontSize: 28, marginBottom: 20 }}>
              🎉 GAME CLEAR
            </Text>
          )}

          {gameStatus === "fail" && (
            <Text style={{ color: "#ff4444", fontSize: 28, marginBottom: 20 }}>
              ❌ TIME UP
            </Text>
          )}

          <Text style={{ color: "#fff", fontSize: 22, marginBottom: 20 }}>
            Choose Level
          </Text>

          <View style={styles.levelControls}>
            <TouchableOpacity
              onPress={handleLevelDown}
              style={styles.levelButton}
            >
              <Text style={styles.levelButtonText}>−</Text>
            </TouchableOpacity>

            <Text style={styles.levelText}>Level {level}</Text>

            <TouchableOpacity
              onPress={handleLevelUp}
              style={styles.levelButton}
            >
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

      {/* GAME UI */}
      {hasStarted && (
        <>
          {/* DEBUG */}
          <View
            style={{ padding: 10, backgroundColor: "#111", marginBottom: 8 }}
          >
            <Text style={{ color: "#0f0", fontSize: 12 }}>
              Target Density: {levelCfg.targetMatchDensity}
            </Text>

            <Text style={{ color: "#0f0", fontSize: 12 }}>
              Ratios → E:{levelCfg.ratios.easy} M:{levelCfg.ratios.medium} H:
              {levelCfg.ratios.hard}
            </Text>

            <Text style={{ color: "#0f0", fontSize: 12 }}>
              Rescue Threshold: {levelCfg.rescueThreshold}
            </Text>

            <Text style={{ color: "#0f0", fontSize: 12 }}>
              Relief Level: {levelCfg.relief ? "YES" : "NO"}
            </Text>

            <Text style={{ color: "#fff", fontSize: 12, marginTop: 6 }}>
              Remaining Matches: {boardStats.remainingMatches}
            </Text>

            <Text style={{ color: "#fff", fontSize: 12 }}>
              Match Density: {boardStats.matchDensity.toFixed(3)}
            </Text>

            <Text style={{ color: "#fff", fontSize: 12 }}>
              Possible Pairs: {boardStats.possiblePairs}
            </Text>

            <Text style={{ color: "#ff0", fontSize: 12 }}>
              Constrained Numbers: {constrainedCount}
            </Text>
          </View>

          {/* HEADER */}
          <View style={styles.header}>
            <View style={styles.levelControls}>
              <TouchableOpacity
                onPress={handleLevelDown}
                style={styles.levelButton}
              >
                <Text style={styles.levelButtonText}>−</Text>
              </TouchableOpacity>

              <Text style={styles.levelText}>Level {level}</Text>

              <TouchableOpacity
                onPress={handleLevelUp}
                style={styles.levelButton}
              >
                <Text style={styles.levelButtonText}>+</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.headerText}>Score: {score}</Text>
            <Text
              style={[
                styles.headerText,
                timeLeft <= 10 && { color: "#ff4444" },
              ]}
            >
              ⏱ {Math.floor(timeLeft / 60)}:
              {String(timeLeft % 60).padStart(2, "0")}
            </Text>
          </View>

          {/* BOARD */}
          <ScrollView
            style={styles.board}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator
          >
            {board.map((row, r) => (
              <View key={r} style={styles.row}>
                {row.map((cell, c) => {
                  const isHinted = hintCells.some(
                    (h) => h.row === r && h.col === c
                  );

                  return (
                    <View key={c} style={styles.cell}>
                      <TouchableOpacity
                        style={[
                          styles.pressnumber,
                          isHinted && styles.hintCell,
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
                        ]}
                        onPress={() => oncellpress(r, c)}
                      >
                        <Text style={styles.cellText}>{cell}</Text>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            ))}
          </ScrollView>

          <View style={{ alignItems: "center", marginTop: 8 }}>
            <TouchableOpacity
              style={[
                styles.addButton,
                addRowUsed >= levelCfg.idealAddRowUsage[1] && {
                  opacity: 0.4,
                },
              ]}
              onPress={handleAddRow}
              disabled={addRowUsed >= levelCfg.idealAddRowUsage[1]}
            >
              <Text style={styles.addButtonText}>+ ADD ROW</Text>
            </TouchableOpacity>

            <Text style={{ color: "#aaa", fontSize: 12, marginTop: 4 }}>
              Add Row: {addRowUsed} / {levelCfg.idealAddRowUsage[1]}
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.hintButton,
              (hintCooldown || !boardStats.possiblePairs) &&
                styles.hintButtonDisabled,
            ]}
            disabled={hintCooldown || !boardStats.possiblePairs}
            onPress={() => {
              setHintCooldown(true);

              setTimeout(() => {
                const pair = findOneHint(board);
                if (pair) {
                  setHintCells(pair);
                }

                // cooldown ends
                setTimeout(() => {
                  setHintCooldown(false);
                }, 1200);
              }, 0);
            }}
          >
            <Text style={styles.hintButtonText}>
              💡 Hint {!boardStats.possiblePairs && "(No moves)"}
            </Text>
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
