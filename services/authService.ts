import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, signOut, UserCredential } from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";

export const registerUser = async (name: string, email: string, password: string): Promise<UserCredential> => {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName: name, photoURL: null as unknown as string });
  await setDoc(doc(db, "users", cred.user.uid), {
    name,
    email: cred.user.email,
    photoURL: null,
    createdAt: serverTimestamp()
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

export const syncUserProfile = async (params: { uid: string; name?: string | null; photoURL?: string | null; email?: string | null }) => {
  const { uid, name, photoURL } = params;
  if (auth.currentUser && auth.currentUser.uid === uid) {
    await updateProfile(auth.currentUser, {
      displayName: name ?? auth.currentUser.displayName ?? "",
      photoURL: (photoURL as unknown as string) ?? (auth.currentUser.photoURL as string) ?? (null as unknown as string)
    });
  }
  const ref = doc(db, "users", uid);
  await updateDoc(ref, {
    ...(name !== undefined ? { name } : {}),
    ...(photoURL !== undefined ? { photoURL } : {})
  });
};
