import React, { useCallback, useRef, useState, forwardRef, useImperativeHandle, useEffect } from "react";
import { View, TextInput, TouchableOpacity, FlatList, Text, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback, TouchableOpacity as TapOverlay, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { aiChat } from "../api/ai";
import { auth } from "../firebase";
import { subscribeMessages, sendMessage as sendFsMessage, markChatRead, Message as FsMsg } from "../services/chatService";
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
  onRequestCollapse?: () => void;
  isCollapsed?: boolean;
  keyboardOffset?: number;
  title?: string;
  assistantLabel?: string;
  userLabel?: string;
  botAvatar?: any;
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
  const userAvatarUri = auth.currentUser?.photoURL || null;

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

      const history = messages
        .concat({ id: "temp", role: "user", content: text })
        .map(m => ({ role: m.role, content: m.content }));

      const reply = await aiChat(text, history);
        await sendFsMessage(chatId, "therapist-bot", reply);
        } catch {
          await sendFsMessage(chatId, "therapist-bot", "Sorry, I am having trouble replying right now.");
        } finally {
          setSending(false);
        }
  }, [chatId, input, sending, messages, scrollToEnd, onAfterUserMessage]);

  const onSend = chatId ? onSendFs : onSendAi;

  const renderSaveOffer = (m: UIMsg) => {
    return (
      <View style={styles.offerWrap}>
        <MessageBubble role="assistant" content={m.content} />
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
        <MessageBubble role="assistant" content={m.content} />
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
        <MessageBubble role="assistant" content={m.content} />
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
      <MessageBubble
        role={item.role}
        content={item.content}
        avatarUri={isUser ? userAvatarUri : null}
        avatarSource={!isUser ? botAvatar : undefined}
        label={isUser ? userLabel : assistantLabel}
      />
    );
  };

  const kbOffset = keyboardOffset ?? insets.bottom + 70;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
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
              {!isCollapsed && <TapOverlay style={styles.inputOverlay} activeOpacity={1} onPress={onRequestCollapse} />}
              <TouchableOpacity onPress={onSend} style={styles.sendBtn} disabled={sending}>
                {sending ? <ActivityIndicator color="#FFF" /> : <Feather name="send" size={18} color="#FFF" />}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
});

export default ChatPanel;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  titleRow: {
    paddingHorizontal: 6,
    paddingTop: 6,
    paddingBottom: 10,
    alignItems: "center"
  },
  titlePill: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.18)"
  },
  titleText: {
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.3,
    color: "#FFF"
  },
  listContent: {
    paddingHorizontal: 8,
    paddingTop: 4,
    gap: 10
  },
  inputCard: {
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.16)",
    padding: 8,
    marginTop: 8
  },
  inputRow: {
    position: "relative",
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 140,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "rgba(255, 255, 255, 0.10)",
    color: "#FFF"
  },
  inputOverlay: {
    position: "absolute",
    left: 0,
    right: 52,
    top: 0,
    bottom: 0
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.25)"
  },
  offerWrap: {
    gap: 8
  },
  actionRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 8
  },
  actionBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.18)"
  },
  actionTxt: {
    color: "#FFF",
    fontWeight: "700"
  },
  titleRowBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 8
  },
  inlineInput: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: "rgba(255,255,255,0.10)",
    color: "#FFF",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)"
  },
  smallBtn: {
    height: 40,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.25)"
  },
  smallBtnTxt: {
    color: "#FFF",
    fontWeight: "700"
  },
  moodRow: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 8
  },
  moodChip: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.18)"
  },
  moodTxt: {
    fontSize: 22
  }
});
