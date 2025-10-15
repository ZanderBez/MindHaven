import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, UserCredential, updateProfile, GoogleAuthProvider, signInWithPopup, signInWithCredential, setPersistence, browserLocalPersistence } from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";

export const registerUser = async (name: string, email: string, password: string): Promise<UserCredential> => {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName: name, photoURL: null as any });
  await setDoc(doc(db, "users", cred.user.uid), {
    name,
    email: cred.user.email,
    photoURL: null,
    createdAt: serverTimestamp(),
  });
  return cred;
};

export const loginUser = async (email: string, password: string) => {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const snap = await getDoc(doc(db, "users", cred.user.uid));
  return { user: cred.user, data: snap.exists() ? snap.data() : null };
};

export const logoutUser = async () => {
  await signOut(auth);
};