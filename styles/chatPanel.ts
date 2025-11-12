import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: { flex: 1 },
  titleRow: {
    paddingBottom: 10,
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 8
  },
  backBtn: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8
  },
  titlePill: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.18)"
  },
  titleText: {
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.3,
    color: "#FFF"
  },
  listContent: {
    paddingHorizontal: 8,
    paddingTop: 0,
    gap: 10
  },
  bubbleRow: {
    width: "100%",
    paddingHorizontal: 8,
    flexDirection: "row",
    marginBottom: 4
  },
  bubble: {
    maxWidth: "85%",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14
  },
  assistantBubble: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderTopLeftRadius: 4
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: "rgba(69,183,209,0.25)",
    marginLeft: "auto",
    borderTopRightRadius: 4
  },
  bubbleLabel: {
    fontSize: 10,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 2
  },
  bubbleText: {
    color: "#FFF",
    fontSize: 14,
    lineHeight: 20
  },
  statusWrap: {
    paddingHorizontal: 10,
    paddingTop: 0,
    paddingBottom: 6
  },
  statusChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    alignSelf: "center",
    backgroundColor: "rgba(255,255,255,0.16)",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  pulseDot: {
    width: 10,
    height: 10,
    borderRadius: 20,
    backgroundColor: "#45b7d1"
  },
  statusText: {
    color: "#fff",
    fontWeight: "700"
  },
  statusRight: { 
    marginLeft: 4 
  },
  inputCard: {
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.16)",
    padding: 8,
    marginTop: 15
  },
  inputRow: {
    position: "relative",
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 140,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "rgba(255, 255, 255, 0.10)",
    color: "#FFF"
  },
  inputOverlay: { 
    position: "absolute", 
    left: 0, 
    right: 52, 
    top: 0, 
    bottom: 0 
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.25)"
  },
  offerWrap: {
     gap: 8 
    },
  actionRow: { 
    flexDirection: "row", 
    gap: 8, 
    paddingHorizontal: 8 
  },
  actionBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.18)"
  },
  actionTxt: { 
    color: "#FFF", 
    fontWeight: "700" 
  },
  titleRowBox: { 
    flexDirection: "row", 
    alignItems: "center", 
    gap: 8, 
    paddingHorizontal: 8 
  },
  inlineInput: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: "rgba(255,255,255,0.10)",
    color: "#FFF",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)"
  },
  smallBtn: {
    height: 40,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.25)"
  },
  smallBtnTxt: { 
    color: "#FFF", 
    fontWeight: "700" 
  },
  moodRow: { 
    flexDirection: "row", 
    gap: 10, 
    paddingHorizontal: 8 
  },
  moodChip: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.18)"
  },
  moodTxt: { 
    fontSize: 22 
  }
});
