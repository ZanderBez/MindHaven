import React from "react"
import { ImageBackground, StyleSheet, View, StatusBar } from "react-native"
import { useVideoPlayer, VideoView } from "expo-video"
import { useEventListener } from "expo"
import { useEvent } from "expo"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"

const SplashScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>()

  const player = useVideoPlayer(require("../assets/MindHavenLogo.mp4"), (p) => {
    p.loop = false
    p.play()
  })

  const ended = useEvent(player, "playToEnd")

   useEventListener(player, "playToEnd", () => {
    navigation.replace("SignUp")
  })

  return (
    <ImageBackground source={require("../assets/Background.png")} style={styles.container} resizeMode="cover">
      <StatusBar hidden />
      <View style={styles.videoWrap} pointerEvents="none">
        <VideoView
          player={player}
          style={styles.video}
          contentFit="cover"
          nativeControls={false}
          fullscreenOptions={{ enable: false }}
        />
      </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#000" 
},
  videoWrap: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center" 
},
  video: { 
    width: "100%", 
    height: "100%" 
}
})

export default SplashScreen
