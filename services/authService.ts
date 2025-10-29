import { auth, db, storage } from "../firebase"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, UserCredential, updateProfile, GoogleAuthProvider, signInWithPopup, signInWithCredential, setPersistence, browserLocalPersistence, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth"
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"

export const registerUser = async (name: string, email: string, password: string): Promise<UserCredential> => {
  const cred = await createUserWithEmailAndPassword(auth, email, password)
  await updateProfile(cred.user, { displayName: name, photoURL: null as any })
  await setDoc(doc(db, "users", cred.user.uid), {
    name,
    email: cred.user.email,
    photoURL: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }, { merge: true })
  return cred
}

export const loginUser = async (email: string, password: string) => {
  const cred = await signInWithEmailAndPassword(auth, email, password)
  const snap = await getDoc(doc(db, "users", cred.user.uid))
  return { user: cred.user, data: snap.exists() ? snap.data() : null }
}

export const logoutUser = async () => {
  await signOut(auth)
}

export const getUserProfile = async (uid?: string) => {
  const id = uid ?? auth.currentUser?.uid
  if (!id) return null
  const snap = await getDoc(doc(db, "users", id))
  return snap.exists() ? snap.data() : null
}

export const uploadAvatarFromUri = async (uid: string, uri: string): Promise<string> => {
  const res = await fetch(uri)
  const blob = await res.blob()
  const r = ref(storage, `users/${uid}/avatar.jpg`)
  await uploadBytes(r, blob)
  const url = await getDownloadURL(r)
  return url
}

export const updateUserProfile = async (params: { displayName?: string; tagline?: string; photoURL?: string }) => {
  const u = auth.currentUser
  if (!u) throw new Error("Not signed in")
  if (params.displayName !== undefined || params.photoURL !== undefined) {
    await updateProfile(u, {
      displayName: params.displayName ?? u.displayName ?? null as any,
      photoURL: params.photoURL ?? u.photoURL ?? null as any,
    })
  }
  await setDoc(doc(db, "users", u.uid), {
    ...(params.displayName !== undefined ? { name: params.displayName } : {}),
    ...(params.tagline !== undefined ? { tagline: params.tagline } : {}),
    ...(params.photoURL !== undefined ? { photoURL: params.photoURL } : {}),
    updatedAt: serverTimestamp(),
  }, { merge: true })
  return true
}

export const changePassword = async (currentPassword: string, newPassword: string) => {
  const u = auth.currentUser
  if (!u?.email) throw new Error("Not signed in")
  const cred = EmailAuthProvider.credential(u.email, currentPassword)
  await reauthenticateWithCredential(u, cred)
  await updatePassword(u, newPassword)
  return true
}
