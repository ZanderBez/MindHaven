import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { EmailAuthProvider, getAuth, reauthenticateWithCredential, updatePassword } from 'firebase/auth'
import { Feather } from '@expo/vector-icons'

export default function ChangePasswordScreen() {
  const navigation = useNavigation()
  const auth = getAuth()
  const user = auth.currentUser
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [ok, setOk] = useState<string | null>(null)

  useEffect(() => {
    setErr(null)
    setOk(null)
  }, [currentPassword, newPassword, confirmPassword])

  async function onChangePassword() {
    if (!user?.email) return
    if (!currentPassword || !newPassword) {
      setErr('Please fill in all fields')
      return
    }
    if (newPassword.length < 6) {
      setErr('New password must be at least 6 characters')
      return
    }
    if (newPassword !== confirmPassword) {
      setErr('Passwords do not match')
      return
    }
    setSaving(true)
    setErr(null)
    setOk(null)
    try {
      const cred = EmailAuthProvider.credential(user.email, currentPassword)
      await reauthenticateWithCredential(user, cred)
      await updatePassword(user, newPassword)
      setOk('Password updated')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => navigation.goBack(), 600)
    } catch (e: any) {
      setErr(e?.message || 'Could not update password')
    } finally {
      setSaving(false)
    }
  }

  return (
    <ImageBackground
      source={require('../assets/Background.png')}
      resizeMode="cover"
      style={styles.bg}
      imageStyle={styles.bgImage}
    >
      <SafeAreaView style={styles.safe}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.iconBtn}
            hitSlop={styles.hitSlop as any}
          >
            <Feather name="chevron-left" size={28} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.title}>Change Password</Text>
          <View style={styles.headerSpacer} />
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.body}
        >
          <View style={styles.group}>
            <Text style={styles.label}>Current Password</Text>
            <View style={styles.inputRow}>
              <Feather name="lock" size={18} color="#FFFFFF" />
              <TextInput
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Enter current password"
                placeholderTextColor="rgba(255,255,255,0.7)"
                secureTextEntry
                style={styles.input}
              />
            </View>
          </View>

          <View style={styles.group}>
            <Text style={styles.label}>New Password</Text>
            <View style={styles.inputRow}>
              <Feather name="key" size={18} color="#FFFFFF" />
              <TextInput
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Enter new password"
                placeholderTextColor="rgba(255,255,255,0.7)"
                secureTextEntry
                style={styles.input}
              />
            </View>
          </View>

          <View style={styles.group}>
            <Text style={styles.label}>Confirm Password</Text>
            <View style={styles.inputRow}>
              <Feather name="check-circle" size={18} color="#FFFFFF" />
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm new password"
                placeholderTextColor="rgba(255,255,255,0.7)"
                secureTextEntry
                style={styles.input}
              />
            </View>
          </View>

          {err ? <Text style={styles.err}>{err}</Text> : null}
          {ok ? <Text style={styles.ok}>{ok}</Text> : null}

          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={onChangePassword}
            disabled={saving}
            activeOpacity={0.9}
          >
            {saving ? (
              <ActivityIndicator color="#0B0B12" />
            ) : (
              <Text style={styles.primaryText}>Update Password</Text>
            )}
          </TouchableOpacity>
        </KeyboardAvoidingView>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 4
  },
  iconBtn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center'
  },
  hitSlop: {
    top: 10,
    left: 10,
    right: 10,
    bottom: 10
  },
  title: {
    flex: 1,
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center'
  },
  headerSpacer: {
    width: 28,
    height: 28
  },
  body: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12
  },
  group: {
    marginBottom: 14
  },
  label: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    marginBottom: 8,
    fontWeight: '700'
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderRadius: 14,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(255,255,255,0.20)'
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 10
  },
  err: {
    color: '#FFD1D1',
    marginTop: 6
  },
  ok: {
    color: '#C6FFD1',
    marginTop: 6
  },
  primaryBtn: {
    height: 52,
    borderRadius: 16,
    backgroundColor: '#45B7D1',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8
  },
  primaryText: {
    color: '#ffffffff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.2
  }
})
