import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },

  safe: {
    flex: 1,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 4,
  },

  backBtn: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    flex: 1,
    fontSize: 22,
    fontWeight: "800",
    color: "#FFF",
    textAlign: "center",
  },

  outerPad: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 12,
    gap: 12,
  },

  panelWrap: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.10)",
    borderRadius: 18,
    padding: 10,
  },
});
