import { auth, db } from '../firebase'
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore'

export type Journal = {
  id: string
  title: string
  body: string
  mood: string
  createdAt?: Timestamp
  updatedAt?: Timestamp
}

const colRef = (uid: string) => collection(db, 'users', uid, 'journals')

export const subscribeJournals = (uid: string, cb: (rows: Journal[]) => void) => {
  const q = query(colRef(uid), orderBy('createdAt', 'desc'))
  return onSnapshot(q, snap => {
    const rows: Journal[] = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }))
    cb(rows)
  })
}

export const createJournal = async (uid: string, data: { title: string; body: string; mood: string }) => {
  const ref = await addDoc(colRef(uid), { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() })
  return ref.id
}

export const updateJournal = async (uid: string, id: string, patch: Partial<Pick<Journal, 'title' | 'body' | 'mood'>>) => {
  await updateDoc(doc(db, 'users', uid, 'journals', id), { ...patch, updatedAt: serverTimestamp() })
}

export const deleteJournal = async (uid: string, id: string) => {
  await deleteDoc(doc(db, 'users', uid, 'journals', id))
}
