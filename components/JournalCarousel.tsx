import React from "react";
import { FlatList, TouchableOpacity, View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { styles } from "../styles/home";
import type { Journal } from "../services/journalService";
import { CARD_W, CARD_GAP, SIDE_PADDING } from "../utils/layout";
import { fmt } from "../utils/dates";

type Props = { notes: Journal[]; onCreate: () => void; onOpen: (id: string) => void };

export default function JournalCarousel({ notes, onCreate, onOpen }: Props) {
  return (
    <>
      <View style={styles.sectionTitleRow}>
        <Text style={styles.sectionTitle}>Journal</Text>
      </View>

      <FlatList
        horizontal
        data={notes}
        keyExtractor={(it) => it.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 4, paddingRight: SIDE_PADDING }}
        snapToInterval={CARD_W + CARD_GAP}
        decelerationRate="fast"
        ListEmptyComponent={
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={onCreate}
            style={[styles.card, styles.cardEmpty, { width: CARD_W }]}
          >
            <Feather name="plus" size={18} color="#FFFFFF" />
            <Text style={styles.cardText}>Create your first Journal</Text>
          </TouchableOpacity>
        }
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={[styles.card, { width: CARD_W }, index === 0 && styles.cardFirst]}
            activeOpacity={0.9}
            onPress={() => onOpen(item.id)}
          >
            <View style={styles.noteTop}>
              <Text style={styles.noteTitle} numberOfLines={1}>
                {item.title || "Untitled"} {item.mood ? ` ${item.mood}` : ""}
              </Text>
              <Text style={styles.noteDate}>{fmt(item.createdAt)}</Text>
            </View>
            <Text style={styles.notePreview} numberOfLines={3}>{item.body || ""}</Text>
          </TouchableOpacity>
        )}
      />
    </>
  );
}
