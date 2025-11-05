import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, ActivityIndicator, Animated, ViewStyle, ImageStyle, StyleProp } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  uri?: string;
  cacheBust?: number;
  size?: number;
  showRing?: boolean;
  spinnerDelayMs?: number;
  inheritSize?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  fallbackStyle?: StyleProp<ViewStyle>;
};

export default function ProfileAvatar({
  uri,
  cacheBust = 0,
  size = 120,
  showRing = true,
  spinnerDelayMs = 300,
  inheritSize = false,
  containerStyle,
  imageStyle,
  fallbackStyle,
}: Props) {
  const [loading, setLoading] = useState<boolean>(!!uri);
  const [showSpinner, setShowSpinner] = useState(false);
  const [error, setError] = useState(false);
  const fade = useRef(new Animated.Value(0)).current;

  const src = useMemo(() => {
    if (!uri) return undefined;
    const join = uri.includes("?") ? "&" : "?";
    return { uri: `${uri}${join}v=${cacheBust}` };
  }, [uri, cacheBust]);

  useEffect(() => {
    if (!loading) { setShowSpinner(false); return; }
    const t = setTimeout(() => setShowSpinner(true), spinnerDelayMs);
    return () => clearTimeout(t);
  }, [loading, spinnerDelayMs]);

  useEffect(() => {
    if (!loading && !error && src) {
      Animated.timing(fade, { toValue: 1, duration: 180, useNativeDriver: true }).start();
    } else {
      fade.setValue(0);
    }
  }, [loading, error, src, fade]);

  const dim = typeof size === "number" ? size : 120;
  const baseContainer = inheritSize
    ? {}
    : { width: dim, height: dim, borderRadius: dim / 2, overflow: "hidden" as const };

  const core = (
    <View style={[baseContainer, containerStyle]}>
      {src && !error ? (
        <>
          <Animated.Image
            source={src}
            style={[inheritSize ? {} : { width: dim, height: dim, borderRadius: dim / 2 }, imageStyle, { opacity: fade }]}
            onLoadStart={() => { setLoading(true); setError(false); }}
            onLoad={() => setLoading(false)}
            onError={() => { setLoading(false); setError(true); }}
            onLoadEnd={() => setLoading(false)}
            accessibilityLabel="Profile picture"
          />
          {showSpinner && loading && (
            <View style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, alignItems: "center", justifyContent: "center", backgroundColor: "transparent" }}>
              <ActivityIndicator color="#45B7D1" />
            </View>
          )}
        </>
      ) : (
        <View style={[inheritSize ? {} : { width: dim, height: dim, borderRadius: dim / 2 }, fallbackStyle]}>
          <Ionicons name="person" size={Math.max(40, Math.floor(dim * 0.46))} color="#ffffff" />
        </View>
      )}
    </View>
  );

  if (!showRing) return core;

  return (
    <View style={{ padding: 4, borderRadius: 999, backgroundColor: "rgba(255,255,255,0.25)" }}>
      {core}
    </View>
  );
}
