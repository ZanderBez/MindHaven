import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, Modal, TouchableOpacity, Animated, Easing, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAuth } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

type Slide = { id: string; title: string; body: string; isBuddyName?: boolean };
type Props = { visible: boolean; onClose: () => void };

const { width: W } = Dimensions.get("window");
const CARD_W = Math.min(W - 32, 420);

export default function OnboardingOverlay({ visible, onClose }: Props) {
  const slides: Slide[] = useMemo(
    () => [
      { id: "1", title: "Welcome to MindHaven", body: "A calm space to chat, reflect, and track how you feel." },
      { id: "2", title: "Talk It Out", body: "Start a session with your Therapy Buddy. Type or use the mic for voice-to-text." },
      { id: "3", title: "Journals & Notes", body: "Capture insights and save chats into your private journal." },
      { id: "4", title: "Choose Your Buddy’s Name", body: "Pick a name for your Therapy Buddy.", isBuddyName: true },
    ],
    []
  );

  const [index, setIndex] = useState(0);
  const [buddyName, setBuddyName] = useState("");
  const fade = useRef(new Animated.Value(1)).current;
  const slideY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setIndex(0);
      fade.setValue(1);
      slideY.setValue(0);
      setBuddyName("");
    }
  }, [visible]);

  function animateTo(nextIndex: number, done: () => void) {
    Animated.parallel([
      Animated.timing(fade, { toValue: 0, duration: 160, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.timing(slideY, { toValue: 8, duration: 160, easing: Easing.out(Easing.quad), useNativeDriver: true }),
    ]).start(() => {
      done();
      fade.setValue(0);
      slideY.setValue(8);
      Animated.parallel([
        Animated.timing(fade, { toValue: 1, duration: 180, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(slideY, { toValue: 0, duration: 180, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      ]).start();
    });
  }

  const goNext = async () => {
    if (index < slides.length - 1) {
      animateTo(index + 1, () => setIndex((i) => i + 1));
    } else {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const ref = doc(db, "users", user.uid);
        await setDoc(ref, { buddyName }, { merge: true });
      }
      onClose();
    }
  };

  const goBack = () => {
    if (index > 0) animateTo(index - 1, () => setIndex((i) => i - 1));
  };

  const s = slides[index];

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.7)" }}>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 16 }}>
            <View
              style={{
                width: CARD_W,
                backgroundColor: "rgba(12,18,28,0.92)",
                borderRadius: 20,
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.10)",
                paddingVertical: 18,
                paddingHorizontal: 20,
                shadowColor: "#000",
                shadowOpacity: 0.3,
                shadowRadius: 18,
                shadowOffset: { width: 0, height: 12 },
              }}
            >
              <Animated.View style={{ opacity: fade, transform: [{ translateY: slideY }] }}>
                <Text style={{ color: "#fff", fontSize: 22, fontWeight: "800", textAlign: "center" }}>{s.title}</Text>
                <Text
                  style={{
                    color: "rgba(255,255,255,0.85)",
                    fontSize: 16,
                    lineHeight: 22,
                    textAlign: "center",
                    marginTop: 10,
                  }}
                >
                  {s.body}
                </Text>

                {s.isBuddyName && (
                  <View style={{ marginTop: 20, flexDirection: "row", justifyContent: "space-around" }}>
                    {["Luna", "Kai", "Echo"].map((name) => (
                      <TouchableOpacity
                        key={name}
                        onPress={() => setBuddyName(name)}
                        style={{
                          paddingVertical: 10,
                          paddingHorizontal: 16,
                          borderRadius: 12,
                          borderWidth: 1,
                          borderColor: buddyName === name ? "#45B7D1" : "rgba(255,255,255,0.2)",
                          backgroundColor: buddyName === name ? "rgba(69,183,209,0.15)" : "transparent",
                        }}
                      >
                        <Text style={{ color: "#fff", fontWeight: "700" }}>{name}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </Animated.View>

              <View style={{ flexDirection: "row", justifyContent: "center", gap: 8, marginTop: 16 }}>
                {slides.map((_, i) => (
                  <View
                    key={i}
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: i === index ? "#45B7D1" : "rgba(255,255,255,0.35)",
                      transform: [{ scale: i === index ? 1.15 : 1 }],
                    }}
                  />
                ))}
              </View>

              <View style={{ flexDirection: "row", alignItems: "center", marginTop: 14 }}>
                <TouchableOpacity
                  onPress={goBack}
                  disabled={index === 0}
                  style={{
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: "rgba(255,255,255,0.12)",
                    backgroundColor: "rgba(255,255,255,0.06)",
                    opacity: index === 0 ? 0.5 : 1,
                  }}
                >
                  <Text style={{ color: "#fff", fontWeight: "700" }}>Back</Text>
                </TouchableOpacity>

                <View style={{ flex: 1 }} />

                <TouchableOpacity
                  onPress={goNext}
                  disabled={s.isBuddyName && !buddyName}
                  style={{
                    paddingVertical: 12,
                    paddingHorizontal: 18,
                    borderRadius: 12,
                    backgroundColor: "rgba(69,183,209,0.95)",
                    opacity: s.isBuddyName && !buddyName ? 0.5 : 1,
                  }}
                >
                  <Text style={{ color: "#0B0B12", fontWeight: "800" }}>
                    {index === slides.length - 1 ? "Get Started" : "Next"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}
