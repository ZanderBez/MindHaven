import { useEffect, useState } from "react";
import { subscribeJournals, Journal } from "../services/journalService";
import { subscribeUserChats, Chat } from "../services/chatService";

export function useHomeStreams(uid: string | null) {
  const [notes, setNotes] = useState<Journal[]>([]);
  const [recentChats, setRecentChats] = useState<Chat[]>([]);

  useEffect(() => {
    if (!uid) return;
    const offNotes = subscribeJournals(uid, setNotes);
    const offChats = subscribeUserChats(uid, (rows) => setRecentChats(rows.slice(0, 3)));
    return () => {
      offNotes && offNotes();
      offChats && offChats();
    };
  }, [uid]);

  return { notes, recentChats };
}