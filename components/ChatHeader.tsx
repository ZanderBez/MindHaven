import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../styles/chatPanel";

export default function ChatHeader({ title, onBack }: { title: string; onBack?: () => void }) {
  return (
    <View style={styles.titleRow}>
      <TouchableOpacity onPress={onBack} style={styles.backBtn} hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}>
        <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>
      <View style={{ flex: 1, alignItems: "center" }}>
        <View style={styles.titlePill}>
          <Text style={styles.titleText}>{title}</Text>
        </View>
      </View>
      <View style={{ width: 28 }} />
    </View>
  );
}
