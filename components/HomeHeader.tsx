import React from "react";
import { View, Image, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { styles } from "../styles/home";

type Props = { greeting: string; name: string; photoURL: string | null };

export default function HomeHeader({ greeting, name, photoURL }: Props) {
  return (
    <View style={styles.heroRow}>
      {photoURL ? (
        <Image source={{ uri: photoURL }} style={styles.heroAvatar} />
      ) : (
        <View style={styles.heroAvatarFallback}>
          <Feather name="user" size={28} color="#0B0B12" />
        </View>
      )}
      <View style={styles.heroTextCol}>
        <Text style={styles.heroGreet}>{greeting}</Text>
        <Text style={styles.heroName}>{name}</Text>
      </View>
      <View style={styles.heroSpacer} />
    </View>
  );
}
