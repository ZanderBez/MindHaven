import React, { useEffect, useMemo, useState } from 'react'
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, TextInput, FlatList, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { Feather } from '@expo/vector-icons'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase'
import { Journal, subscribeJournals } from '../services/journalService'

export default function JournalListScreen() {
  const navigation = useNavigation<any>()
  const [uid, setUid] = useState<string | null>(null)
  const [photoURL, setPhotoURL] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [rows, setRows] = useState<Journal[]>([])

  useEffect(() => {
    const off = onAuthStateChanged(auth, u => {
      setUid(u?.uid ?? null)
      setPhotoURL(u?.photoURL ?? null)
    })
    return off
  }, [])

  useEffect(() => {
    if (!uid) return
    const off = subscribeJournals(uid, setRows)
    return off
  }, [uid])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return rows
    return rows.filter(r => (r.title || '').toLowerCase().includes(q) || (r.body || '').toLowerCase().includes(q))
  }, [rows, query])

  function openNote(n: Journal) {
    navigation.navigate('JournalEdit', { id: n.id })
  }

  function newNote() {
    navigation.navigate('JournalEdit', { id: null })
  }

  function fmt(ts?: any) {
    try {
      if (!ts?.toDate) return ''
      const d = ts.toDate() as Date
      return d.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })
    } catch { return '' }
  }

  const renderItem = ({ item }: { item: Journal }) => (
    <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={() => openNote(item)}>
      <View style={styles.cardTop}>
        <Text style={styles.cardTitle}>
          {item.title || 'Untitled'} <Text>{item.mood || ''}</Text>
        </Text>
        <Text style={styles.cardDate}>{fmt(item.createdAt)}</Text>
      </View>
      <Text style={styles.cardPreview} numberOfLines={2}>{item.body || ''}</Text>
      <View style={styles.chevWrap}>
        <Feather name="chevron-right" size={18} color="#FFFFFF" />
      </View>
    </TouchableOpacity>
  )

  return (
    <ImageBackground source={require('../assets/Background.png')} resizeMode="cover" style={styles.bg} imageStyle={styles.bgImage}>
      <View pointerEvents="none" style={styles.overlay} />
      <SafeAreaView style={styles.safe}>
        <View style={styles.topRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Feather name="chevron-left" size={26} color="#FFFFFF" />
          </TouchableOpacity>
          {photoURL ? (
            <Image source={{ uri: photoURL }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarFallback}>
              <Feather name="user" size={16} color="#0B0B12" />
            </View>
          )}
        </View>

        <Text style={styles.heading}>Your Notes</Text>

        <View style={styles.searchRow}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search notes"
            placeholderTextColor="rgba(255,255,255,0.85)"
            style={styles.searchInput}
          />
          <Feather name="search" size={18} color="#FFFFFF" />
        </View>

        <FlatList
          data={filtered}
          keyExtractor={i => i.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />

        <TouchableOpacity onPress={newNote} activeOpacity={0.9} style={styles.fab}>
          <Feather name="book" size={18} color="#FFFFFF" />
          <Text style={styles.fabPlus}>+</Text>
        </TouchableOpacity>
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
  topRow: {
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
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#7AD7FF'
  },
  avatarFallback: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7AD7FF'
  },

  heading: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 6,
    marginLeft: 16
  },

  searchRow: {
    margin: 16,
    height: 48,
    borderRadius: 14,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(255,255,255,0.18)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    marginRight: 10
  },

  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 12
  },
  card: {
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.18)',
    padding: 14
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900'
  },
  cardDate: {
    color: '#FFFFFF',
    opacity: 0.85,
    fontSize: 12,
    fontWeight: '700'
  },
  cardPreview: {
    color: '#FFFFFF',
    opacity: 0.95,
    marginTop: 8
  },
  chevWrap: {
    position: 'absolute',
    right: 10,
    bottom: 7,
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.20)'
  },

  fab: {
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#45B7D1',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6
  },
  fabPlus: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900'
  }
})
