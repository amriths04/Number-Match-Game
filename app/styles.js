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
    alignItems: "center",
  },

  headerText: {
    color: "#ffffff",
    fontSize: 18,
  },

  board: {
    backgroundColor: "#d0d741",
    padding: 8,
    marginTop: 10,
    height: 400,
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

  pressnumber: {
    flex: 1,
    backgroundColor: "#444",
    alignItems: "center",
    justifyContent: "center",
  },

  cellText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },

  addButton: {
    marginTop: 20,
    paddingVertical: 7,
    paddingHorizontal: 18,
    backgroundColor: "#4caf50",
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },

  addButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
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

  /* -----------------------------
     HINT STYLES
  ----------------------------- */
  hintCell: {
    backgroundColor: "#6c5ce7",
    borderWidth: 2,
    borderColor: "#a29bfe",
    shadowColor: "#6c5ce7",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 8, // Android glow
    transform: [{ scale: 1.05 }],
  },

  hintButton: {
    marginTop: 12,
    paddingVertical: 7,
    paddingHorizontal: 18,
    backgroundColor: "#6c5ce7",
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },

  hintButtonDisabled: {
    backgroundColor: "#444",
    opacity: 0.5,
  },

  hintButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
});

export default styles;
