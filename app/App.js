import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import styles from "./styles";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);

  const [selectedCell, setSelectedCell] = useState(null);

  const [board, setBoard] = useState([
    [1, 5, 3, 7, 2, 8, 4, 6, 9],
    [4, 6, 1, 9, 2, 8, 5, 3, 7],
    [2, 8, 5, 5, 1, 9, 4, 6, 3],
  ]);

  const oncellpress = (row, col) => {
    if (selectedCell && selectedCell.row === row && selectedCell.col === col) {
      setSelectedCell(null);
      return;
    }
    setSelectedCell({ row, col });
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
                    selectedCell?.row === rowIndex &&
                      selectedCell?.col === colIndex &&
                      styles.selectedCell,
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
