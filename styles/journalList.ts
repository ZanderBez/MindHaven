import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(8,12,20,0.35)",
  },

  safe: {
    flex: 1,
  },

  heading: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFFFFF",
    marginTop: 6,
    marginLeft: 16,
  },

  searchRow: {
    margin: 16,
    height: 48,
    borderRadius: 14,
    paddingHorizontal: 14,
    backgroundColor: "rgba(255,255,255,0.18)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  searchInput: {
    flex: 1,
    color: "#FFFFFF",
    marginRight: 10,
  },

  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 12,
  },

  card: {
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.18)",
    padding: 14,
    paddingRight: 60,
  },

  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  titleWrap: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
    paddingRight: 8,
    gap: 6,
  },

  cardTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
    flexShrink: 1,
    maxWidth: "78%",
  },

  cardMood: {
    color: "#FFFFFF",
    fontSize: 16,
  },

  cardDate: {
    color: "#FFFFFF",
    opacity: 0.85,
    fontSize: 12,
    fontWeight: "700",
    marginLeft: 8,
    maxWidth: "22%",
  },

  cardPreview: {
    color: "#FFFFFF",
    opacity: 0.95,
    marginTop: 8,
  },

  chevWrap: {
    position: "absolute",
    right: 10,
    bottom: 12,
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.20)",
  },

  fab: {
    position: "absolute",
    bottom: 96,
    alignSelf: "center",
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "#45B7D1",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
  },

  fabPlus: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
  },
});
