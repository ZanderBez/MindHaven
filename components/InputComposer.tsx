import React, { useRef, useState } from "react";
import { View, TextInput, TouchableOpacity, ActivityIndicator, Text, Animated } from "react-native";
import { Feather } from "@expo/vector-icons";
import { styles } from "../styles/home";
import { useSTTRecorder } from "../hooks/useSTTRecorder";
import { startSession } from "../services//sessionService";

interface Props {
  uid: string | null;
  placeholder?: string;
  enableMic?: boolean;
  onSendDone?: () => void;
  defaultValue?: string;
  onSendOverride?: (msg: string) => Promise<void>;
  onSessionStarted?: (chatId: string) => void;
}

export default function InputComposer({
  uid,
  placeholder = "Type Your Message",
  enableMic = true,
  onSendDone,
  defaultValue = "",
  onSendOverride,
  onSessionStarted,
}: Props) {
  const inputRef = useRef<TextInput>(null);
  const [text, setText] = useState(defaultValue);
  const [sending, setSending] = useState(false);

  const { recording, transcribing, mm, ss, scale, opacity, onMicDown, onMicUp, canUseMic } =
    useSTTRecorder({
      onTranscript: async (clean) => {
        if (!clean || !uid || sending) return;
        setSending(true);
        try {
          if (onSendOverride) {
            await onSendOverride(clean);
          } else {
            const chatId = await startSession(uid, clean);
            onSessionStarted?.(chatId);
          }
          setText("");
          onSendDone?.();
        } finally {
          setSending(false);
        }
      },
    });

  const onSend = async () => {
    const msg = text.trim();
    if (!msg || !uid || sending) return;
    setSending(true);
    try {
      if (onSendOverride) {
        await onSendOverride(msg);
      } else {
        const chatId = await startSession(uid, msg);
        onSessionStarted?.(chatId);
      }
      setText("");
      onSendDone?.();
    } finally {
      setSending(false);
    }
  };

  const showMic = enableMic && canUseMic && text.trim().length === 0 && !sending && !transcribing;

  return (
    <>
      <View style={styles.sectionTitleRow}>
        <Text style={styles.sectionTitle}>Have a Session</Text>
      </View>

      <View style={styles.inputCard}>
        <TextInput
          ref={inputRef}
          value={text}
          onChangeText={setText}
          placeholder={placeholder}
          placeholderTextColor="rgba(255,255,255,0.7)"
          style={styles.input}
          multiline={false}
          returnKeyType="send"
          onSubmitEditing={onSend}
        />
        {showMic ? (
          <TouchableOpacity
            onPressIn={onMicDown}
            onPressOut={onMicUp}
            style={styles.sendBtn}
            disabled={transcribing}
            activeOpacity={0.9}
          >
            {transcribing ? <ActivityIndicator color="#FFF" /> : <Feather name="mic" size={18} color="#FFF" />}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={onSend}
            style={styles.sendBtn}
            disabled={!uid || sending || !text.trim()}
            activeOpacity={0.9}
          >
            {sending ? <ActivityIndicator color="#FFF" /> : <Feather name="send" size={18} color="#FFF" />}
          </TouchableOpacity>
        )}
      </View>

      {(recording || transcribing) && (
        <View style={styles.sttStatusWrap}>
          {recording && (
            <View style={styles.sttStatusChip}>
              <Animated.View style={[styles.sttPulseDot, { transform: [{ scale }], opacity }]} />
              <Text style={styles.sttStatusText}>Listening… {mm}:{ss}</Text>
            </View>
          )}
          {transcribing && !recording && (
            <View style={styles.sttStatusChip}>
              <ActivityIndicator />
              <Text style={styles.sttStatusText}>Transcribing…</Text>
            </View>
          )}
        </View>
      )}
    </>
  );
}
