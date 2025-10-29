import { View, Text, Image, StyleSheet } from "react-native";

export default function MessageBubble({
  role,
  content,
  avatarUri,
  avatarSource,
  label
}: {
  role: "user" | "assistant";
  content: string;
  avatarUri?: string | null;
  avatarSource?: any;
  label?: string;
}) {
  const isUser = role === "user";

  return (
    <View style={[styles.row, isUser ? styles.right : styles.left]}>
      {!isUser && (
        <View style={styles.avatarWrap}>
          {avatarSource ? (
            <Image source={avatarSource} style={styles.avatar} />
          ) : avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarFallbackText}>TB</Text>
            </View>
          )}
        </View>
      )}

      <View style={[styles.bubble, isUser ? styles.userBubble : styles.botBubble]}>
        {!!label && <Text style={styles.label}>{label}</Text>}
        <Text style={styles.text}>{content}</Text>
      </View>

      {isUser && (
        <View style={styles.avatarWrap}>
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatar} />
          ) : (
            <View style={styles.userFallback}>
              <Text style={styles.userFallbackText}>U</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    width: "100%",
    paddingHorizontal: 4,
    marginVertical: 2,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8
  },
  left: {
    justifyContent: "flex-start"
  },
  right: {
    justifyContent: "flex-end"
  },
  avatarWrap: {
    width: 28,
    height: 28
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14
  },
  avatarFallback: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.85)"
  },
  avatarFallbackText: {
    fontSize: 10,
    fontWeight: "900",
    color: "#111"
  },
  userFallback: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.45)"
  },
  userFallbackText: {
    fontSize: 10,
    fontWeight: "900",
    color: "#FFF"
  },
  bubble: {
    maxWidth: "78%",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10
  },
  botBubble: {
    backgroundColor: "rgba(255,255,255,0.22)"
  },
  userBubble: {
    backgroundColor: "rgba(0,0,0,0.45)"
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FFF",
    marginBottom: 4,
    opacity: 0.9
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    color: "#FFF"
  }
});
