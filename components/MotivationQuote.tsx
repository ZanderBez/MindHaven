import React, { useEffect, useState } from "react";
import { Text, View, StyleProp, TextStyle } from "react-native";

type Props = {
  style?: StyleProp<TextStyle>;
  authorStyle?: StyleProp<TextStyle>;
  numberOfLines?: number;
  placeholder?: string;
  wrapQuotes?: boolean;
};

export default function MotivationQuote({
  style,
  authorStyle,
  numberOfLines = 3,
  placeholder = "Finding a small push for today…",
  wrapQuotes = true,
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

  if (loading) {
    return (
      <Text style={style} numberOfLines={numberOfLines}>
        {placeholder}
      </Text>
    );
  }

  const q = wrapQuotes ? `“${quote}”` : quote;

  return (
    <View>
      <Text style={[style, { fontStyle: "italic" }]} numberOfLines={numberOfLines}>
        {q}
      </Text>
      {!!author && (
        <Text style={[authorStyle || style, { fontStyle: "normal", opacity: 0.9, marginTop: 4 }]}>
          — {author}
        </Text>
      )}
    </View>
  );
}
