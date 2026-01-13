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

});

export default styles;
