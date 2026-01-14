import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import styles from "./styles";
import { SafeAreaView } from "react-native-safe-area-context";
import { isNeighbor, matchValidation, removeMatchedCells,isLineClear,isDiagonalLineClear } from "../src/logic/Helper";
import { countRemainingMatches,clearEmptyRowsAndShiftUp } from "../src/logic/Board";

export default function App() {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);

  const [selectedCell, setSelectedCell] = useState(null);
  const [secselectedCell, setSecSelectedCell] = useState(null);
  const [ismatchpair, setismatchPair] = useState(false);
  const [board, setBoard] = useState([
    [8, 5, 5, 5, 2, 8, 4, 6, 9],
    [1, 5, 5, 9, 1, 8, 8, 3, 7],
    [2, 8, 5, 5, 1, 9, 4, 6, 2],
  ]);
  const STATIC_ROW = [1, 9, 2, 8, 3, 7, 4, 6, 5];

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
      const newBoard = [...prev, [...STATIC_ROW]];
      return newBoard;
    });
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <Text style={styles.headerText}>Level {level}</Text>
        <Text style={styles.headerText}>Score: {score}</Text>
        <Text style={styles.headerText}>
          Remaining: {countRemainingMatches(board)}
        </Text>
      </View>

      <View style={styles.board}>
        {board.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((cell, colIndex) => (
              <View key={colIndex} style={styles.cell}>
                <TouchableOpacity
                  style={[
                    styles.pressnumber,
                    ((selectedCell &&
                      selectedCell.row === rowIndex &&
                      selectedCell.col === colIndex) ||
                      (secselectedCell &&
                        secselectedCell.row === rowIndex &&
                        secselectedCell.col === colIndex)) &&
                      (ismatchpair ? styles.validCell : styles.selectedCell),
                  ]}
                  onPress={() => oncellpress(rowIndex, colIndex)}
                >
                  <Text style={styles.cellText}>
                    {cell !== null ? cell : ""}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.addButton} onPress={handleAddRow}>
        <Text style={styles.addButtonText}>+ ADD ROW</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>HINT</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
