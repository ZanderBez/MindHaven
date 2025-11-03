import { getAuth } from "firebase/auth";
import { db } from "../firebase";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc
} from "firebase/firestore";
import * as Journal from "../services/journalService";

const KEYWORDS = ["stressed","anxious","overwhelmed","sad","panic","burnt out","depressed","tired","angry","worried"];

export const TRIGGER_PHRASES = [
  "save this to my journal",
  "save to my journal",
  "save this in my journal",
  "save to journal",
  "can i save this to my journal",
  "please save this to my journal",
  "save this chat to my journal"
];

const EMOJI = [{v:1,e:"😞"},{v:2,e:"😕"},{v:3,e:"😐"},{v:4,e:"🙂"},{v:5,e:"😄"}];

export function isExplicitSaveTrigger(text: string) {
  const lc = text.toLowerCase();
  return TRIGGER_PHRASES.some(p => lc.includes(p));
}

export async function maybeOfferAfterUserMessage(chatId: string, userText: string) {
  const lc = userText.toLowerCase();
  if (isExplicitSaveTrigger(lc)) {
    await injectSaveOffer(chatId);
    return;
  }
  const ref = doc(db, "chats", chatId);
  const snap = await getDoc(ref);
  const lastOfferAt = (snap.data() as any)?.lastOfferAt?.toMillis?.() as number | undefined;
  const now = Date.now();
  const COOL_MS = 10 * 60 * 1000;
  if (lastOfferAt && now - lastOfferAt < COOL_MS) return;
  if (lc.length > 20 && KEYWORDS.some(k => lc.includes(k))) {
    await injectSaveOffer(chatId);
  }
}

export async function injectSaveOffer(chatId: string) {
  await addDoc(collection(db, "chats", chatId, "messages"), {
    type: "save_offer",
    text: "Would you like me to save a short summary of this chat to your Journal?",
    buttons: ["Save","Not now"],
    senderId: "therapist-bot",
    createdAt: serverTimestamp()
  });
  await updateDoc(doc(db, "chats", chatId), { lastOfferAt: serverTimestamp() });
}

export async function respondToSaveOffer(chatId: string, choice: "Save" | "Not now") {
  if (choice === "Save") {
    await addDoc(collection(db, "chats", chatId, "messages"), {
      type: "title_prompt",
      text: "What would you like the title to be?",
      senderId: "therapist-bot",
      createdAt: serverTimestamp()
    });
    return;
  }
  await addDoc(collection(db, "chats", chatId, "messages"), {
    type: "info",
    text: "No problem — whenever you’re ready, just say “save this to my journal.”",
    senderId: "therapist-bot",
    createdAt: serverTimestamp()
  });
  await addDoc(collection(db, "chats", chatId, "messages"), {
    type: "assistant_followup",
    text: "Would you like to keep talking about this, or switch topics?",
    senderId: "therapist-bot",
    createdAt: serverTimestamp()
  });
  await updateDoc(doc(db, "chats", chatId), { lastOfferAt: serverTimestamp() });
}

export async function onTitleProvided(chatId: string, title: string) {
  const uid = getAuth().currentUser?.uid ?? "user";
  await addDoc(collection(db, "chats", chatId, "messages"), {
    type: "user_reply",
    text: title,
    meta: { field: "journal_title" },
    senderId: uid,
    createdAt: serverTimestamp()
  });
  await addDoc(collection(db, "chats", chatId, "messages"), {
    type: "mood_prompt",
    text: "How are you feeling right now?",
    options: EMOJI.map(x => ({ value: x.v, emoji: x.e })),
    senderId: "therapist-bot",
    createdAt: serverTimestamp()
  });
}

export async function onMoodSelected(chatId: string, mood: number) {
  const uid = getAuth().currentUser?.uid;
  if (!uid) return;
  const qSnap = await getDocs(query(collection(db, "chats", chatId, "messages"), orderBy("createdAt","asc")));
  const all = qSnap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
  const title = lastUserTitle(all) || defaultTitleFromChat(all);
  const body = summarizeLocal(all);
  const moodStr = EMOJI.find(x => x.v === mood)?.e ?? "🙂";
  await Journal.createJournal(uid, { title, body, mood: moodStr });
  await addDoc(collection(db, "chats", chatId, "messages"), {
    type: "info",
    text: "Saved to your Journal. 🌿",
    senderId: "therapist-bot",
    createdAt: serverTimestamp()
  });
  await addDoc(collection(db, "chats", chatId, "messages"), {
    type: "assistant_followup",
    text: "Would you like to keep talking about this, or switch topics?",
    senderId: "therapist-bot",
    createdAt: serverTimestamp()
  });
}

function lastUserTitle(messages: any[]): string | null {
  const rev = [...messages].reverse();
  const found = rev.find(m => m.type==="user_reply" && m.meta?.field==="journal_title" && typeof m.text==="string");
  return found?.text?.trim() || null;
}

function defaultTitleFromChat(messages: any[]): string {
  const lastUser = [...messages].reverse().find(m => m.senderId !== "therapist-bot" && typeof m.text==="string");
  if (!lastUser) return "Journal entry";
  const words = String(lastUser.text).split(/\s+/).slice(0,6).join(" ");
  return words.length ? words : "Journal entry";
}

function summarizeLocal(messages: any[]): string {
  const userMsgs = messages
    .filter(m => m.senderId !== "therapist-bot" && typeof m.text === "string")
    .map(m => m.text.trim())
    .filter(Boolean);
  const recent = userMsgs.slice(-6);
  const first = recent[0] || "";
  const last = recent[recent.length - 1] || "";
  const s1 = first ? trimSentence(first, 120) : "";
  const s2 = last && last !== first ? trimSentence(last, 120) : "";
  const summary = [s1, s2].filter(Boolean).join(" ");
  const clean = summary || "Talked about personal feelings and plans.";
  return clean.length > 300 ? clean.slice(0, 297) + "..." : clean;
}

function trimSentence(s: string, max: number): string {
  if (s.length <= max) return s;
  const cut = s.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 40 ? cut.slice(0, lastSpace) : cut) + "...";
}
