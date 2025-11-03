import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, TextInput, FlatList, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { Journal, subscribeJournals } from "../services/journalService";
import BottomNav from "../components/BottomNav";

type JournalRoute = RouteProp<Record<string, { focusId?: string }>, string>;

export default function JournalListScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<JournalRoute>();
  const [uid, setUid] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [rows, setRows] = useState<Journal[]>([]);
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const listRef = useRef<FlatList<Journal>>(null);


  useEffect(() => {
    if (!uid) return;
    const off = subscribeJournals(uid, setRows);
    return off;
  }, [uid]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(r => (r.title || "").toLowerCase().includes(q) || (r.body || "").toLowerCase().includes(q));
  }, [rows, query]);

  useEffect(() => {
    const focusId = route.params?.focusId;
    if (!focusId || filtered.length === 0) return;
    const index = filtered.findIndex(r => r.id === focusId);
    if (index >= 0) {
      setHighlightId(focusId);
      requestAnimationFrame(() => {
        listRef.current?.scrollToIndex({ index, animated: true });
      });
      setTimeout(() => setHighlightId(null), 1600);
    }
  }, [route.params?.focusId, filtered]);

  function openNote(n: Journal) {
    navigation.navigate("JournalEdit", { id: n.id });
  }

  function newNote() {
    navigation.navigate("JournalEdit", { id: null });
  }

  function fmt(ts?: any) {
    try {
      if (!ts?.toDate) return "";
      const d = ts.toDate() as Date;
      return d.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });
    } catch { return ""; }
  }

  const renderItem = ({ item }: { item: Journal }) => (
    <TouchableOpacity
      style={[styles.card, item.id === highlightId && { backgroundColor: "rgba(122, 215, 255, 0.30)" }]}
      activeOpacity={0.9}
      onPress={() => openNote(item)}
    >
      <View style={styles.cardTop}>
        <View style={styles.titleWrap}>
          <Text style={styles.cardTitle} numberOfLines={1} ellipsizeMode="tail">
            {item.title || "Untitled"}
          </Text>
          {!!item.mood && <Text style={styles.cardMood} numberOfLines={1}>{item.mood}</Text>}
        </View>
        <Text style={styles.cardDate} numberOfLines={1}>
          {fmt(item.createdAt)}
        </Text>
      </View>

      <Text style={styles.cardPreview} numberOfLines={2} ellipsizeMode="tail">
        {item.body || ""}
      </Text>

      <View style={styles.chevWrap}>
        <Feather name="chevron-right" size={18} color="#FFFFFF" />
      </View>
    </TouchableOpacity>
  );

  function handleScrollToIndexFailed(info: { index: number; highestMeasuredFrameIndex: number }) {
    if (info.highestMeasuredFrameIndex >= 0) {
      listRef.current?.scrollToIndex({ index: info.highestMeasuredFrameIndex, animated: true });
    } else {
      listRef.current?.scrollToOffset({ offset: 0, animated: true });
    }
  }

  const handleTab = (tab: "home" | "journal" | "chats" | "profile") => {
    if (tab === "home") navigation.navigate("Home");
    if (tab === "journal") navigation.navigate("Journal");
    if (tab === "chats") navigation.navigate("Chats");
    if (tab === "profile") navigation.navigate("Profile");
  };

  return (
    <ImageBackground source={require("../assets/Background.png")} resizeMode="cover" style={styles.bg} imageStyle={styles.bgImage}>
      <View pointerEvents="none" style={styles.overlay} />
      <SafeAreaView style={styles.safe}>
        <Text style={styles.heading}>Your Notes</Text>

        <View style={styles.searchRow}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search notes"
            placeholderTextColor="rgba(255,255,255,0.85)"
            style={styles.searchInput}
          />
          <Feather name="search" size={18} color="#FFFFFF" />
        </View>

        <FlatList
          ref={listRef}
          data={filtered}
          keyExtractor={i => i.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          onScrollToIndexFailed={handleScrollToIndexFailed}
        />

        <TouchableOpacity onPress={newNote} activeOpacity={0.9} style={styles.fab}>
          <Feather name="book" size={18} color="#FFFFFF" />
          <Text style={styles.fabPlus}>+</Text>
        </TouchableOpacity>

        <BottomNav active="journal" onChange={handleTab} />
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
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingTop: 4
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "#7AD7FF"
  },
  avatarFallback: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#7AD7FF"
  },
  heading: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFFFFF",
    marginTop: 6,
    marginLeft: 16
  },
  searchRow: {
    margin: 16,
    height: 48,
    borderRadius: 14,
    paddingHorizontal: 14,
    backgroundColor: "rgba(255,255,255,0.18)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  searchInput: {
    flex: 1,
    color: "#FFFFFF",
    marginRight: 10
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 12
  },
  card: {
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.18)",
    padding: 14,
    paddingRight: 60
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  titleWrap: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
    paddingRight: 8,
    gap: 6
  },
  cardTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
    flexShrink: 1,
    maxWidth: "78%"
  },
  cardMood: {
    color: "#FFFFFF",
    fontSize: 16
  },
  cardDate: {
    color: "#FFFFFF",
    opacity: 0.85,
    fontSize: 12,
    fontWeight: "700",
    marginLeft: 8,
    maxWidth: "22%"
  },
  cardPreview: {
    color: "#FFFFFF",
    opacity: 0.95,
    marginTop: 8
  },
  chevWrap: {
    position: "absolute",
    right: 10,
    bottom: 12,
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.20)"
  },
  fab: {
    position: "absolute",
    bottom: 96,
    alignSelf: "center",
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "#45B7D1",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6
  },
  fabPlus: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900"
  }
});
