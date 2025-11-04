import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { styles } from "../styles/home";
import type { Chat } from "../services/chatService";

type Props = { rows: Chat[]; limit?: number; onSeeAll: () => void; onOpen: (c: Chat) => void };

export default function RecentChats({ rows, limit, onSeeAll, onOpen }: Props) {
  const list = limit ? rows.slice(0, limit) : rows;
  return (
    <>
      <View style={styles.sectionTitleRow}>
        <Text style={styles.sectionTitle}>Recent Chats</Text>
        <TouchableOpacity onPress={onSeeAll} hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}>
          <Text style={styles.seeAll}>See all</Text>
        </TouchableOpacity>
      </View>

      {list.length > 0 ? (
        <View style={styles.recentList}>
          {list.map((c) => (
            <TouchableOpacity key={c.id} onPress={() => onOpen(c)} activeOpacity={0.9} style={styles.recentRow}>
              <View style={styles.recentLeft}>
                <View style={styles.recentAvatar}>
                  <Text style={styles.recentAvatarText}>{(c.title?.[0] ?? "C").toUpperCase()}</Text>
                </View>
                <View style={styles.recentTextCol}>
                  <Text style={styles.recentTitle} numberOfLines={1}>{c.title ?? "Conversation"}</Text>
                  <Text style={styles.recentSub} numberOfLines={1}>{c.lastMessage ?? "Start the conversation…"}</Text>
                </View>
              </View>
              <Feather name="chevron-right" size={18} color="#FFF" />
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <TouchableOpacity onPress={onSeeAll} activeOpacity={0.9} style={styles.recentEmpty}>
          <Feather name="message-circle" size={18} color="#FFFFFF" />
          <Text style={styles.recentEmptyText}>No recent chats — start one</Text>
        </TouchableOpacity>
      )}
    </>
  );
}
