import React, { useCallback, useRef, useState } from 'react'
import { View, TextInput, TouchableOpacity, FlatList, Text, StyleSheet, ActivityIndicator } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { aiChat } from '../api/ai'

type Msg = { id: string; role: 'user' | 'assistant'; content: string }

type Props = {
  onInputFocus?: () => void
  title?: string
  assistantLabel?: string
  userLabel?: string
}

const makeId = () => `${Date.now()}_${Math.floor(Math.random() * 1e6)}`

export default function ChatPanel({ onInputFocus, title = 'Therapy Buddy', assistantLabel = 'CalmPath AI', userLabel = 'You' }: Props) {
  const [messages, setMessages] = useState<Msg[]>([
    { id: 'w1', role: 'assistant', content: 'What do you want to talk about today?' }
  ])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const listRef = useRef<FlatList<Msg>>(null)

  const scrollToEnd = useCallback(() => {
    requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }))
  }, [])

  const onSend = useCallback(async () => {
    const text = input.trim()
    if (!text || sending) return

    const userMsg: Msg = { id: makeId(), role: 'user', content: text }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setSending(true)
    scrollToEnd()

    try {
      const history = messages.concat(userMsg).map(m => ({ role: m.role, content: m.content }))
      const reply = await aiChat(text, history)
      const assistantMsg: Msg = { id: makeId(), role: 'assistant', content: reply }
      setMessages(prev => [...prev, assistantMsg])
      scrollToEnd()
    } catch {
      const assistantMsg: Msg = { id: makeId(), role: 'assistant', content: 'Sorry, I am having trouble replying right now.' }
      setMessages(prev => [...prev, assistantMsg])
      scrollToEnd()
    } finally {
      setSending(false)
    }
  }, [input, sending, messages, scrollToEnd])

  const renderItem = ({ item }: { item: Msg }) => {
    const isUser = item.role === 'user'
    return (
      <View style={[styles.msgWrap, isUser ? styles.right : styles.left]}>
        <View style={[styles.bubble, isUser ? styles.userBubble : styles.botBubble]}>
          <Text style={[styles.label, isUser ? styles.userLabel : styles.botLabel]}>
            {isUser ? `${userLabel}:` : `${assistantLabel}:`}
          </Text>
          <Text style={styles.bubbleText}>{item.content}</Text>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <View style={styles.titlePill}>
          <Text style={styles.titleText}>{title}</Text>
        </View>
      </View>

      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(m) => m.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        onContentSizeChange={scrollToEnd}
      />

      <View style={styles.inputCard}>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Type Your Message"
            onFocus={onInputFocus}
            multiline
          />
          <TouchableOpacity onPress={onSend} style={styles.sendBtn} disabled={sending}>
            {sending ? <ActivityIndicator /> : <Feather name="send" size={18} />}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  titleRow: {
    paddingHorizontal: 6,
    paddingTop: 6,
    paddingBottom: 10,
    alignItems: 'center'
  },
  titlePill: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.18)'
  },
  titleText: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.3,
    color: '#FFF'
  },
  listContent: {
    paddingHorizontal: 8,
    paddingTop: 4,
    paddingBottom: 12,
    gap: 10
  },
  msgWrap: {
    width: '100%',
    paddingHorizontal: 4
  },
  left: {
    alignItems: 'flex-start'
  },
  right: {
    alignItems: 'flex-end'
  },
  bubble: {
    maxWidth: '88%',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10
  },
  botBubble: {
    backgroundColor: 'rgba(255,255,255,0.22)'
  },
  userBubble: {
    backgroundColor: 'rgba(0,0,0,0.45)'
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#FFF'
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
    color: '#FFF'
  },
  botLabel: {
    opacity: 0.9
  },
  userLabel: {
    opacity: 0.95
  },
  inputCard: {
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.16)',
    padding: 8,
    marginTop: 8
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 140,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)'
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.25)'
  }
})
