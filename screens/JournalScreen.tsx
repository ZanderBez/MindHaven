import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, KeyboardAvoidingView, Platform } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'

export default function JournalScreen() {
  const navigation = useNavigation()
  const [note, setNote] = useState('')

  const handleTab = (tab: 'home' | 'chats' | 'profile') => {
    if (tab === 'home') navigation.navigate('Home' as never)
    if (tab === 'chats') navigation.navigate('Chats' as never)
    if (tab === 'profile') navigation.navigate('Profile' as never)
  }

  return (
    <ImageBackground
      source={require('../assets/Background.png')}
      resizeMode="cover"
      style={styles.bg}
      imageStyle={styles.bgImage}
    >
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          <Text style={styles.title}>Journal</Text>

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={80}
          >
            <View style={styles.card}>
              <TextInput
                style={styles.input}
                value={note}
                onChangeText={setNote}
                placeholder="Write your thoughts..."
                placeholderTextColor="rgba(255,255,255,0.7)"
                multiline
                textAlignVertical="top"
              />
              <TouchableOpacity style={styles.btn}>
                <Text style={styles.btnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
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
    flex: 1
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 72,
    gap: 12
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFF',
    textAlign: 'center'
  },
  card: {
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.12)',
    padding: 12,
    gap: 10
  },
  input: {
    minHeight: 180,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: 'rgba(255,255,255,0.10)',
    color: '#FFF'
  },
  btn: {
    alignSelf: 'flex-end',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.25)'
  },
  btnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700'
  }
})
