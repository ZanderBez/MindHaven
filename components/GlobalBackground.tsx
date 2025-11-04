import React from "react";
import { ImageBackground, StyleSheet, View } from "react-native";

const BG = require("../assets/Background.png");

export default function GlobalBackground() {
  return (
    <View style={StyleSheet.absoluteFill}>
      <ImageBackground
        source={BG}
        resizeMode="cover"
        style={StyleSheet.absoluteFillObject}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
