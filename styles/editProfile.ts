import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  root: {
    flex: 1,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
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

  iconBtn: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },

  hitSlop: {
    top: 10,
    left: 10,
    right: 10,
    bottom: 10,
  },

  title: {
    flex: 1,
    fontSize: 22,
    fontWeight: "800",
    color: "#FFFFFF",
    textAlign: "center",
  },

  headerSpacer: {
    width: 28,
    height: 28,
  },

  body: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },

  avatarPicker: {
    alignItems: "center",
    marginBottom: 18,
  },

  avatarRing: {
    width: 152,
    height: 152,
    borderRadius: 76,
    padding: 4,
    backgroundColor: "rgba(255,255,255,0.25)",
  },

  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 76,
    borderWidth: 3,
    borderColor: "#7AD7FF",
  },

  avatarFallback: {
    width: "100%",
    height: "100%",
    borderRadius: 76,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderWidth: 3,
    borderColor: "#7AD7FF",
  },

  changePhotoPill: {
    marginTop: 10,
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#45B7D1",
  },

  changePhotoText: {
    color: "#ffffffff",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0.2,
  },

  group: {
    marginBottom: 14,
  },

  label: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 13,
    marginBottom: 8,
    fontWeight: "700",
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    height: 52,
    borderRadius: 14,
    paddingHorizontal: 14,
    backgroundColor: "rgba(255,255,255,0.20)",
  },

  input: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
    marginLeft: 10,
  },

  err: {
    color: "#FFD1D1",
    marginTop: 6,
  },

  primaryBtn: {
    height: 52,
    borderRadius: 16,
    backgroundColor: "#45B7D1",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },

  primaryText: {
    color: "#ffffffff",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
});
