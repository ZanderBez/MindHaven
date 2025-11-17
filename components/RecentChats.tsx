import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { styles } from "../styles/home";
import type { Chat } from "../services/chatService";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

type Props = {
  rows: Chat[];
  limit?: number;
  onSeeAll: () => void;
  onOpen: (c: Chat) => void;
};

export default function RecentChats({ rows, limit, onSeeAll, onOpen }: Props) {
  const [buddyName, setBuddyName] = useState("Therapy Buddy");

  useEffect(() => {
    const fetchBuddyName = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data() as any;
          if (data.buddyName) setBuddyName(data.buddyName);
        }
      }
    };
    fetchBuddyName();
  }, []);

  const list = limit ? rows.slice(0, limit) : rows;

  return (
    <>
      <View style={styles.sectionTitleRow}>
        <Text style={styles.sectionTitle}>Recent Chats</Text>
        <TouchableOpacity
          onPress={onSeeAll}
          hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
        >
          <Text style={styles.seeAll}>See all</Text>
        </TouchableOpacity>
      </View>

      {list.length > 0 ? (
        <View style={styles.recentList}>
          {list.map((c) => {
            const displayTitle =
              c.title === "therapist-bot"
                ? buddyName
                : c.title ?? buddyName;

            return (
              <TouchableOpacity
                key={c.id}
                onPress={() => onOpen(c)}
                activeOpacity={0.9}
                style={styles.recentRow}
              >
                <View style={styles.recentLeft}>
                  <View style={styles.recentAvatar}>
                    <Text style={styles.recentAvatarText}>
                      {displayTitle[0].toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.recentTextCol}>
                    <Text style={styles.recentTitle} numberOfLines={1}>
                      {displayTitle}
                    </Text>
                    <Text style={styles.recentSub} numberOfLines={1}>
                      {c.lastMessage ?? "Start the conversation…"}
                    </Text>
                  </View>
                </View>
                <Feather name="chevron-right" size={18} color="#FFF" />
              </TouchableOpacity>
            );
          })}
        </View>
      ) : (
        <TouchableOpacity
          onPress={onSeeAll}
          activeOpacity={0.9}
          style={styles.recentEmpty}
        >
          <Feather name="message-circle" size={18} color="#FFFFFF" />
          <Text style={styles.recentEmptyText}>No recent chats — start one</Text>
        </TouchableOpacity>
      )}
    </>
  );
}
