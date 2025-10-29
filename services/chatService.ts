import { db } from "../firebase";
import { addDoc, collection, doc, getDoc, getDocs, onSnapshot, orderBy, query, serverTimestamp, updateDoc, where, Timestamp, writeBatch, deleteDoc} from "firebase/firestore";

export type Chat = {
  id: string;
  title?: string | null;
  participants: string[];
  participantMeta?: Record<string, { lastReadAt?: Timestamp | null; unread?: number; pinned?: boolean }>;
  lastMessage?: string | null;
  lastMessageAt?: Timestamp | null;
  createdAt?: Timestamp | null;
  updatedAt?: Timestamp | null;
};

export type Message = {
  id: string;
  text: string;
  senderId: string;
  createdAt: Timestamp | null;
  type?: "text" | "system" | "image";
};

export function subscribeUserChats(uid: string, cb: (rows: Chat[]) => void) {
  const q = query(collection(db, "chats"), where("participants", "array-contains", uid));
  return onSnapshot(q, snap => cb(snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }))));
}

export function subscribeMessages(chatId: string, cb: (rows: Message[]) => void) {
  const q = query(collection(db, "chats", chatId, "messages"), orderBy("createdAt", "asc"));
  return onSnapshot(q, snap => cb(snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }))));
}

export async function sendMessage(chatId: string, senderId: string, text: string) {
  await addDoc(collection(db, "chats", chatId, "messages"), {
    text,
    senderId,
    createdAt: serverTimestamp(),
    type: "text"
  });
  await updateDoc(doc(db, "chats", chatId), {
    lastMessage: text,
    lastMessageAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
}

export async function markChatRead(chatId: string, uid: string) {
  const ref = doc(db, "chats", chatId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const field = `participantMeta.${uid}.lastReadAt`;
  await updateDoc(ref, { [field]: serverTimestamp() });
}

export async function createNewChatWithBot(uid: string) {
  const chatRef = await addDoc(collection(db, "chats"), {
    title: "Therapy Buddy",
    participants: [uid, "therapist-bot"],
    participantMeta: {
      [uid]: { unread: 0, pinned: false, lastReadAt: null },
      ["therapist-bot"]: { unread: 0, pinned: false, lastReadAt: null }
    },
    lastMessage: "What do you want to talk about today",
    lastMessageAt: serverTimestamp(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });

  const id = chatRef.id;

  addDoc(collection(db, "chats", id, "messages"), {
    text: "What do you want to talk about today",
    senderId: "therapist-bot",
    createdAt: serverTimestamp(),
    type: "text"
  }).catch(() => {});

  return id;
}

export async function deleteChat(chatId: string) {
  const msgsRef = collection(db, "chats", chatId, "messages");
  const msgs = await getDocs(msgsRef);
  const batch = writeBatch(db);
  msgs.forEach(m => batch.delete(m.ref));
  await batch.commit();
  await deleteDoc(doc(db, "chats", chatId));
}
