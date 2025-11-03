import React from "react"
import { ImageBackground, StyleSheet } from "react-native"

const BG = require("../assets/Background.png")

export default function GlobalBackground() {
  return <ImageBackground source={BG} resizeMode="cover" style={styles.bg} />
}

const styles = StyleSheet.create({
  bg: { ...StyleSheet.absoluteFillObject }
})