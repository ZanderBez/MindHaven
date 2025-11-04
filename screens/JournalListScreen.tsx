import React, { useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, TextInput, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import GlobalBackground from "../components/GlobalBackground";
import BottomNav from "../components/BottomNav";
import { styles } from "../styles/journalList";
import { useJournals } from "../hooks/useJournals";
import type { Journal } from "../services/journalService";

type JournalRoute = RouteProp<Record<string, { focusId?: string }>, string>;

function fmt(ts?: any) {
  try {
    if (!ts?.toDate) return "";
    const d = ts.toDate() as Date;
    return d.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return "";
  }
}

export default function JournalListScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<JournalRoute>();
  const { filtered, query, setQuery, highlightId, setHighlightId } = useJournals();
  const listRef = useRef<FlatList<Journal>>(null);

  useEffect(() => {
    const focusId = route.params?.focusId;
    if (!focusId || filtered.length === 0) return;
    const index = filtered.findIndex((r) => r.id === focusId);
    if (index >= 0) {
      setHighlightId(focusId);
      requestAnimationFrame(() => {
        listRef.current?.scrollToIndex({ index, animated: true });
      });
      setTimeout(() => setHighlightId(null), 1600);
    }
  }, [route.params?.focusId, filtered]);

  const handleTab = (tab: "home" | "journal" | "chats" | "profile") => {
    if (tab === "home") navigation.navigate("Home");
    if (tab === "journal") navigation.navigate("Journal");
    if (tab === "chats") navigation.navigate("Chats");
    if (tab === "profile") navigation.navigate("Profile");
  };

  const openNote = (n: Journal) => navigation.navigate("JournalEdit", { id: n.id });
  const newNote = () => navigation.navigate("JournalEdit", { id: null });

  const renderItem = ({ item }: { item: Journal }) => (
    <TouchableOpacity
      style={[
        styles.card,
        item.id === highlightId && { backgroundColor: "rgba(122, 215, 255, 0.30)" },
      ]}
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
        <Text style={styles.cardDate} numberOfLines={1}>{fmt(item.createdAt)}</Text>
      </View>

      <Text style={styles.cardPreview} numberOfLines={2} ellipsizeMode="tail">
        {item.body || ""}
      </Text>

      <View style={styles.chevWrap}>
        <Feather name="chevron-right" size={18} color="#FFFFFF" />
      </View>
    </TouchableOpacity>
  );

  const handleScrollToIndexFailed = (info: { index: number; highestMeasuredFrameIndex: number }) => {
    if (info.highestMeasuredFrameIndex >= 0) {
      listRef.current?.scrollToIndex({ index: info.highestMeasuredFrameIndex, animated: true });
    } else {
      listRef.current?.scrollToOffset({ offset: 0, animated: true });
    }
  };

  return (
    <View style={styles.bg}>
      <GlobalBackground />
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
          keyExtractor={(i) => i.id}
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
    </View>
  );
}
