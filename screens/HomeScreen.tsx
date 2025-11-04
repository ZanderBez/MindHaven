import React, { useMemo } from "react";
import { View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import GlobalBackground from "../components/GlobalBackground";
import BottomNav from "../components/BottomNav";
import HomeHeader from "../components/HomeHeader";
import InputComposer from "../components/InputComposer";
import RecentChats from "../components/RecentChats";
import JournalCarousel from "../components/JournalCarousel";
import { useAuthUser } from "../hooks/useAuthUser";
import { useHomeStreams } from "../hooks/useHomeStreams";
import { styles } from "../styles/home";
import { SIDE_PADDING } from "../utils/layout";

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const { uid, name, photoURL } = useAuthUser();
  const { notes, recentChats } = useHomeStreams(uid);

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning";
    if (h < 18) return "Good Afternoon";
    return "Good Evening";
  }, []);

  const handleTab = (tab: "home" | "journal" | "chats" | "profile") => {
    if (tab === "home") navigation.navigate("Home");
    if (tab === "journal") navigation.navigate("Journal");
    if (tab === "chats") navigation.navigate("Chats");
    if (tab === "profile") navigation.navigate("Profile");
  };

  return (
    <View style={{ flex: 1 }}>
      <GlobalBackground />
      <View pointerEvents="none" style={styles.overlay} />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: SIDE_PADDING, paddingTop: 12, paddingBottom: 84, gap: 14 }}
        >
          <HomeHeader greeting={greeting} name={name} photoURL={photoURL} />
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
    </View>
  );
}
