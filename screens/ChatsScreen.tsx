// screens/ChatsScreen.tsx
import React from "react";
import { View, FlatList, Pressable, Text, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import GlobalBackground from "../components/GlobalBackground";
import BottomNav from "../components/BottomNav";
import { styles } from "../styles/chat";
import { useChats } from "../hooks/useChats";
import type { Chat } from "../services/chatService";

function AvatarText({ label }: { label: string }) {
  return (
    <View style={styles.avatar}>
      <Text style={styles.avatarLabel}>{label}</Text>
    </View>
  );
}

export default function ChatsScreen() {
  const nav = useNavigation<any>();
  const { uid, chats, creating, fmtDate, newSession, removeChat } = useChats();

  function openChat(c: Chat) {
    nav.navigate("ChatRoom", { chatId: c.id, title: c.title ?? "Chat" });
  }

  async function handleNew() {
    const chatId = await newSession();
    if (chatId) nav.navigate("ChatRoom", { chatId, title: "Therapy Buddy" });
  }

  function confirmDelete(id: string) {
    Alert.alert("Delete chat?", "This will remove the chat and all its messages.", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => removeChat(id) },
    ]);
  }

  const handleTab = (tab: "home" | "journal" | "chats" | "profile") => {
    if (tab === "home") nav.navigate("Home");
    if (tab === "journal") nav.navigate("Journal");
    if (tab === "chats") nav.navigate("Chats");
    if (tab === "profile") nav.navigate("Profile");
  };

  return (
    <View style={styles.bg}>
      <GlobalBackground />
      <View pointerEvents="none" style={styles.overlay} />
      <SafeAreaView style={styles.safe}>
        <View style={styles.pagePad}>
          <Text style={styles.heading}>Chats</Text>

          <TouchableOpacity style={styles.newChatBtn} onPress={handleNew} disabled={!uid || creating}>
            <Text style={styles.newChatText}>{creating ? "Starting..." : "Start a New Session"}</Text>
          </TouchableOpacity>

          {chats.length === 0 ? (
            <View style={styles.listCard}>
              <View style={styles.emptyWrap}>
                <Text style={styles.emptyTitle}>No chats yet</Text>
                <Text style={styles.emptySub}>Begin a conversation with your Therapy Buddy</Text>
              </View>
            </View>
          ) : (
            <View style={styles.listCard}>
              <FlatList
                data={chats}
                keyExtractor={(c) => c.id}
                scrollEnabled={false}
                style={{ flexGrow: 0 }}
                contentContainerStyle={styles.listContent}
                ItemSeparatorComponent={() => <View style={styles.sep} />}
                renderItem={({ item }) => {
                  const when = item.createdAt || item.lastMessageAt || item.updatedAt || null;
                  return (
                    <View style={styles.row}>
                      <Pressable onPress={() => openChat(item)} style={styles.rowPressable}>
                        <AvatarText label={(item.title?.[0] ?? "T").toUpperCase()} />
                        <View style={styles.textCol}>
                          <Text style={styles.title}>{item.title ?? "Conversation"}</Text>
                          <Text style={styles.subtitle} numberOfLines={1}>
                            {item.lastMessage ?? "Start the conversation…"}
                          </Text>
                        </View>
                      </Pressable>

                      <View style={styles.metaCol}>
                        <Text style={styles.timeLabel}>{fmtDate(when)}</Text>
                        <TouchableOpacity
                          onPress={() => confirmDelete(item.id)}
                          style={styles.deleteBtn}
                          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                          <Feather name="trash-2" size={18} color="#FFF" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                }}
              />
            </View>
          )}
        </View>

        <BottomNav active="chats" onChange={handleTab} />
      </SafeAreaView>
    </View>
  );
}
