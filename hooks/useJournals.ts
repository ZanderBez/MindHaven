import { useEffect, useMemo, useRef, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { Journal, subscribeJournals } from "../services/journalService";

export function useJournals() {
  const [uid, setUid] = useState<string | null>(null);
  const [rows, setRows] = useState<Journal[]>([]);
  const [query, setQuery] = useState("");
  const [highlightId, setHighlightId] = useState<string | null>(null);

  useEffect(() => {
    setUid(auth.currentUser?.uid ?? null);
    const unsub = onAuthStateChanged(auth, (u) => setUid(u ? u.uid : null));
    return unsub;
  }, []);

  useEffect(() => {
    if (!uid) return;
    const off = subscribeJournals(uid, setRows);
    return off;
  }, [uid]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        (r.title || "").toLowerCase().includes(q) ||
        (r.body || "").toLowerCase().includes(q)
    );
  }, [rows, query]);

  return { uid, rows, filtered, query, setQuery, highlightId, setHighlightId };
}
