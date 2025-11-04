import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { Chat, subscribeUserChats, createNewChatWithBot, deleteChat } from "../services/chatService";

export function useChats() {
  const [uid, setUid] = useState<string | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const off = onAuthStateChanged(auth, (u) => setUid(u?.uid ?? null));
    return off;
  }, []);

  useEffect(() => {
    if (!uid) return;
    const off = subscribeUserChats(uid, (rows) => {
      const sorted = [...rows].sort((a, b) => {
        const ta = b.updatedAt?.toMillis?.() ?? b.lastMessageAt?.toMillis?.() ?? b.createdAt?.toMillis?.() ?? 0;
        const tb = a.updatedAt?.toMillis?.() ?? a.lastMessageAt?.toMillis?.() ?? a.createdAt?.toMillis?.() ?? 0;
        return ta - tb;
      });
      setChats(sorted);
    });
    return off;
  }, [uid]);

  const fmtDate = useMemo(
    () => (ts?: any) => {
      try {
        const d = ts?.toDate ? ts.toDate() : undefined;
        if (!d) return "";
        return d.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });
      } catch {
        return "";
      }
    },
    []
  );

  async function newSession() {
    if (!uid || creating) return null;
    setCreating(true);
    try {
      const chatId = await createNewChatWithBot(uid);
      return chatId;
    } finally {
      setCreating(false);
    }
  }

  function removeChat(id: string) {
    return deleteChat(id);
  }

  return { uid, chats, creating, fmtDate, newSession, removeChat };
}
