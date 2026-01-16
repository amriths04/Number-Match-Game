import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity,ScrollView  } from "react-native";
import { StatusBar } from "expo-status-bar";
import styles from "./styles";
import { SafeAreaView } from "react-native-safe-area-context";
import { isNeighbor, matchValidation, removeMatchedCells,isLineClear,isDiagonalLineClear } from "../src/logic/Helper";
import { countRemainingMatches,clearEmptyRowsAndShiftUp,generateInitialBoard } from "../src/logic/Board";
import { generateAdaptiveRow } from "../src/logic/generateAdaptiveRow";
import { LEVEL_CONFIG } from "../src/logic/levels";
import { analyzeBoardState } from "../src/logic/AnalyzeBoard";

export default function App() {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  const [selectedCell, setSelectedCell] = useState(null);
  const [secselectedCell, setSecSelectedCell] = useState(null);
  const [ismatchpair, setismatchPair] = useState(false);
  const [board, setBoard] = useState([]);
  const handleStartGame = () => {
    setScore(0);
    setSelectedCell(null);
    setSecSelectedCell(null);
    setismatchPair(false);
    setBoard(generateInitialBoard(level));
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
    setBoard((prev) => {
      const newRow = generateAdaptiveRow(prev, level);
      return [...prev, newRow];
    });
  };
  const handleEndGame = () => {
    setHasStarted(false);
    setBoard([]);
    setScore(0);
    setSelectedCell(null);
    setSecSelectedCell(null);
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
          </View>

          {/* BOARD */}
          <ScrollView
            style={styles.board}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator
          >
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

          {/* ACTIONS */}
          <TouchableOpacity style={styles.addButton} onPress={handleAddRow}>
            <Text style={styles.addButtonText}>+ ADD ROW</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>HINT</Text>
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
