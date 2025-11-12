import { View, Text, Image, StyleSheet, ActivityIndicator } from "react-native";
import React, { useState } from "react";

interface Props {
  role: "user" | "assistant";
  content: string;
  avatarUri?: string | null;
  avatarSource?: any;
  label?: string;
  fallbackLetter?: string;
}

export default function MessageBubble({
  role,
  content,
  avatarUri,
  avatarSource,
  label,
  fallbackLetter
}: Props) {
  const isUser = role === "user";
  const [loading, setLoading] = useState(Boolean(avatarUri || avatarSource));

  const renderAvatar = () => {
    if (!avatarUri && !avatarSource) {
      return (
        <View style={isUser ? styles.userFallback : styles.avatarFallback}>
          <Text style={isUser ? styles.userFallbackText : styles.avatarFallbackText}>
            {fallbackLetter ?? (isUser ? "U" : "T")}
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.avatarWrap}>
        {loading && (
          <ActivityIndicator
            size="small"
            color="#FFF"
            style={StyleSheet.absoluteFill}
          />
        )}
        <Image
          source={avatarSource ?? { uri: avatarUri! }}
          style={styles.avatar}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
        />
      </View>
    );
  };

  return (
    <View style={[styles.row, isUser ? styles.right : styles.left]}>
      {!isUser && renderAvatar()}
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.botBubble]}>
        {!!label && <Text style={styles.label}>{label}</Text>}
        <Text style={styles.text}>{content}</Text>
      </View>
      {isUser && renderAvatar()}
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
    width: 28
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
