import { useEffect, useState } from "react";
import { View, FlatList, Pressable, Text, StyleSheet, ImageBackground, TouchableOpacity } from "react-native";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { Chat, subscribeUserChats, createNewChatWithBot } from "../services/chatService";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomNav from "../components/BottomNav";

function AvatarText({ label }: { label: string }) {
  return (
    <View style={styles.avatar}>
      <Text style={styles.avatarLabel}>{label}</Text>
    </View>
  );
}

export default function ChatsScreen() {
  const [uid, setUid] = useState<string | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const nav = useNavigation<any>();

  useEffect(() => {
    const off = onAuthStateChanged(auth, u => setUid(u?.uid ?? null));
    return off;
  }, []);

  useEffect(() => {
    if (!uid) return;
    const off = subscribeUserChats(uid, setChats);
    return off;
  }, [uid]);

  function openChat(c: Chat) {
    nav.navigate("ChatRoom", { chatId: c.id, title: c.title ?? "Chat" });
  }

  async function newSession() {
    if (!uid) return;
    const chatId = await createNewChatWithBot(uid);
    nav.navigate("ChatRoom", { chatId, title: "Therapy Buddy" });
  }

  const handleTab = (tab: "home" | "chats" | "profile") => {
    if (tab === "home") nav.navigate("Home");
    if (tab === "chats") nav.navigate("Chats");
    if (tab === "profile") nav.navigate("Profile");
  };

  return (
    <ImageBackground
      source={require("../assets/Background.png")}
      resizeMode="cover"
      style={styles.bg}
      imageStyle={styles.bgImage}
    >
      <SafeAreaView style={styles.safe}>
        <View style={styles.pagePad}>
          <Text style={styles.heading}>Chats</Text>

          <TouchableOpacity style={styles.newChatBtn} onPress={newSession} disabled={!uid}>
            <Text style={styles.newChatText}>Start a New Session</Text>
          </TouchableOpacity>

          <View style={styles.listCard}>
            <FlatList
              data={chats}
              keyExtractor={c => c.id}
              ItemSeparatorComponent={() => <View style={styles.sep} />}
              renderItem={({ item }) => (
                <Pressable onPress={() => openChat(item)} style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}>
                  <AvatarText label={(item.title?.[0] ?? "C").toUpperCase()} />
                  <View style={styles.rowText}>
                    <Text style={styles.title}>{item.title ?? "Conversation"}</Text>
                    <Text style={styles.subtitle} numberOfLines={1}>
                      {item.lastMessage ?? "Start the conversation…"}
                    </Text>
                  </View>
                </Pressable>
              )}
              ListEmptyComponent={
                <View style={styles.emptyWrap}>
                  <Text style={styles.emptyTitle}>No chats yet</Text>
                  <Text style={styles.emptySub}>Begin a conversation with your Therapy Buddy</Text>
                </View>
              }
              contentContainerStyle={chats.length === 0 ? styles.emptyContent : undefined}
            />
          </View>
        </View>

        <BottomNav active="chats" onChange={handleTab} />
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { 
    flex: 1 
  },
  bgImage: { 
    opacity: 1 
  },
  safe: { 
    flex: 1 
  },
  pagePad: { 
    flex: 1, 
    paddingHorizontal: 16, 
    paddingTop: 12, 
    paddingBottom: 12, 
    gap: 12 
  },
  heading: { 
    fontSize: 22, 
    fontWeight: "800", 
    color: "#FFF", 
    opacity: 0.95 
  },
  newChatBtn: { 
    backgroundColor: "rgba(255,255,255,0.18)", 
    paddingVertical: 12, 
    paddingHorizontal: 20, 
    borderRadius: 14, 
    alignItems: "center", 
    marginBottom: 10 
  },
  newChatText: { 
    fontSize: 15, 
    fontWeight: "700", 
    color: "#FFF" 
  },
  listCard: { 
    flex: 1, 
    backgroundColor: "rgba(255,255,255,0.14)", 
    borderRadius: 18, 
    padding: 8, 
    borderWidth: 1, 
    borderColor: "rgba(255,255,255,0.18)" 
  },
  sep: { 
    height: 1, 
    backgroundColor: "rgba(255,255,255,0.10)", 
    marginLeft: 54 
  },
  row: { 
    flexDirection: "row", 
    alignItems: "center", 
    gap: 12, 
    paddingVertical: 12, 
    paddingHorizontal: 8, 
    borderRadius: 14 
  },
  rowPressed: { 
    backgroundColor: "rgba(255,255,255,0.10)" 
  },
  rowText: { 
    flex: 1 
  },
  title: { 
    fontSize: 16, 
    fontWeight: "800", 
    color: "#FFF" 
  },
  subtitle: { 
    fontSize: 13, 
    color: "rgba(255,255,255,0.75)", 
    marginTop: 2 
  },
  avatar: { 
    width: 36, 
    height: 36, 
    borderRadius: 18, 
    backgroundColor: "rgba(255,255,255,0.85)", 
    alignItems: "center", 
    justifyContent: "center" 
  },
  avatarLabel: { 
    fontWeight: "900", 
    color: "#1a1a1a" 
  },
  emptyWrap: { 
    alignItems: "center", 
    gap: 6 
  },
  emptyTitle: { 
    fontSize: 16, 
    fontWeight: "800", 
    color: "#FFF", 
    opacity: 0.92 
  },
  emptySub: { 
    fontSize: 13, 
    color: "rgba(255,255,255,0.75)" 
  },
  emptyContent: { 
    flex: 1, 
    justifyContent: "center" 
  }
});
