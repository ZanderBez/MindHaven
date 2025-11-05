import React, { useEffect, useRef, useState } from "react";
import { View, Text, ActivityIndicator, Animated } from "react-native";
import { Feather } from "@expo/vector-icons";
import { styles } from "../styles/home";

type Props = { greeting: string; name: string; photoURL: string | null };

export default function HomeHeader({ greeting, name, photoURL }: Props) {
  const [loading, setLoading] = useState(!!photoURL);
  const [showSpinner, setShowSpinner] = useState(false);
  const [error, setError] = useState(false);
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!loading) return setShowSpinner(false);
    const t = setTimeout(() => setShowSpinner(true), 300);
    return () => clearTimeout(t);
  }, [loading]);

  useEffect(() => {
    if (!loading && !error && photoURL) {
      Animated.timing(fade, { toValue: 1, duration: 180, useNativeDriver: true }).start();
    } else {
      fade.setValue(0);
    }
  }, [loading, error, photoURL, fade]);

  return (
    <View style={styles.heroRow}>
      {photoURL && !error ? (
        <View style={styles.heroAvatarBox}>
          <Animated.Image
            source={{ uri: photoURL }}
            style={[styles.heroAvatarImg, { opacity: fade }]}
            onLoadStart={() => { setLoading(true); setError(false); }}
            onLoad={() => setLoading(false)}
            onError={() => { setLoading(false); setError(true); }}
            onLoadEnd={() => setLoading(false)}
            accessibilityLabel="Profile picture"
          />
          {showSpinner && loading && (
            <View style={{
              position: "absolute",
              inset: 0,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(0,0,0,0.08)",
              borderRadius: 999,
            }}>
              <ActivityIndicator color="#45B7D1" />
            </View>
          )}
        </View>
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
