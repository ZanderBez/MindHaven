import { useEffect, useMemo, useState } from "react";
import { View, FlatList,Pressable, Text, StyleSheet, ImageBackground, TouchableOpacity, Alert} from "react-native";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { Chat, subscribeUserChats, createNewChatWithBot, deleteChat} from "../services/chatService";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomNav from "../components/BottomNav";
import { Feather } from "@expo/vector-icons";

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
  const [creating, setCreating] = useState(false);
  const nav = useNavigation<any>();

  useEffect(() => {
    const off = onAuthStateChanged(auth, u => setUid(u?.uid ?? null));
    return off;
  }, []);

  useEffect(() => {
    if (!uid) return;
    const off = subscribeUserChats(uid, rows => {
      const sorted = [...rows].sort((a, b) => {
        const ta =
          (b.updatedAt?.toMillis?.() ??
            b.lastMessageAt?.toMillis?.() ??
            b.createdAt?.toMillis?.() ??
            0);
        const tb =
          (a.updatedAt?.toMillis?.() ??
            a.lastMessageAt?.toMillis?.() ??
            a.createdAt?.toMillis?.() ??
            0);
        return ta - tb;
      });
      setChats(sorted);
    });
    return off;
  }, [uid]);

  const fmtDate = useMemo(
    () =>
      (ts?: any) => {
        try {
          const d = ts?.toDate ? ts.toDate() : undefined;
          if (!d) return "";
          return d.toLocaleDateString(undefined, {
            day: "2-digit",
            month: "short",
            year: "numeric"
          });
        } catch {
          return "";
        }
      },
    []
  );

  function openChat(c: Chat) {
    nav.navigate("ChatRoom", { chatId: c.id, title: c.title ?? "Chat" });
  }

  async function newSession() {
    if (!uid || creating) return;
    setCreating(true);
    try {
      const chatId = await createNewChatWithBot(uid);
      nav.navigate("ChatRoom", { chatId, title: "Therapy Buddy" });
    } finally {
      setCreating(false);
    }
  }

  function confirmDelete(id: string) {
    Alert.alert(
      "Delete chat?",
      "This will remove the chat and all its messages.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => deleteChat(id) }
      ]
    );
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
      <View pointerEvents="none" style={styles.overlay} />
      <SafeAreaView style={styles.safe}>
        <View style={styles.pagePad}>
          <Text style={styles.heading}>Chats</Text>

          <TouchableOpacity
            style={styles.newChatBtn}
            onPress={newSession}
            disabled={!uid || creating}
          >
            <Text style={styles.newChatText}>
              {creating ? "Starting..." : "Start a New Session"}
            </Text>
          </TouchableOpacity>

          {chats.length === 0 ? (
            <View style={styles.listCard}>
              <View style={styles.emptyWrap}>
                <Text style={styles.emptyTitle}>No chats yet</Text>
                <Text style={styles.emptySub}>
                  Begin a conversation with your Therapy Buddy
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.listCard}>
              <FlatList
                data={chats}
                keyExtractor={c => c.id}
                scrollEnabled={false}
                style={styles.list}
                contentContainerStyle={styles.listContent}
                ItemSeparatorComponent={() => <View style={styles.sep} />}
                renderItem={({ item }) => {
                  const when =
                    item.createdAt ||
                    item.lastMessageAt ||
                    item.updatedAt ||
                    null;

                  return (
                    <View style={styles.row}>
                      <Pressable
                        onPress={() => openChat(item)}
                        style={styles.rowPressable}
                      >
                        <AvatarText
                          label={(item.title?.[0] ?? "T").toUpperCase()}
                        />
                        <View style={styles.textCol}>
                          <Text style={styles.title}>
                            {item.title ?? "Conversation"}
                          </Text>
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
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(8,12,20,0.35)"
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
    backgroundColor: "#45B7D1",
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
    backgroundColor: "rgba(255,255,255,0.14)",
    borderRadius: 18,
    padding: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)"
  },

  list: {
    flexGrow: 0
  },
  listContent: {
    paddingVertical: 4
  },

  sep: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.10)",
    marginLeft: 54
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    paddingHorizontal: 8
  },
  rowPressable: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12
  },

  textCol: {
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

  metaCol: {
    alignItems: "flex-end",
    gap: 8
  },
  timeLabel: {
    fontSize: 11,
    color: "rgba(255,255,255,0.75)"
  },
  deleteBtn: {
    paddingHorizontal: 6,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.10)"
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
    gap: 6,
    paddingVertical: 18
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
