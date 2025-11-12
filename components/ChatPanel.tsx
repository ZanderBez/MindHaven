import React, { useCallback, useRef, useState, forwardRef, useImperativeHandle, useEffect } from "react";
import { View, TextInput, TouchableOpacity, FlatList, Text, ActivityIndicator, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback, Animated } from "react-native";
import { useSafeAreaInsets, SafeAreaView } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import { aiChat } from "../api/ai";
import { auth } from "../firebase";
import { subscribeMessages, sendMessage as sendFsMessage, markChatRead, Message as FsMsg } from "../services/chatService";
import { styles } from "../styles/chatPanel";
import ChatHeader from "./ChatHeader";
import { useSTTRecorder } from "../hooks/useSTTRecorder";
import MessageBubble from "./MessageBubble";
import { isExplicitSaveTrigger } from "../services/journalFlow";

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
  title?: string;
  onAfterUserMessage?: (text: string) => Promise<void> | void;
  onSaveOffer?: (choice: "Save" | "Not now") => Promise<void> | void;
  onTitleProvided?: (t: string) => Promise<void> | void;
  onMoodSelected?: (mood: number) => Promise<void> | void;
  onBack?: () => void;
  botAvatar?: any;
  userAvatar?: any;
  assistantLabel?: string;
  userLabel?: string;
};

const makeId = () => `${Date.now()}_${Math.floor(Math.random() * 1e6)}`;

const ChatPanel = forwardRef<ChatPanelRef, Props>(function ChatPanel(
  {
    chatId,
    title = "Therapy Buddy",
    onAfterUserMessage = async () => {},
    onSaveOffer = async () => {},
    onTitleProvided = async () => {},
    onMoodSelected = async () => {},
    onBack,
    botAvatar,
    userAvatar,
    assistantLabel = "Therapy Buddy",
    userLabel = "You",
  },
  ref
) {
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<UIMsg[]>([{ id: "w1", role: "assistant", content: "What do you want to talk about today?" }]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [titleDrafts, setTitleDrafts] = useState<Record<string,string>>({});
  const listRef = useRef<FlatList<UIMsg>>(null);
  const inputRef = useRef<TextInput>(null);

  const { recording, transcribing, onMicDown, onMicUp, mm, ss, scale, opacity, canUseMic } = useSTTRecorder({
    onTranscript: async (text) => {
      if (text) await handleSend(text);
    }
  });

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

  const handleSend = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    const uid = auth.currentUser?.uid;
    setInput("");
    setSending(true);

    const userMsg: UIMsg = { id: makeId(), role: "user", content: trimmed };
    setMessages(prev => {
      const updated = [...prev, userMsg];
      scrollToEnd();
      return updated;
    });

    try {
      if (chatId && uid) {
        await sendFsMessage(chatId, uid, trimmed);
        await onAfterUserMessage(trimmed);

        if (!isExplicitSaveTrigger(trimmed)) {
          const latestHistory = [...messages, userMsg].map(m => ({ role: m.role, content: m.content }));
          const reply = await aiChat(trimmed, latestHistory);
          await sendFsMessage(chatId, "therapist-bot", reply);
        }
      } else {
        if (!isExplicitSaveTrigger(trimmed)) {
          const latestHistory = [...messages, userMsg].map(m => ({ role: m.role, content: m.content }));
          const reply = await aiChat(trimmed, latestHistory);
          const assistantMsg: UIMsg = { id: makeId(), role: "assistant", content: reply };
          setMessages(prev => [...prev, assistantMsg]);
          scrollToEnd();
        }
      }
    } catch {
      const failMsg: UIMsg = { id: makeId(), role: "assistant", content: "Sorry, I am having trouble replying right now." };
      setMessages(prev => [...prev, failMsg]);
      scrollToEnd();
    } finally {
      setSending(false);
    }
  }, [chatId, sending, messages, onAfterUserMessage, scrollToEnd]);

  const renderItem = ({ item }: { item: UIMsg }) => {
    if (item.type === "save_offer") {
      return (
        <View style={styles.offerWrap}>
          <MessageBubble
            role="assistant"
            content={item.content}
            label={assistantLabel}
            avatarSource={botAvatar}
            fallbackLetter={assistantLabel?.[0]?.toUpperCase()}
          />
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
    }

    if (item.type === "title_prompt") {
      return (
        <View style={styles.offerWrap}>
          <MessageBubble
            role="assistant"
            content={item.content}
            label={assistantLabel}
            avatarSource={botAvatar}
            fallbackLetter={assistantLabel?.[0]?.toUpperCase()}
          />
          <View style={styles.titleRowBox}>
            <TextInput
              style={styles.inlineInput}
              value={titleDrafts[item.id] || ""}
              onChangeText={t => setTitleDrafts(prev => ({ ...prev, [item.id]: t }))}
              placeholder="Title…"
              placeholderTextColor="rgba(255,255,255,0.7)"
            />
            <TouchableOpacity
              style={styles.smallBtn}
              onPress={() => {
                const draft = titleDrafts[item.id]?.trim();
                if (draft) {
                  onTitleProvided(draft);
                  setTitleDrafts(prev => ({ ...prev, [item.id]: "" }));
                }
              }}
            >
              <Text style={styles.smallBtnTxt}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    if (item.type === "mood_prompt") {
      const opts = item.options && item.options.length ? item.options : [
        { value: 1, emoji: "😞" },
        { value: 2, emoji: "😕" },
        { value: 3, emoji: "😐" },
        { value: 4, emoji: "🙂" },
        { value: 5, emoji: "😄" }
      ];
      return (
        <View style={styles.offerWrap}>
          <MessageBubble
            role="assistant"
            content={item.content}
            label={assistantLabel}
            avatarSource={botAvatar}
            fallbackLetter={assistantLabel?.[0]?.toUpperCase()}
          />
          <View style={styles.moodRow}>
            {opts.map(o => (
              <TouchableOpacity key={o.value} style={styles.moodChip} onPress={() => onMoodSelected(o.value)}>
                <Text style={styles.moodTxt}>{o.emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      );
    }

    const isUser = item.role === "user";
    return (
      <MessageBubble
        role={item.role}
        content={item.content}
        label={isUser ? userLabel : assistantLabel}
        avatarUri={isUser ? auth.currentUser?.photoURL ?? null : undefined}
        avatarSource={isUser ? userAvatar : botAvatar}
        fallbackLetter={isUser ? undefined : assistantLabel?.[0]?.toUpperCase()}
      />
    );
  };

  const kbOffset = insets.bottom + 40;
  const showMic = input.trim().length === 0 && !sending && !transcribing;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <ChatHeader title={title} onBack={onBack} />

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
                editable={!sending}
                multiline
              />
              {showMic && canUseMic ? (
                <TouchableOpacity onPressIn={onMicDown} onPressOut={onMicUp} style={styles.sendBtn} disabled={transcribing}>
                  {transcribing ? <ActivityIndicator color="#FFF" /> : <Ionicons name="mic" size={18} color="#FFF" />}
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => handleSend(input)} style={styles.sendBtn} disabled={sending}>
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
