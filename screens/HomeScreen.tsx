import React, { useEffect, useRef, useState } from 'react'
import { ImageBackground, StyleSheet, Text, View, TouchableOpacity, Animated, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Feather } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import MoodHeader from '../components/MoodHeader'
import ChatPanel, { ChatPanelRef } from '../components/ChatPanel'
import BottomNav from '../components/BottomNav'

export default function HomeScreen() {
  const [collapsed, setCollapsed] = useState(false)
  const anim = useRef(new Animated.Value(1)).current
  const navigation = useNavigation()
  const chatRef = useRef<ChatPanelRef>(null)
  const EXPANDED_HEADER = 208
  const KEYBOARD_BASE_OFFSET = 120
  const keyboardOffset = collapsed ? KEYBOARD_BASE_OFFSET : KEYBOARD_BASE_OFFSET + EXPANDED_HEADER

  useEffect(() => {
    Animated.timing(anim, {
      toValue: collapsed ? 0 : 1,
      duration: 260,
      useNativeDriver: false
    }).start(({ finished }) => {
      if (finished && collapsed) {
        setTimeout(() => chatRef.current?.focusInput(), 40)
      }
    })
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

  const handleTab = (tab: 'home' | 'journal' | 'profile') => {
    if (tab === 'home') navigation.navigate('Home' as never)
    if (tab === 'journal') navigation.navigate('Journal' as never)
    if (tab === 'profile') navigation.navigate('Profile' as never)
  }

  return (
    <ImageBackground source={require('../assets/Background.png')} resizeMode="cover" style={styles.bg} imageStyle={styles.bgImage}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.outerPadding}>
          {collapsed && (
            <View style={styles.topBar}>
              <TouchableOpacity onPress={() => setCollapsed(false)} style={styles.backBtn}>
                <Feather name="chevron-left" size={22} color="#FFF" />
              </TouchableOpacity>
              <Text style={styles.appTitle}>MindHaven</Text>
              <View style={styles.topRight} />
            </View>
          )}

          {!collapsed && (
            <View style={styles.logoWrap}>
              <Image source={require('../assets/MindHavenLogoB.png')} style={styles.logo} resizeMode="contain" />
            </View>
          )}

          <Animated.View style={{ height: headerHeight, opacity: headerOpacity, marginBottom: headerMargin, overflow: 'hidden' }}>
            <MoodHeader onPressStart={() => setCollapsed(true)} />
          </Animated.View>

          <View style={styles.panelWrap}>
            <ChatPanel
              ref={chatRef}
              isCollapsed={collapsed}
              onRequestCollapse={() => setCollapsed(true)}
              keyboardOffset={keyboardOffset}
              title="Therapy Buddy"
              assistantLabel="Therapy Buddy"
              userLabel="You"
            />
          </View>
        </View>
        <BottomNav active="home" onChange={handleTab} />
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
    flex: 1
  },
  outerPadding: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 72,
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
    backgroundColor: 'rgba(255,255,255,0.18)'
  },
  appTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.4,
    color: '#FFF'
  },
  topRight: {
    width: 36,
    height: 36
  },
  logoWrap: {
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8
  },
  logo: {
    width: 240,
    height: 70
  },
  panelWrap: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.10)',
    borderRadius: 18,
    padding: 10
  }
})