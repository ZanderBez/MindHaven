import React, { useEffect, useState } from "react";
import { Text, View, StyleProp, TextStyle, ViewStyle } from "react-native";

type Props = {
  style?: StyleProp<TextStyle>;
  authorStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  numberOfLines?: number;
  placeholder?: string;
  wrapQuotes?: boolean;
  label?: string;
};

export default function MotivationQuote({
  style,
  authorStyle,
  containerStyle,
  numberOfLines = 4,
  placeholder = "Finding a small push for today…",
  wrapQuotes = true,
  label = "Daily Motivation",
}: Props) {
  const [quote, setQuote] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let alive = true;
    async function load() {
      setLoading(true);
      try {
        const a = await fetch("https://www.affirmations.dev/");
        if (a.ok) {
          const j = await a.json();
          if (alive && j?.affirmation) {
            setQuote(j.affirmation.trim());
            setAuthor("");
            return;
          }
        }
        const q = await fetch("https://api.quotable.io/random?tags=inspirational|success|life|happiness");
        if (q.ok) {
          const j = await q.json();
          if (alive && j?.content) {
            setQuote(j.content.trim());
            setAuthor(j.author || "");
            return;
          }
        }
        const fallbacks = [
          "You’re allowed to take it one small step at a time.",
          "Progress over perfection.",
          "You’ve handled 100% of your tough days so far.",
          "Feelings are real, and they also pass.",
          "Rest is productive.",
        ];
        if (alive) {
          setQuote(fallbacks[Math.floor(Math.random() * fallbacks.length)]);
          setAuthor("");
        }
      } catch {
        if (alive) {
          setQuote("You are doing enough. Keep going.");
          setAuthor("");
        }
      } finally {
        if (alive) setLoading(false);
      }
    }
    load();
    return () => {
      alive = false;
    };
  }, []);

  const body = loading ? placeholder : wrapQuotes ? `“${quote}”` : quote;

  return (
    <View
      style={[
        {
          paddingHorizontal: 16,
          paddingVertical: 14,
          borderRadius: 18,
          backgroundColor: "rgba(12,18,28,0.78)",
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.10)",
          shadowColor: "#000",
          shadowOpacity: 0.25,
          shadowRadius: 14,
          shadowOffset: { width: 0, height: 8 },
        },
        containerStyle,
      ]}
    >
      <Text
        style={{
          color: "#FFFFFF",
          opacity: 0.9,
          fontSize: 12,
          fontWeight: "800",
          letterSpacing: 1,
          textTransform: "uppercase",
          marginBottom: 6,
        }}
      >
        {label}
      </Text>

      <Text style={[{ color: "#FFFFFF", fontSize: 18, lineHeight: 26, fontStyle: "italic" }, style]} numberOfLines={numberOfLines}>
        {body}
      </Text>

      {!!author && !loading && (
        <Text style={[{ color: "#FFFFFF", opacity: 0.8, fontSize: 14, marginTop: 4 }, authorStyle]}>
          — {author}
        </Text>
      )}
    </View>
  );
}
