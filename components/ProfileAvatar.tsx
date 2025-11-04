import React from "react";
import { View, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../styles/profile";

type Props = { uri?: string; cacheBust?: number };

export default function ProfileAvatar({ uri, cacheBust = 0 }: Props) {
  const src = uri ? { uri: `${uri}${uri.includes("?") ? "&" : "?"}v=${cacheBust}` } : undefined;
  return (
    <View style={styles.avatarWrap}>
      <View style={styles.avatarRing}>
        {src ? (
          <Image source={src} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarFallback]}>
            <Ionicons name="person" size={56} color="#ffffff" />
          </View>
        )}
      </View>
    </View>
  );
}
