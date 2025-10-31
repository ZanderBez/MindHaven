import React, { useEffect, useMemo, useState } from 'react'
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Alert, TouchableWithoutFeedback, Keyboard, ToastAndroid } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'
import { Feather } from '@expo/vector-icons'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, db } from '../firebase'
import { deleteJournal, updateJournal, createJournal } from '../services/journalService'
import { doc, getDoc } from 'firebase/firestore'
import * as Haptics from 'expo-haptics'
import AsyncStorage from '@react-native-async-storage/async-storage'

const EMOJI = ['😀','🙂','😐','😕','😢','😡','😴','😰','😌','🥳']

type Params = { id: string | null }

export default function JournalEditScreen() {
  const navigation = useNavigation<any>()
  const route = useRoute<RouteProp<Record<string, Params>, string>>()
  const id = route.params?.id ?? null
  const isNew = !id

  const [uid, setUid] = useState<string | null>(null)
  const [mood, setMood] = useState('🙂')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [editable, setEditable] = useState(isNew)
  const [saving, setSaving] = useState(false)
  const [typing, setTyping] = useState(false)

  useEffect(() => {
    const off = onAuthStateChanged(auth, u => setUid(u?.uid ?? null))
    return off
  }, [])

  useEffect(() => {
    if (!uid || !id) return
    ;(async () => {
      const snap = await getDoc(doc(db, 'users', uid, 'journals', id))
      const data = snap.data() as any
      setMood(data?.mood || '🙂')
      setTitle(data?.title || '')
      setBody(data?.body || '')
      setEditable(false)
    })()
  }, [uid, id])

  useEffect(() => {
    (async () => {
      if (!isNew) return
      try {
        const last = await AsyncStorage.getItem('last_mood')
        if (last) setMood(last)
      } catch {}
    })()
  }, [isNew])

  const canSave = useMemo(
    () => (title.trim().length > 0 || body.trim().length > 0) && !!uid && !saving,
    [title, body, uid, saving]
  )

  function notify(msg: string) {
    if (Platform.OS === 'android') ToastAndroid.show(msg, ToastAndroid.SHORT)
    else Alert.alert(msg)
  }

  async function saveLastMood(m: string) {
    try { await AsyncStorage.setItem('last_mood', m) } catch {}
  }

  async function onSave() {
    if (!uid || !canSave) return
    try {
      setSaving(true)
      let newId: string | undefined = id ?? undefined
      if (isNew) {
        const createdId = await createJournal(uid, { title: title.trim(), body: body.trim(), mood })
        if (typeof createdId === 'string') newId = createdId
      } else {
        await updateJournal(uid, id!, { title: title.trim(), body: body.trim(), mood })
      }
      await saveLastMood(mood)
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      notify('Saved to Journal')
      navigation.reset({
        index: 0,
        routes: [{ name: 'Journal' as never, params: { focusId: newId ?? undefined } as never }]
      })
    } finally {
      setSaving(false)
    }
  }

  async function onDelete() {
    if (!uid || !id) return
    Alert.alert('Delete note?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteJournal(uid, id)
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
          notify('Deleted')
          navigation.reset({ index: 0, routes: [{ name: 'Journal' as never }] })
        }
      }
    ])
  }

  const dismissIfTyping = () => {
    if (typing) {
      Keyboard.dismiss()
      setTyping(false)
    }
  }

  return (
    <ImageBackground source={require('../assets/Background.png')} resizeMode="cover" style={styles.bg} imageStyle={styles.bgImage}>
      <View pointerEvents="none" style={styles.baseOverlay} />
      {typing && <View pointerEvents="none" style={styles.typingOverlay} />}

      <SafeAreaView style={styles.safe}>
        <TouchableWithoutFeedback onPress={dismissIfTyping}>
          <View style={{ flex: 1 }}>
            <View style={styles.headerRow}>
              <TouchableOpacity onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Journal' as never }] })} style={styles.backBtn}>
                <Feather name="chevron-left" size={26} color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>All Notes</Text>
              <View style={styles.headerSpacer} />
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.body}>
              <Text style={styles.label}>Mood :</Text>
              <View style={styles.moodRow}>
                {EMOJI.map(e => (
                  <TouchableOpacity key={e} style={[styles.moodBtn, mood === e && styles.moodActive]} onPress={() => editable && setMood(e)} activeOpacity={0.8}>
                    <Text style={styles.moodText}>{e}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Title</Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="Title"
                placeholderTextColor="rgba(255,255,255,0.7)"
                style={[styles.titleInput, typing && styles.inputFocused]}
                editable={editable}
                onFocus={() => setTyping(true)}
                onBlur={() => setTyping(false)}
              />

              <Text style={styles.label}>Description</Text>
              <TextInput
                value={body}
                onChangeText={setBody}
                placeholder="Write here…"
                placeholderTextColor="rgba(255,255,255,0.7)"
                style={[styles.descInput, typing && styles.inputFocused]}
                editable={editable}
                multiline
                textAlignVertical="top"
                onFocus={() => setTyping(true)}
                onBlur={() => setTyping(false)}
              />

              <View style={styles.actionsRow}>
                {!isNew && (
                  <TouchableOpacity style={styles.editBtn} onPress={() => setEditable(v => !v)} disabled={saving}>
                    <Text style={styles.editText}>{editable ? 'Cancel' : 'Edit'}</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={[styles.saveBtn, !canSave && { opacity: 0.7 }]} onPress={onSave} disabled={!canSave}>
                  <Text style={styles.saveText}>{isNew ? 'Save' : (saving ? 'Saving…' : 'Save')}</Text>
                </TouchableOpacity>
              </View>

              {!isNew && (
                <TouchableOpacity style={styles.deleteBtn} onPress={onDelete} disabled={saving}>
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
              )}
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
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
  baseOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(8,12,20,0.20)'
  },
  typingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(8,12,20,0.28)'
  },
  safe: {
    flex: 1
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingTop: 4
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800'
  },
  headerSpacer: {
    width: 36,
    height: 36
  },
  body: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8
  },
  label: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 8,
    marginTop: 8
  },
  moodRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 6
  },
  moodBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)'
  },
  moodActive: {
    backgroundColor: 'rgba(255,255,255,0.28)'
  },
  moodText: {
    fontSize: 20
  },
  titleInput: {
    height: 48,
    borderRadius: 14,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(255,255,255,0.18)',
    color: '#FFFFFF'
  },
  descInput: {
    minHeight: 220,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: 'rgba(255,255,255,0.18)',
    color: '#FFFFFF',
    marginTop: 8
  },
  inputFocused: {
    backgroundColor: 'rgba(255,255,255,0.22)'
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 16
  },
  editBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.20)'
  },
  editText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800'
  },
  saveBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#45B7D1'
  },
  saveText: {
    color: '#ffffffff',
    fontSize: 15,
    fontWeight: '900'
  },
  deleteBtn: {
    marginTop: 12,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 77, 77, 0.9)'
  },
  deleteText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900'
  }
})
