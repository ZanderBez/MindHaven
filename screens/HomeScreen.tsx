import React, { useEffect, useMemo, useRef, useState } from 'react'
import { ImageBackground, StyleSheet, Text, View, TouchableOpacity, TextInput, Image, ActivityIndicator, FlatList, Dimensions, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Feather } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useNavigation } from '@react-navigation/native'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase'
import { Chat, subscribeUserChats, createNewChatWithBot, sendMessage as sendFsMessage } from '../services/chatService'
import { aiChat } from '../api/ai'
import { Journal, subscribeJournals } from '../services/journalService'
import BottomNav from '../components/BottomNav'
import MotivationQuote from '../components/MotivationQuote'

const { width: SCREEN_W } = Dimensions.get('window')
const CARD_GAP = 16
const SIDE_PADDING = 16
const PEEK = 22
const CARD_W = SCREEN_W - SIDE_PADDING * 2 - PEEK

export default function HomeScreen() {
  const navigation = useNavigation<any>()
  const [uid, setUid] = useState<string | null>(null)
  const [name, setName] = useState<string>('User')
  const [photoURL, setPhotoURL] = useState<string | null>(null)
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [notes, setNotes] = useState<Journal[]>([])
  const [recentChats, setRecentChats] = useState<Chat[]>([])
  const inputRef = useRef<TextInput>(null)

  useEffect(() => {
    const off = onAuthStateChanged(auth, u => {
      setUid(u?.uid ?? null)
      setName(u?.displayName || 'User')
      setPhotoURL(u?.photoURL ?? null)
    })
    return off
  }, [])

  useEffect(() => {
    if (!uid) return
    const offNotes = subscribeJournals(uid, setNotes)
    const offChats = subscribeUserChats(uid, rows => setRecentChats(rows.slice(0, 3)))
    return () => {
      offNotes && offNotes()
      offChats && offChats()
    }
  }, [uid])

  const greeting = useMemo(() => {
    const h = new Date().getHours()
    if (h < 12) return 'Good Morning'
    if (h < 18) return 'Good Afternoon'
    return 'Good Evening'
  }, [])

  function fmt(ts?: any) {
    try {
      if (!ts?.toDate) return ''
      const d = ts.toDate() as Date
      return d.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })
    } catch { return '' }
  }

  async function startSession() {
    const msg = text.trim()
    if (!msg || !uid || sending) return
    setSending(true)
    try {
      const chatId = await createNewChatWithBot(uid)
      await sendFsMessage(chatId, uid, msg)
      const reply = await aiChat(msg, [{ role: 'user', content: msg }])
      await sendFsMessage(chatId, 'therapist-bot', reply)
      setText('')
      navigation.navigate('ChatRoom', { chatId, title: 'Therapy Buddy' })
    } finally {
      setSending(false)
    }
  }

  function openChat(c: Chat) {
    navigation.navigate('ChatRoom', { chatId: c.id, title: c.title ?? 'Chat' })
  }

  const handleTab = (tab: 'home' | 'journal' | 'chats' | 'profile') => {
    if (tab === 'home') navigation.navigate('Home')
    if (tab === 'journal') navigation.navigate('Journal');
    if (tab === 'chats') navigation.navigate('Chats')
    if (tab === 'profile') navigation.navigate('Profile')
  }

  return (
    <ImageBackground source={require('../assets/Background.png')} resizeMode="cover" style={styles.bg} imageStyle={styles.bgImage}>
      <View pointerEvents="none" style={styles.overlay} />
      <SafeAreaView style={styles.safe}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.heroRow}>
            {photoURL ? (
              <Image source={{ uri: photoURL }} style={styles.heroAvatar} />
            ) : (
              <View style={styles.heroAvatarFallback}>
                <Feather name="user" size={28} color="#0B0B12" />
              </View>
            )}
            <View style={styles.heroTextCol}>
              <Text style={styles.heroGreet}>{greeting}</Text>
              <Text style={styles.heroName}>{name}</Text>
            </View>
            <View style={styles.heroSpacer} />
          </View>

          <View style={styles.motivationBlock}>
            <Text style={styles.motivationTitle}>Motivation for you:</Text>
            <MotivationQuote style={styles.motivationQuote} authorStyle={styles.motivationAuthor} numberOfLines={3} />
          </View>

                    <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>Have a Session</Text>
          </View>

          <View style={styles.inputCard}>
            <TextInput
              ref={inputRef}
              value={text}
              onChangeText={setText}
              placeholder="Type Your Message"
              placeholderTextColor="rgba(255,255,255,0.7)"
              style={styles.input}
              multiline={false}
              returnKeyType="send"
              onSubmitEditing={startSession}
            />
            <TouchableOpacity onPress={startSession} style={styles.sendBtn} disabled={!uid || sending || !text.trim()} activeOpacity={0.9}>
              {sending ? <ActivityIndicator color="#FFF" /> : <Feather name="send" size={18} color="#FFF" />}
            </TouchableOpacity>
          </View>

          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>Recent Chats</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Chats')} hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>
          

          {recentChats.length > 0 ? (
            <View style={styles.recentList}>
              {recentChats.map(c => (
                <TouchableOpacity key={c.id} onPress={() => openChat(c)} activeOpacity={0.9} style={styles.recentRow}>
                  <View style={styles.recentLeft}>
                    <View style={styles.recentAvatar}>
                      <Text style={styles.recentAvatarText}>{(c.title?.[0] ?? 'C').toUpperCase()}</Text>
                    </View>
                    <View style={styles.recentTextCol}>
                      <Text style={styles.recentTitle} numberOfLines={1}>{c.title ?? 'Conversation'}</Text>
                      <Text style={styles.recentSub} numberOfLines={1}>{c.lastMessage ?? 'Start the conversation…'}</Text>
                    </View>
                  </View>
                  <Feather name="chevron-right" size={18} color="#FFF" />
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <TouchableOpacity onPress={() => navigation.navigate('Chats')} activeOpacity={0.9} style={styles.recentEmpty}>
              <Feather name="message-circle" size={18} color="#FFFFFF" />
              <Text style={styles.recentEmptyText}>No recent chats — start one</Text>
            </TouchableOpacity>
          )}

          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>Journal</Text>
          </View>

          <FlatList
            horizontal
            data={notes}
            keyExtractor={(it) => it.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carouselContent}
            snapToInterval={CARD_W + CARD_GAP}
            decelerationRate="fast"
            pagingEnabled={false}
            ListEmptyComponent={
              <TouchableOpacity activeOpacity={0.9} onPress={() => navigation.navigate('JournalEdit', { id: null })} style={[styles.card, styles.cardEmpty, { width: CARD_W }]}>
                <Feather name="plus" size={18} color="#FFFFFF" />
                <Text style={styles.cardText}>Create your first Journal</Text>
              </TouchableOpacity>
            }
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={[styles.card, { width: CARD_W }, index === 0 && styles.cardFirst]}
                activeOpacity={0.9}
                onPress={() => navigation.navigate('JournalEdit', { id: item.id })}
              >
                <View style={styles.noteTop}>
                  <Text style={styles.noteTitle} numberOfLines={1}>{item.title || 'Untitled'} {item.mood ? ` ${item.mood}` : ''}</Text>
                  <Text style={styles.noteDate}>{fmt(item.createdAt)}</Text>
                </View>
                <Text style={styles.notePreview} numberOfLines={3}>{item.body || ''}</Text>
              </TouchableOpacity>
            )}
          />
        </ScrollView>

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
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(8,12,20,0.35)'
  },
  safe: {
    flex: 1
  },
  scrollContent: {
    paddingHorizontal: SIDE_PADDING,
    paddingTop: 12,
    paddingBottom: 84,
    gap: 14
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14
  },
  heroAvatar: {
    width: 78,
    height: 78,
    borderRadius: 39,
    borderWidth: 3,
    borderColor: '#7AD7FF'
  },
  heroAvatarFallback: {
    width: 78,
    height: 78,
    borderRadius: 39,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffffff'
  },
  heroTextCol: {
    flex: 1
  },
  heroGreet: {
    color: '#FFFFFF',
    opacity: 0.95,
    fontSize: 18,
    fontWeight: '700'
  },
  heroName: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '900',
    lineHeight: 34
  },
  heroSpacer: {
    width: 24,
    height: 24
  },
  motivationBlock: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 6
  },
  motivationTitle: {
    color: '#ffffffff',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  motivationQuote: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    opacity: 0.95,
    marginTop: 2,
    marginLeft: 2,
    fontStyle: 'italic'
  },
  motivationAuthor: {
    color: '#FFFFFF',
    fontSize: 13,
    opacity: 0.9,
    marginTop: 4
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  seeAll: {
    color: '#7AD7FF',
    fontWeight: '800',
    fontSize: 13
  },
  recentList: {
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)'
  },
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12
  },
  recentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1
  },
  recentAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  recentAvatarText: {
    color: '#111',
    fontWeight: '900'
  },
  recentTextCol: {
    flex: 1
  },
  recentTitle: {
    color: '#FFFFFF',
    fontWeight: '900'
  },
  recentSub: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginTop: 2
  },
  recentEmpty: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 12,
    paddingVertical: 12
  },
  recentEmptyText: {
    color: '#FFFFFF',
    fontWeight: '800'
  },
  inputCard: {
    height: 50,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.22)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 14,
    paddingRight: 6
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.30)'
  },
  carouselContent: {
    paddingVertical: 4,
    paddingRight: SIDE_PADDING
  },
  card: {
    height: 200,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.16)',
    padding: 14,
    marginRight: CARD_GAP
  },
  cardFirst: {
    marginLeft: 2
  },
  cardEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10
  },
  cardText: {
    color: '#FFFFFF',
    fontWeight: '800'
  },
  noteTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  noteTitle: {
    color: '#FFFFFF',
    fontSize: 25,
    fontWeight: '900',
    maxWidth: '70%'
  },
  noteDate: {
    color: '#FFFFFF',
    opacity: 0.85,
    fontSize: 12,
    fontWeight: '700'
  },
  notePreview: {
    color: '#FFFFFF',
    opacity: 0.95
  },
})
