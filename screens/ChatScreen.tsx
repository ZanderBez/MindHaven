import React, { useState } from 'react';
import {View, TextInput, TouchableOpacity, ActivityIndicator, FlatList, Text,} from 'react-native';
import { aiChat } from '../api/ai'
import MessageBubble from '../components/MessageBubble';

type Msg = { id: string; role: 'user' | 'assistant'; content: string };
const makeId = () => `${Date.now()}_${Math.floor(Math.random() * 1e6)}`;

export default function ChatScreen() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: 'w1',
      role: 'assistant',
      content: 'Hi, I’m here with you. What’s on your mind today?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setInput('');
    const userMsg: Msg = { id: makeId(), role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);

    setLoading(true);
    try {
      const reply = await aiChat(
        text,
        messages.map(({ role, content }) => ({ role, content }))
    );
      const botMsg: Msg = { id: makeId(), role: 'assistant', content: reply };
      setMessages((prev) => [...prev, botMsg]);
    } catch (e: any) {
      let friendly =
        "Sorry—I'm having trouble replying right now. I'm still here with you.";
      const errMsg: Msg = { id: makeId(), role: 'assistant', content: friendly };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, 
    backgroundColor: '#0b0b14', 
    padding: 16 
    }}>
      <FlatList
        data={messages}
        keyExtractor={(m) => m.id}
        renderItem={({ item }) => (
          <MessageBubble role={item.role} content={item.content} />
        )}
      />

      <View style={{ 
        flexDirection: 'row', 
        gap: 8, 
        marginTop: 8 
        }}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Say anything. I’m here."
          placeholderTextColor="#8e92a7"
          style={{
            flex: 1,
            backgroundColor: '#1c2030',
            color: '#fff',
            paddingHorizontal: 12,
            paddingVertical: 14,
            borderRadius: 12,
          }}
          onSubmitEditing={send}
          returnKeyType="send"
        />
        <TouchableOpacity
          onPress={send}
          style={{
            backgroundColor: '#4c5cff',
            paddingHorizontal: 16,
            borderRadius: 12,
            justifyContent: 'center',
          }}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{ 
              color: '#fff', 
              fontWeight: '600' 
            }}>Send</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
