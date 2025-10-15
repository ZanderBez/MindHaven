import React, { useMemo, useRef, useState } from 'react'
import { SafeAreaView, View, Animated, StyleSheet, ImageBackground, TouchableOpacity, Text, Image, Platform, StatusBar } from 'react-native'
import { Feather } from '@expo/vector-icons'
import MoodHeader from '../components/MoodHeader'
import ChatPanel from '../components/ChatPanel'

export default function HomeScreen() {
  const [collapsed, setCollapsed] = useState(false)
  const anim = useRef(new Animated.Value(1)).current

  useMemo(() => {
    Animated.timing(anim, {
      toValue: collapsed ? 0 : 1,
      duration: 260,
      useNativeDriver: false
    }).start()
  }, [collapsed])

  const headerHeight = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 208]
  })
  const headerOpacity = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1]
  })
  const headerMargin = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 16]
  })

  return (
    <ImageBackground
      source={require('../assets/Background.png')}
      resizeMode="cover"
      style={styles.bg}
      imageStyle={styles.bgImage}
    >
      <SafeAreaView style={styles.safe}>
        <View style={styles.outerPadding}>
          {collapsed && (
            <View style={styles.topBar}>
              <TouchableOpacity onPress={() => setCollapsed(false)} style={styles.backBtn}>
                <Feather name="chevron-left" size={22} />
              </TouchableOpacity>
              <Text style={styles.appTitle}>MindHaven</Text>
              <View style={styles.topRight} />
            </View>
          )}

          {!collapsed && (
            <View style={styles.logoWrap}>
              <Image
                source={require('../assets/mindhaven-logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
          )}

          <Animated.View
            style={{
              height: headerHeight,
              opacity: headerOpacity,
              marginBottom: headerMargin,
              overflow: 'hidden'
            }}
          >
            <MoodHeader onPressStart={() => setCollapsed(true)} />
          </Animated.View>

          <View style={styles.panelWrap}>
            <ChatPanel
              onInputFocus={() => setCollapsed(true)}
              title="MindHaven AI"
              assistantLabel="CalmPath AI"
              userLabel="You"
            />
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  bg: {
    flex: 1
  },
  bgImage: {
    opacity: 1
  },
  safe: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 0
  },
  outerPadding: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    gap: 12
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.20)'
  },
  appTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.4
  },
  topRight: {
    width: 36,
    height: 36
  },
  logoWrap: {
    width: '100%',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 6
  },
  logo: {
    width: 180,
    height: 40
  },
  panelWrap: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.10)',
    borderRadius: 18,
    padding: 10
  }
})
