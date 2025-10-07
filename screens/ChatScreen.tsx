import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, FlatList, ImageBackground, KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { aiChat } from "../api/ai";
import { auth } from "../firebase";

type Msg = { id: string; role: "user" | "assistant"; content: string };
const makeId = () => `${Date.now()}_${Math.floor(Math.random() * 1e6)}`;

const ASSISTANT_NAME = "Therapy Buddy";

export default function ChatScreen() {
  const navigation = useNavigation<any>();
  const userName = auth.currentUser?.displayName || "You";

  const [messages, setMessages] = useState<Msg[]>([
    { id: "w1", role: "assistant", content: "What do you want to talk about today ?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");

    const userMsg: Msg = { id: makeId(), role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);

    setLoading(true);
    try {
      const reply = await aiChat(text, messages.map(({ role, content }) => ({ role, content })));
      const botMsg: Msg = { id: makeId(), role: "assistant", content: reply };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      const errMsg: Msg = { id: makeId(), role: "assistant", content: "Sorry—I'm having trouble replying right now. I'm still here with you." };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const renderBubble = ({ item }: { item: Msg }) => {
    const isAssistant = item.role === "assistant";
    return (
      <View style={[styles.bubbleRow, isAssistant ? styles.rowLeft : styles.rowRight]}>
        <View style={[styles.bubble, isAssistant ? styles.assistantBubble : styles.userBubble]}>
          <Text style={[styles.bubbleTitle, isAssistant ? styles.assistantTitle : styles.userTitle]}>
            {isAssistant ? `${ASSISTANT_NAME} :` : `${userName} :`}
          </Text>
          <Text style={[styles.bubbleText, isAssistant ? styles.assistantText : styles.userText]}>
            {item.content}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.select({ ios: "padding", android: undefined })}>
      <ImageBackground source={require("../assets/Background.png")} style={styles.bg} imageStyle={styles.bgImage}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Therapy Buddy</Text>
        </View>

        <FlatList
          data={messages}
          keyExtractor={(m) => m.id}
          renderItem={renderBubble}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />

        <View style={styles.inputBar}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Type Your Message"
            placeholderTextColor="#D7D7E0"
            style={styles.textInput}
            onSubmitEditing={send}
            returnKeyType="send"
          />
          <TouchableOpacity onPress={send} style={styles.sendBtn} disabled={loading}>
            {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.sendIcon}>➤</Text>}
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1
  },

  bg: {
    flex: 1,
    paddingTop: 24,
    paddingHorizontal: 16,
    paddingBottom: 18
  },

  bgImage: {
    width: 450,
    height: 1300
  },

  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },

  backBtn: {
    position: "absolute",
    left: 0,
    height: 40,
    width: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999
  },

  backIcon: {
    fontSize: 28,
    color: "#FFFFFF"
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700"
  },

  pillWrap: {
    alignItems: "center",
    marginTop: 8,
    marginBottom: 6
  },

  pill: {
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 22
  },

  pillText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700"
  },

  listContent: {
    paddingTop: 12,
    paddingBottom: 100,
    gap: 12
  },

  bubbleRow: {
    width: "100%",
    flexDirection: "row"
  },

  rowLeft: {
    justifyContent: "flex-start"
  },

  rowRight: {
    justifyContent: "flex-end"
  },

  bubble: {
    maxWidth: "82%",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12
  },

  assistantBubble: {
    backgroundColor: "rgba(210,180,255,0.75)"
  },

  userBubble: {
    backgroundColor: "rgba(8,10,18,0.85)"
  },

  bubbleTitle: {
    fontWeight: "800",
    marginBottom: 4
  },

  assistantTitle: {
    color: "#2D0F4F"
  },

  userTitle: {
    color: "#FFFFFF"
  },

  bubbleText: {
    lineHeight: 20
  },

  assistantText: {
    color: "#2D0F4F"
  },
  userText: {
    color: "#FFFFFF"
  },
  inputBar: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 18,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 18,
    paddingLeft: 16,
    paddingRight: 10,
    paddingVertical: 8
  },
  textInput: {
    flex: 1,
    paddingVertical: 10,
    paddingRight: 10,
    color: "#FFFFFF"
  },
  sendBtn: {
    height: 40,
    width: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.35)"
  },
  sendIcon: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800"
  }
});
