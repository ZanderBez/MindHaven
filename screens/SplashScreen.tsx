import React, { useEffect, useRef } from "react"
import { ImageBackground, StyleSheet, View, StatusBar } from "react-native"
import { Video, ResizeMode } from "expo-av"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"

const SplashScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>()
  const videoRef = useRef<Video>(null)

  useEffect(() => {
    const play = async () => {
      try { await videoRef.current?.playAsync() } catch {}
    }
    play()
  }, [])

  const onStatusUpdate = (status: any) => {
    if (status?.isLoaded && status.didJustFinish) {
      navigation.replace("SignUp")
    }
  }

  return (
    <ImageBackground source={require("../assets/Background.png")} style={styles.container} resizeMode="cover">
      <StatusBar hidden />
      <View style={styles.videoWrap}>
        <Video
          ref={videoRef}
          source={require("../assets/MindHavenLogo.mp4")}
          style={styles.video}
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay
          isLooping={false}
          onPlaybackStatusUpdate={onStatusUpdate}
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
