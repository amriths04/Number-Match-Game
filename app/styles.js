import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  blackScreen: {
    flex: 1,
    backgroundColor: "#000",
  },

  container: {
    flex: 1,
    backgroundColor: "#121212",
    alignItems: "center",
  },

  header: {
    width: "100%",
    paddingTop: 20,
    paddingBottom: 10,
  },

  headerText: {
    color: "#ffffff",
    fontSize: 18,
  },

  board: {
    backgroundColor: "#1e1e1e",
    padding: 8,
    marginTop: 10,
  },

  row: {
    flexDirection: "row",
  },

  cell: {
    width: 37,
    height: 37,
    margin: 2,
    backgroundColor: "#2c2c2c",
  },

  cellText: {
    color: "#ffffff",
    fontSize: 16,
  },

  pressnumber: {
    backgroundColor: "#444",
    flex: 1,
  },

  addButton: {
    marginTop: 20,
    paddingVertical: 7,
    paddingHorizontal: 18,
    backgroundColor: "#4caf50",
  },

  addButtonText: {
    color: "#000",
    fontSize: 16,
  },

  selectedCell: {
    backgroundColor: "#ff9800",
  },

  validCell: {
    backgroundColor: "#4caf50",
  },
  levelControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
  },

  levelButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: "#333",
    borderRadius: 6,
    marginHorizontal: 10,
  },

  levelButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },

  levelText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default styles;
