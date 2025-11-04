import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

  bg: {
    flex: 1,
  },

  bgImage: {
    width: "100%",
    height: "100%",
  },

  header: {
    height: 160,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 40,
  },

  logo: {
    marginTop: 200,
    width: 700,
    height: 400,
  },

  bottomFill: {
    flexGrow: 1,
    justifyContent: "flex-end",
  },

  card: {
    backgroundColor: "#E6E6E6",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
    minHeight: "65%",
  },

  welcome: {
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 16,
  },

  label: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 8,
    marginBottom: 6,
  },

  input: {
    borderWidth: 1,
    borderColor: "#333333",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
  },

  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconWrap: {
    position: "absolute",
    right: 12,
    padding: 4,
  },

  error: {
    color: "crimson",
    marginTop: 10,
  },

  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 14,
  },

  muted: {
    color: "#444444",
  },

  loginLink: {
    fontWeight: "700",
    color: "#000000",
  },

  divider: {
    height: 2,
    backgroundColor: "#111111",
    width: "70%",
    alignSelf: "center",
    marginVertical: 18,
  },

  button: {
    backgroundColor: "#2FB0DE",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 24,
  },

  buttonPressed: {
    opacity: 0.9,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 1,
  },
});
