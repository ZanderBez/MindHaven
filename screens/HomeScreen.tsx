import React, { useEffect, useMemo, useState } from "react";
import { View, ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import GlobalBackground from "../components/GlobalBackground";
import BottomNav from "../components/BottomNav";
import HomeHeader from "../components/HomeHeader";
import MotivationQuote from "../components/MotivationQuote";
import InputComposer from "../components/InputComposer";
import RecentChats from "../components/RecentChats";
import JournalCarousel from "../components/JournalCarousel";
import OnboardingOverlay from "../components/OnboardingOverlay";
import { useAuthUser } from "../hooks/useAuthUser";
import { useHomeStreams } from "../hooks/useHomeStreams";
import { styles } from "../styles/home";
import { SIDE_PADDING } from "../utils/layout";

const ONBOARD_KEY = "mindhaven_onboarding_seen_v1";

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const { uid, name, photoURL } = useAuthUser();
  const { recentChats, notes } = useHomeStreams(uid);
  const [ready, setReady] = useState(false);
  const [showOnboard, setShowOnboard] = useState(false);
  const [buddyName, setBuddyName] = useState("Therapy Buddy");

    useEffect(() => {
    const fetchBuddyName = async () => {
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


  useEffect(() => {
    let alive = true;
    async function decide() {
      if (!uid) return;
      const key = `${ONBOARD_KEY}_${uid}`;
      const seen = await AsyncStorage.getItem(key);
      const m = auth.currentUser?.metadata;
      const firstLogin = !!m && m.creationTime === m.lastSignInTime;
      const shouldShow = !seen && firstLogin;
      if (!alive) return;
      setShowOnboard(shouldShow);
      setReady(true);
    }
    decide();
    return () => { alive = false; };
  }, [uid]);

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning";
    if (h < 18) return "Good Afternoon";
    return "Good Evening";
  }, []);

  function handleTab(key: string) {
    if (key === "home") return;
    if (key === "chats") navigation.navigate("Chats");
    if (key === "journal") navigation.navigate("Journal");
    if (key === "profile") navigation.navigate("Profile");
  }

  async function dismissOnboard() {
    if (!uid) return;
    const key = `${ONBOARD_KEY}_${uid}`;
    await AsyncStorage.setItem(key, "1");
    setShowOnboard(false);
  }

  return (
    <View style={{ flex: 1 }}>
      <GlobalBackground />
      <View style={styles.overlay} />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: SIDE_PADDING, paddingTop: 12, paddingBottom: 84, gap: 14 }}
        >
          <HomeHeader greeting={greeting} name={name} photoURL={photoURL} />
            <MotivationQuote/>
            <InputComposer
              uid={uid}
              placeholder="Type Your Message"
              enableMic
              onSessionStarted={(chatId) => navigation.navigate("ChatRoom", { chatId, title: "Therapy Buddy" })}
            />

          <RecentChats
            rows={recentChats}
            onSeeAll={() => navigation.navigate("Chats")}
            onOpen={(c) => navigation.navigate("ChatRoom", { chatId: c.id, title: c.title ?? "Chat" })}
          />

          <JournalCarousel
            notes={notes}
            onCreate={() => navigation.navigate("JournalEdit", { id: null })}
            onOpen={(id) => navigation.navigate("JournalEdit", { id })}
          />
        </ScrollView>

        <BottomNav active="home" onChange={handleTab} />
      </SafeAreaView>

      {ready && showOnboard && <OnboardingOverlay visible onClose={dismissOnboard} />}
    </View>
  );
}
