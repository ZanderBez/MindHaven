// screens/ChatScreen.tsx
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

      if (e?.message === 'HF_TOKEN_MISSING') {
        friendly =
          'Setup issue: missing Hugging Face token. Add EXPO_PUBLIC_HF_TOKEN in .env and restart Expo with cache clear.';
      } else if (e?.message === 'HF_401_UNAUTHORIZED') {
        friendly =
          'Token rejected (401). Double-check your HF token and that “Make calls to Inference Providers” is enabled.';
      } else if (e?.message === 'HF_403_FORBIDDEN') {
        friendly =
          'Forbidden (403). If testing in the web browser, this is likely CORS—run on a device/emulator with Expo Go.';
      } else if (e?.message === 'HF_404_MODEL_NOT_FOUND') {
        friendly =
          'Model not found (404). Check EXPO_PUBLIC_HF_MODEL_ID (e.g., mistralai/Mistral-7B-Instruct-v0.2).'
      } else if (e?.message === 'HF_503_MODEL_LOADING') {
        friendly =
          'Model is loading or busy (503). Give it a moment and try again.';
      } else if (e?.message === 'HF_429_RATE_LIMIT') {
        friendly = 'Rate limit hit (429). Please wait a bit and retry.';
      }

      const errMsg: Msg = { id: makeId(), role: 'assistant', content: friendly };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#0b0b14', padding: 16 }}>
      <FlatList
        data={messages}
        keyExtractor={(m) => m.id}
        renderItem={({ item }) => (
          <MessageBubble role={item.role} content={item.content} />
        )}
      />

      <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
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
            <Text style={{ color: '#fff', fontWeight: '600' }}>Send</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
