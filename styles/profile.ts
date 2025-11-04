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

  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 88,
  },

  avatarWrap: {
    alignItems: "center",
    marginTop: 8,
    marginBottom: 8,
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
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    width: "100%",
    height: "100%",
    borderRadius: 76,
    borderWidth: 3,
    borderColor: "#7AD7FF",
  },

  name: {
    textAlign: "center",
    color: "#FFF",
    fontSize: 20,
    fontWeight: "800",
    marginTop: 6,
  },

  tagline: {
    textAlign: "center",
    color: "rgba(255,255,255,0.85)",
    fontSize: 13,
    marginTop: 6,
  },

  actions: {
    marginTop: 18,
    gap: 12,
  },

  rowBtn: {
    height: 56,
    borderRadius: 14,
    paddingHorizontal: 16,
    backgroundColor: "rgba(255,255,255,0.20)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  rowLabel: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  signOutBtn: {
    height: 52,
    borderRadius: 16,
    backgroundColor: "#45B7D1",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 16,
    marginTop: 16,
  },

  signOutText: {
    color: "#ffffffff",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
});
