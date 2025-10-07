import React, { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => {
      setDisplayName(u?.displayName ?? u?.email ?? "User");
      setLoading(false);
      if (!u) navigation.replace("SignIn");
    });
    return unsub;
  }, [navigation]);

  const onLogout = async () => {
    await signOut(auth);
    navigation.replace("SignIn");
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.center}>
      <Text style={styles.title}>Welcome, {displayName}</Text>
      <Pressable style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]} onPress={onLogout}>
        <Text style={styles.buttonText}>LOG OUT</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20
  },
  button: {
    backgroundColor: "#2FB0DE",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 24
  },
  buttonPressed: {
    opacity: 0.9
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 1
  }
});
