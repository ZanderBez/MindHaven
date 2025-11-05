import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(8,12,20,0.35)",
  },

 heroRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 8,
  },
  heroAvatarBox: {
    width: 80,
    height: 80,
    borderRadius: 50,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderWidth: 2,
    borderColor: "#7AD7FF",
    alignItems: "center",
    justifyContent: "center",
  },
  heroAvatarImg: {
    width: "100%",
    height: "100%",
    borderRadius: 24,
    position: "absolute",
    left: 0,
    top: 0,
  },
  heroAvatarFallback: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderWidth: 2,
    borderColor: "#7AD7FF",
  },
  heroTextCol: {
    marginLeft: 12,
  },
  heroGreet: {
    color: "#FFF",
    opacity: 0.9,
    fontSize: 13,
  },
  heroName: {
    color: "#FFF",
    fontSize: 30,
    fontWeight: "800",
  },
  heroSpacer: {
    flex: 1,
  },

  motivationBlock: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderColor: "rgba(255,255,255,0.18)",
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 6,
  },

  motivationTitle: {
    color: "#ffffffff",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 0.3,
  },

  motivationQuote: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    opacity: 0.95,
    marginTop: 2,
    marginLeft: 2,
    fontStyle: "italic",
  },

  motivationAuthor: {
    color: "#FFFFFF",
    fontSize: 13,
    opacity: 0.9,
    marginTop: 4,
  },

  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  seeAll: {
    color: "#7AD7FF",
    fontWeight: "800",
    fontSize: 13,
  },

  recentList: {
    backgroundColor: "rgba(255,255,255,0.14)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },

  recentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 12,
  },

  recentLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },

  recentAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
  },

  recentAvatarText: {
    color: "#111",
    fontWeight: "900",
  },

  recentTextCol: {
    flex: 1,
  },

  recentTitle: {
    color: "#FFFFFF",
    fontWeight: "900",
  },

  recentSub: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
    marginTop: 2,
  },

  recentEmpty: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(255,255,255,0.14)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    paddingHorizontal: 12,
    paddingVertical: 12,
  },

  recentEmptyText: {
    color: "#FFFFFF",
    fontWeight: "800",
  },

  inputCard: {
    height: 50,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.22)",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 14,
    paddingRight: 6,
  },

  input: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 15,
  },

  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.30)",
  },

  sttStatusWrap: {
    marginTop: 8,
    marginBottom: 2,
    alignItems: "center",
  },

  sttStatusChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.16)",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  sttPulseDot: {
    width: 10,
    height: 10,
    borderRadius: 20,
    backgroundColor: "#45b7d1",
    marginRight: 8,
  },

  sttStatusText: {
    color: "#fff",
    fontWeight: "700",
    marginLeft: 2,
  },

  card: {
    height: 200,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.16)",
    padding: 14,
    marginRight: 16,
  },

  cardFirst: {
    marginLeft: 2,
  },

  cardEmpty: {
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  cardText: {
    color: "#FFFFFF",
    fontWeight: "800",
  },

  noteTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  noteTitle: {
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "900",
    maxWidth: "70%",
  },

  noteDate: {
    color: "#FFFFFF",
    opacity: 0.85,
    fontSize: 12,
    fontWeight: "700",
  },

  notePreview: {
    color: "#FFFFFF",
    opacity: 0.95,
  },
});
