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

  pagePad: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    gap: 12,
  },

  heading: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFF",
    opacity: 0.95,
  },

  newChatBtn: {
    backgroundColor: "#45B7D1",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 10,
  },

  newChatText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFF",
  },

  listCard: {
    backgroundColor: "rgba(255,255,255,0.14)",
    borderRadius: 18,
    padding: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },

  list: {
    flexGrow: 0,
  },

  listContent: {
    paddingVertical: 4,
  },

  sep: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.10)",
    marginLeft: 54,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    paddingHorizontal: 8,
  },

  rowPressable: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
  },

  textCol: {
    flex: 1,
  },

  title: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFF",
  },

  subtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.75)",
    marginTop: 2,
  },

  metaCol: {
    alignItems: "flex-end",
    gap: 8,
  },

  timeLabel: {
    fontSize: 11,
    color: "rgba(255,255,255,0.75)",
  },

  deleteBtn: {
    paddingHorizontal: 6,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.10)",
  },

  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.85)",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarLabel: {
    fontWeight: "900",
    color: "#1a1a1a",
  },

  emptyWrap: {
    alignItems: "center",
    gap: 6,
    paddingVertical: 18,
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFF",
    opacity: 0.92,
  },

  emptySub: {
    fontSize: 13,
    color: "rgba(255,255,255,0.75)",
  },
});
