import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { getAuth, signOut, User } from 'firebase/auth'
import BottomNav from '../components/BottomNav'

export default function ProfileScreen() {
  const navigation = useNavigation()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const auth = getAuth()
    setUser(auth.currentUser || null)
    const unsub = auth.onAuthStateChanged(u => setUser(u))
    return () => unsub()
  }, [])

  const handleTab = (tab: 'home' | 'journal' | 'profile') => {
    if (tab === 'home') navigation.navigate('Home' as never)
    if (tab === 'journal') navigation.navigate('Journal' as never)
    if (tab === 'profile') navigation.navigate('Profile' as never)
  }

  const handleLogout = async () => {
    try {
      await signOut(getAuth())
      navigation.reset({ index: 0, routes: [{ name: 'SignIn' as never }] })
    } catch {}
  }

  return (
    <ImageBackground source={require('../assets/Background.png')} resizeMode="cover" style={styles.bg} imageStyle={styles.bgImage}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          <Text style={styles.title}>Profile</Text>

          <View style={styles.card}>
            <Text style={styles.label}>Name</Text>
            <Text style={styles.value}>{user?.displayName || 'No name set'}</Text>

            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{user?.email || 'No email'}</Text>

            <View style={styles.row}>
              <TouchableOpacity style={styles.btn} onPress={() => {}}>
                <Text style={styles.btnText}>Edit Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                <Text style={styles.logoutText}>Log Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <BottomNav active="profile" onChange={handleTab} />
      </SafeAreaView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  bgImage: { opacity: 1 },
  safe: { flex: 1 },
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
  label: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontWeight: '700'
  },
  value: {
    color: '#FFF',
    fontSize: 16,
    marginBottom: 8
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8
  },
  btn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.25)'
  },
  btnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700'
  },
  logoutBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 77, 77, 0.8)'
  },
  logoutText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800'
  }
})
