import React, { useCallback, useRef, useState, forwardRef, useImperativeHandle, useEffect } from "react";
import { View, TextInput, TouchableOpacity, FlatList, Text, ActivityIndicator, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback, Animated, Easing, Image } from "react-native";
import { useSafeAreaInsets, SafeAreaView } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import { aiChat } from "../api/ai";
import { auth } from "../firebase";
import { subscribeMessages, sendMessage as sendFsMessage, markChatRead, Message as FsMsg } from "../services/chatService";
import { isExplicitSaveTrigger } from "../services/journalFlow";
import { recordWavStart, RecHandle as RecH } from "../services/recorder";
import { transcribeAudio } from "../services/googleStt";
import { styles } from "../styles/chatPanel";

export type ChatPanelRef = { focusInput: () => void };

type UIMsg = {
  id: string;
  role: "user" | "assistant";
  content: string;
  type?: string;
  buttons?: string[];
  options?: { value: number; emoji: string }[];
  senderId?: string;
};

type Props = {
  chatId?: string;
  onRequestCollapse?: () => void;
  isCollapsed?: boolean;
  keyboardOffset?: number;
  title?: string;
  assistantLabel?: string;
  userLabel?: string;
  botAvatar?: any;
  userAvatar?: any;
  onAfterUserMessage?: (text: string) => Promise<void> | void;
  onSaveOffer?: (choice: "Save" | "Not now") => Promise<void> | void;
  onTitleProvided?: (t: string) => Promise<void> | void;
  onMoodSelected?: (mood: number) => Promise<void> | void;
};

const makeId = () => `${Date.now()}_${Math.floor(Math.random() * 1e6)}`;

const ChatPanel = forwardRef<ChatPanelRef, Props>(function ChatPanel(
  {
    chatId,
    onRequestCollapse,
    isCollapsed = true,
    keyboardOffset,
    title = "Therapy Buddy",
    assistantLabel = "Therapy Buddy",
    userLabel = "You",
    botAvatar,
    userAvatar,
    onAfterUserMessage = async () => {},
    onSaveOffer = async () => {},
    onTitleProvided = async () => {},
    onMoodSelected = async () => {}
  },
  ref
) {
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<UIMsg[]>([{ id: "w1", role: "assistant", content: "What do you want to talk about today?" }]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const listRef = useRef<FlatList<UIMsg>>(null);
  const inputRef = useRef<TextInput>(null);
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const recRef = useRef<RecH | null>(null);
  const GOOGLE_STT_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY ?? "";
  const [recSeconds, setRecSeconds] = useState(0);
  const recIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 700, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 700, easing: Easing.inOut(Easing.ease), useNativeDriver: true })
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [pulse]);

  useImperativeHandle(ref, () => ({
    focusInput: () => {
      inputRef.current?.focus();
      requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
    }
  }));

  const scrollToEnd = useCallback(() => {
    requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
  }, []);

  useEffect(() => {
    if (!chatId) return;
    const off = subscribeMessages(chatId, (rows: FsMsg[]) => {
      const uid = auth.currentUser?.uid;
      const mapped: UIMsg[] = rows.map((r: any) => ({
        id: r.id,
        role: r.senderId === uid ? "user" : "assistant",
        content: String(r.text ?? ""),
        type: r.type,
        buttons: r.buttons,
        options: r.options,
        senderId: r.senderId
      }));
      setMessages(mapped.length ? mapped : [{ id: "w1", role: "assistant", content: "Say hello to start the chat." }]);
      scrollToEnd();
    });
    return off;
  }, [chatId, scrollToEnd]);

  useEffect(() => {
    if (!chatId) return;
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    markChatRead(chatId, uid);
  }, [chatId, messages.length]);

  const onSendAi = useCallback(async () => {
    const text = input.trim();
    if (!text || sending) return;
    const userMsg: UIMsg = { id: makeId(), role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setSending(true);
    scrollToEnd();
    try {
      const history = messages.concat(userMsg).map(m => ({ role: m.role, content: m.content }));
      const reply = await aiChat(text, history);
      const assistantMsg: UIMsg = { id: makeId(), role: "assistant", content: reply };
      setMessages(prev => [...prev, assistantMsg]);
      scrollToEnd();
    } catch {
      const assistantMsg: UIMsg = { id: makeId(), role: "assistant", content: "Sorry, I am having trouble replying right now." };
      setMessages(prev => [...prev, assistantMsg]);
      scrollToEnd();
    } finally {
      setSending(false);
    }
  }, [input, sending, messages, scrollToEnd]);

  const onSendFs = useCallback(async () => {
    const text = input.trim();
    const uid = auth.currentUser?.uid;
    if (!text || sending || !chatId || !uid) return;
    setSending(true);
    setInput("");
    scrollToEnd();
    try {
      await sendFsMessage(chatId, uid, text);
      await onAfterUserMessage(text);
      if (isExplicitSaveTrigger(text)) {
        setSending(false);
        return;
      }
      const history = messages.concat({ id: "temp", role: "user", content: text }).map(m => ({ role: m.role, content: m.content }));
      const reply = await aiChat(text, history);
      await sendFsMessage(chatId, "therapist-bot", reply);
    } catch {
      await sendFsMessage(chatId, "therapist-bot", "Sorry, I am having trouble replying right now.");
    } finally {
      setSending(false);
    }
  }, [chatId, input, sending, messages, scrollToEnd, onAfterUserMessage]);

  const onSend = chatId ? onSendFs : onSendAi;

  function startTimer() {
    setRecSeconds(0);
    if (recIntervalRef.current) clearInterval(recIntervalRef.current);
    recIntervalRef.current = setInterval(() => {
      setRecSeconds(s => s + 1);
    }, 1000);
  }

  function stopTimer() {
    if (recIntervalRef.current) {
      clearInterval(recIntervalRef.current);
      recIntervalRef.current = null;
    }
  }

  async function onMicDown() {
    if (sending || transcribing || recording) return;
    setRecording(true);
    startTimer();
    recRef.current = await recordWavStart();
  }

  async function onMicUp() {
    if (!recRef.current) return;
    setRecording(false);
    stopTimer();
    setTranscribing(true);
    const handle = recRef.current;
    const uri = await handle.stopAndGetUri();
    recRef.current = null;
    if (!uri) {
      setTranscribing(false);
      return;
    }
    if (!GOOGLE_STT_KEY) {
      setTranscribing(false);
      setMessages(prev => [...prev, { id: makeId(), role: "assistant", content: "Voice transcription isn’t configured yet." }]);
      return;
    }
    let clean = "";
    try {
      const text = await transcribeAudio(uri, {
        apiKey: GOOGLE_STT_KEY,
        languageCode: "en-ZA",
        encoding: handle.encoding,
        sampleRateHertz: 16000,
        timeoutMs: 20000
      });
      clean = text.trim();
    } catch (e) {
    } finally {
      setTranscribing(false);
    }
    if (!clean) return;
    if (chatId) {
      const uid = auth.currentUser?.uid;
      if (uid) {
        await sendFsMessage(chatId, uid, clean);
        const history = messages.concat({ id: "temp", role: "user", content: clean }).map(m => ({ role: m.role, content: m.content }));
        try {
          const reply = await aiChat(clean, history);
          await sendFsMessage(chatId, "therapist-bot", reply);
        } catch {
          await sendFsMessage(chatId, "therapist-bot", "Sorry, I am having trouble replying right now.");
        }
      }
    } else {
      const userMsg: UIMsg = { id: makeId(), role: "user", content: clean };
      setMessages(prev => [...prev, userMsg]);
      try {
        const history = messages.concat(userMsg).map(m => ({ role: m.role, content: m.content }));
        const reply = await aiChat(clean, history);
        const bot: UIMsg = { id: makeId(), role: "assistant", content: reply };
        setMessages(prev => [...prev, bot]);
      } catch {
        const bot: UIMsg = { id: makeId(), role: "assistant", content: "Sorry, I am having trouble replying right now." };
        setMessages(prev => [...prev, bot]);
      }
    }
  }

  const renderAvatar = (isUser: boolean) => {
    const photoURL = auth.currentUser?.photoURL || null;
    const source = isUser
      ? userAvatar || (photoURL ? { uri: photoURL } : null)
      : botAvatar || null;
    if (source) {
      return (
        <Image
          source={source}
          style={{
            width: 34,
            height: 34,
            borderRadius: 17,
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.15)",
            marginHorizontal: 2
          }}
        />
      );
    }
    return (
      <View
        style={{
          width: 34,
          height: 34,
          borderRadius: 17,
          marginHorizontal: 2,
          backgroundColor: isUser ? "rgba(255, 255, 255, 0.2)" : "rgba(255, 255, 255, 1)",
          alignItems: "center",
          justifyContent: "center",
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.15)"
        }}
      >
        <Text style={{ color: "#000000ff", fontSize: 16 }}>{isUser ? "User" : "T"}</Text>
      </View>
    );
  };

  const renderSaveOffer = (m: UIMsg) => {
    return (
      <View style={styles.offerWrap}>
        <View style={styles.bubbleRow}>
          {renderAvatar(false)}
          <View style={[styles.bubble, styles.assistantBubble]}>
            <Text style={styles.bubbleLabel}>{assistantLabel}</Text>
            <Text style={styles.bubbleText}>{m.content}</Text>
          </View>
        </View>
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => onSaveOffer("Save")}>
            <Text style={styles.actionTxt}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => onSaveOffer("Not now")}>
            <Text style={styles.actionTxt}>Not now</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const [titleDraft, setTitleDraft] = useState("");
  const renderTitlePrompt = (m: UIMsg) => {
    return (
      <View style={styles.offerWrap}>
        <View style={styles.bubbleRow}>
          {renderAvatar(false)}
          <View style={[styles.bubble, styles.assistantBubble]}>
            <Text style={styles.bubbleLabel}>{assistantLabel}</Text>
            <Text style={styles.bubbleText}>{m.content}</Text>
          </View>
        </View>
        <View style={styles.titleRowBox}>
          <TextInput
            style={styles.inlineInput}
            value={titleDraft}
            onChangeText={setTitleDraft}
            placeholder="Title…"
            placeholderTextColor="rgba(255,255,255,0.7)"
          />
          <TouchableOpacity style={styles.smallBtn} onPress={() => { if (titleDraft.trim()) { onTitleProvided(titleDraft.trim()); setTitleDraft(""); } }}>
            <Text style={styles.smallBtnTxt}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderMoodPrompt = (m: UIMsg) => {
    const opts = m.options && m.options.length ? m.options : [
      { value: 1, emoji: "😞" },
      { value: 2, emoji: "😕" },
      { value: 3, emoji: "😐" },
      { value: 4, emoji: "🙂" },
      { value: 5, emoji: "😄" }
    ];
    return (
      <View style={styles.offerWrap}>
        <View style={styles.bubbleRow}>
          {renderAvatar(false)}
          <View style={[styles.bubble, styles.assistantBubble]}>
            <Text style={styles.bubbleLabel}>{assistantLabel}</Text>
            <Text style={styles.bubbleText}>{m.content}</Text>
          </View>
        </View>
        <View style={styles.moodRow}>
          {opts.map(o => (
            <TouchableOpacity key={o.value} style={styles.moodChip} onPress={() => onMoodSelected(o.value)}>
              <Text style={styles.moodTxt}>{o.emoji}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const renderItem = ({ item }: { item: UIMsg }) => {
    if (item.type === "save_offer") return renderSaveOffer(item);
    if (item.type === "title_prompt") return renderTitlePrompt(item);
    if (item.type === "mood_prompt") return renderMoodPrompt(item);
    const isUser = item.role === "user";
    return (
      <View style={[styles.bubbleRow, { alignItems: "flex-end" }]}>
        {!isUser && renderAvatar(false)}
        <View style={[styles.bubble, isUser ? styles.userBubble : styles.assistantBubble]}>
          <Text style={styles.bubbleLabel}>{isUser ? userLabel : assistantLabel}</Text>
          <Text style={styles.bubbleText}>{item.content}</Text>
        </View>
        {isUser && renderAvatar(true)}
      </View>
    );
  };

  const kbOffset = keyboardOffset ?? insets.bottom + 70;
  const showMic = input.trim().length === 0 && !sending && !transcribing;

  const mm = String(Math.floor(recSeconds / 60)).padStart(2, "0");
  const ss = String(recSeconds % 60).padStart(2, "0");
  const scale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.15] });
  const opacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] });

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <View style={styles.titleRow}>
          <View style={styles.titlePill}>
            <Text style={styles.titleText}>{title}</Text>
          </View>
        </View>

        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={m => m.id}
          renderItem={renderItem}
          contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 20 }]}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={scrollToEnd}
        />

        {(recording || transcribing) && (
          <View style={styles.statusWrap}>
            {recording && (
              <View style={styles.statusChip}>
                <Animated.View style={[styles.pulseDot, { transform: [{ scale }], opacity }]} />
                <Text style={styles.statusText}>Listening… {mm}:{ss}</Text>
                <View style={styles.statusRight}>
                  <Ionicons name="mic" size={16} color="#fff" />
                </View>
              </View>
            )}
            {transcribing && !recording && (
              <View style={styles.statusChip}>
                <ActivityIndicator />
                <Text style={styles.statusText}>Transcribing…</Text>
                <View style={styles.statusRight}>
                  <Feather name="loader" size={16} color="#fff" />
                </View>
              </View>
            )}
          </View>
        )}

        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={kbOffset}>
          <View style={[styles.inputCard, { paddingBottom: insets.bottom > 0 ? 8 : 8 }]}>
            <View style={styles.inputRow}>
              <TextInput
                ref={inputRef}
                style={styles.input}
                value={input}
                onChangeText={setInput}
                placeholder="Type Your Message"
                placeholderTextColor="rgba(255,255,255,0.7)"
                editable={isCollapsed}
                multiline
              />
              {isCollapsed ? null : <View style={styles.inputOverlay} pointerEvents="box-only" />}
              {showMic ? (
                <TouchableOpacity
                  onPressIn={onMicDown}
                  onPressOut={onMicUp}
                  style={[styles.sendBtn, recording && { backgroundColor: "rgba(69,183,209,0.9)" }]}
                  disabled={transcribing}
                >
                  {transcribing ? <ActivityIndicator color="#FFF" /> : <Ionicons name="mic" size={18} color="#FFF" />}
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={onSend} style={styles.sendBtn} disabled={sending}>
                  {sending ? <ActivityIndicator color="#FFF" /> : <Feather name="send" size={18} color="#FFF" />}
                </TouchableOpacity>
              )}
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
});
export default ChatPanel;
