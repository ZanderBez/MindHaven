import { useEffect, useMemo, useState } from "react";
import { Platform, Alert, ToastAndroid, Keyboard } from "react-native";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { createJournal, updateJournal, deleteJournal } from "../services/journalService";
import * as Haptics from "expo-haptics";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function useJournalEdit(id: string | null) {
  const isNew = !id;

  const [uid, setUid] = useState<string | null>(null);
  const [mood, setMood] = useState("🙂");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [editable, setEditable] = useState(isNew);
  const [saving, setSaving] = useState(false);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    const off = onAuthStateChanged(auth, (u) => setUid(u?.uid ?? null));
    return off;
  }, []);

  useEffect(() => {
    if (!uid || !id) return;
    (async () => {
      const snap = await getDoc(doc(db, "users", uid, "journals", id));
      const data = snap.data() as any;
      setMood(data?.mood || "🙂");
      setTitle(data?.title || "");
      setBody(data?.body || "");
      setEditable(false);
    })();
  }, [uid, id]);

  useEffect(() => {
    (async () => {
      if (!isNew) return;
      try {
        const last = await AsyncStorage.getItem("last_mood");
        if (last) setMood(last);
      } catch {}
    })();
  }, [isNew]);

  const canSave = useMemo(
    () => (title.trim().length > 0 || body.trim().length > 0) && !!uid && !saving,
    [title, body, uid, saving]
  );

  function notify(msg: string) {
    if (Platform.OS === "android") ToastAndroid.show(msg, ToastAndroid.SHORT);
    else Alert.alert(msg);
  }

  async function saveLastMood(m: string) {
    try {
      await AsyncStorage.setItem("last_mood", m);
    } catch {}
  }

  function dismissIfTyping() {
    if (typing) {
      Keyboard.dismiss();
      setTyping(false);
    }
  }

  async function onSave() {
    if (!uid || !canSave) return { ok: false };
    try {
      setSaving(true);
      let newId: string | undefined = id ?? undefined;
      if (isNew) {
        const createdId = await createJournal(uid, { title: title.trim(), body: body.trim(), mood });
        if (typeof createdId === "string") newId = createdId;
      } else {
        await updateJournal(uid, id!, { title: title.trim(), body: body.trim(), mood });
      }
      await saveLastMood(mood);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      notify("Saved to Journal");
      return { ok: true, id: newId };
    } finally {
      setSaving(false);
    }
  }

  async function onDelete() {
    if (!uid || !id) return { ok: false };
    await deleteJournal(uid, id);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    notify("Deleted");
    return { ok: true };
  }

  return {
    isNew,
    mood,
    setMood,
    title,
    setTitle,
    body,
    setBody,
    editable,
    setEditable,
    saving,
    typing,
    setTyping,
    canSave,
    dismissIfTyping,
    onSave,
    onDelete,
  };
}
