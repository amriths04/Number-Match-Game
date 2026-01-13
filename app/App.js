import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import styles from "./styles";
import { SafeAreaView } from "react-native-safe-area-context";
import { isNeighbor, matchValidation } from "./Helper";

export default function App() {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);

  const [selectedCell, setSelectedCell] = useState(null);
  const [secselectedCell, setSecSelectedCell] = useState(null);
  const [ismatchpair, setismatchPair] = useState(false);
  const [board, setBoard] = useState([
    [3, 5, 3, 7, 2, 8, 4, 6, 9],
    [1, 6, 1, 9, 2, 8, 5, 3, 7],
    [2, 8, 5, 5, 1, 9, 4, 6, 3],
  ]);

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
      const second = { row, col };
      const val1 = board[selectedCell.row][selectedCell.col];
      const val2 = board[row][col];
      const isNeighbourValid = isNeighbor(
        selectedCell.row,
        selectedCell.col,
        row,
        col
      );
      if (!isNeighbourValid) {
        setSelectedCell({ row, col });
        setSecSelectedCell(null);
        setismatchPair(false);
        return;
      }
      setSecSelectedCell({ row, col });
      setismatchPair(matchValidation(val1, val2));
      return;
    }
    setSelectedCell({ row, col });
    setSecSelectedCell(null);
    setismatchPair(false);
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <Text style={styles.headerText}>Level {level}</Text>
        <Text style={styles.headerText}>Score: {score}</Text>
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
                  <Text style={styles.cellText}>{cell}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>+ ADD ROW</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>HINT</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
