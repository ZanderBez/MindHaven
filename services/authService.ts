import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, UserCredential } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

async function upsertUserDoc(uid: string, payload: Record<string, any>) {
  try {
    await setDoc(doc(db, "users", uid), payload, { merge: true });
  } catch {}
}

export async function registerUser(name: string, email: string, password: string): Promise<UserCredential> {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  if (name?.trim()) {
    await updateProfile(cred.user, { displayName: name.trim() });
  }
  void upsertUserDoc(cred.user.uid, {
    name: name?.trim() || null,
    email: cred.user.email,
    photoURL: cred.user.photoURL ?? null,
    createdAt: serverTimestamp(),
    lastLoginAt: serverTimestamp()
  });
  return cred;
}

export async function loginUser(email: string, password: string) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  void upsertUserDoc(cred.user.uid, {
    name: cred.user.displayName ?? null,
    email: cred.user.email,
    photoURL: cred.user.photoURL ?? null,
    updatedAt: serverTimestamp(),
    lastLoginAt: serverTimestamp()
  });
  return cred.user;
}

export async function logoutUser() {
  await auth.signOut();
}
