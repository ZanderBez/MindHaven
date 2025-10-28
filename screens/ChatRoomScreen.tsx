import { useRoute, RouteProp } from "@react-navigation/native";
import { ImageBackground, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ChatPanel from "../components/ChatPanel";

export default function ChatRoomScreen() {
  const route = useRoute<RouteProp<Record<string, { chatId: string; title?: string }>, string>>();
  const { chatId, title } = route.params;
  return (
    <ImageBackground source={require("../assets/Background.png")} resizeMode="cover" style={styles.bg} imageStyle={styles.bgImage}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.outerPad}>
          <View style={styles.panelWrap}>
            <ChatPanel chatId={chatId} title={title ?? "Therapy Buddy"} assistantLabel="Therapy Buddy" userLabel="You" />
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
  outerPad: { 
    flex: 1, 
    paddingHorizontal: 16, 
    paddingTop: 12, 
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
