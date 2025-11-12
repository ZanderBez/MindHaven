import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GlobalBackground from "../components/GlobalBackground";
import ChatPanel from "../components/ChatPanel";
import { maybeOfferAfterUserMessage, respondToSaveOffer, onTitleProvided, onMoodSelected } from "../services/journalFlow";
import { styles } from "../styles/chatRoom";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function ChatRoomScreen() {
  const route = useRoute<RouteProp<Record<string, { chatId: string; title?: string }>, string>>();
  const navigation = useNavigation<any>();
  const { chatId, title } = route.params;
  const [buddyName, setBuddyName] = useState(title ?? "Therapy Buddy");

  useEffect(() => {
    const fetchBuddyName = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          if (data.buddyName) {
            setBuddyName(data.buddyName);
            navigation.setOptions({ title: data.buddyName });
          }
        }
      }
    };
    fetchBuddyName();
  }, [navigation]);

  const handleAfterUserMessage = async (text: string) => {
    await maybeOfferAfterUserMessage(chatId, text);
  };

  const handleSaveOffer = async (choice: "Save" | "Not now") => {
    await respondToSaveOffer(chatId, choice);
  };

  const handleTitleProvided = async (t: string) => {
    await onTitleProvided(chatId, t);
  };

  const handleMoodSelected = async (mood: number) => {
    await onMoodSelected(chatId, mood);
  };

  return (
    <View style={styles.bg}>
      <GlobalBackground />
      <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
        <View style={styles.outerPad}>
          <View style={styles.panelWrap}>
            <ChatPanel
              chatId={chatId}
              title={buddyName}
              assistantLabel={buddyName}
              userLabel="You"
              onAfterUserMessage={handleAfterUserMessage}
              onSaveOffer={handleSaveOffer}
              onTitleProvided={handleTitleProvided}
              onMoodSelected={handleMoodSelected}
              onBack={() => navigation.goBack()}
            />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
