import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  baseOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(8,12,20,0.20)",
  },

  typingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(8,12,20,0.28)",
  },

  safe: {
    flex: 1,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingTop: 4,
  },

  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
  },

  headerSpacer: {
    width: 36,
    height: 36,
  },

  body: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },

  label: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 8,
    marginTop: 8,
  },

  moodRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 6,
  },

  moodBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.12)",
  },

  moodActive: {
    backgroundColor: "rgba(255,255,255,0.28)",
  },

  moodText: {
    fontSize: 20,
  },

  titleInput: {
    height: 48,
    borderRadius: 14,
    paddingHorizontal: 14,
    backgroundColor: "rgba(255,255,255,0.18)",
    color: "#FFFFFF",
  },

  descInput: {
    minHeight: 220,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: "rgba(255,255,255,0.18)",
    color: "#FFFFFF",
    marginTop: 8,
  },

  inputFocused: {
    backgroundColor: "rgba(255,255,255,0.22)",
  },

  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 16,
  },

  editBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.20)",
  },

  editText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },

  saveBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#45B7D1",
  },

  saveText: {
    color: "#ffffffff",
    fontSize: 15,
    fontWeight: "900",
  },

  deleteBtn: {
    marginTop: 12,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 77, 77, 0.9)",
  },

  deleteText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
  },
});
