import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { ImageBackground, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import ChatPanel from "../components/ChatPanel";
import { maybeOfferAfterUserMessage, respondToSaveOffer, onTitleProvided, onMoodSelected } from "../services/journalFlow";

export default function ChatRoomScreen() {
  const route = useRoute<RouteProp<Record<string, { chatId: string; title?: string }>, string>>();
  const navigation = useNavigation<any>();
  const { chatId, title } = route.params;

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
    <ImageBackground
      source={require("../assets/Background.png")}
      resizeMode="cover"
      style={styles.bg}
      imageStyle={styles.bgImage}
    >
      <SafeAreaView style={styles.safe}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
            hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
          >
            <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.title}>{title ?? "Therapy Buddy"}</Text>
          <View style={{ width: 28 }} />
        </View>

        <View style={styles.outerPad}>
          <View style={styles.panelWrap}>
            <ChatPanel
              chatId={chatId}
              title={title ?? "Therapy Buddy"}
              assistantLabel="Therapy Buddy"
              userLabel="You"
              onAfterUserMessage={handleAfterUserMessage}
              onSaveOffer={handleSaveOffer}
              onTitleProvided={handleTitleProvided}
              onMoodSelected={handleMoodSelected}
            />
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1
  },
  bgImage: {
    opacity: 1
  },
  safe: {
    flex: 1
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 4
  },
  backBtn: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center"
  },
  title: {
    flex: 1,
    fontSize: 22,
    fontWeight: "800",
    color: "#FFF",
    textAlign: "center"
  },
  outerPad: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 12,
    gap: 12
  },
  panelWrap: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.10)",
    borderRadius: 18,
    padding: 10
  }
});
