import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY as string,
  authDomain: "mindhaven-2fb22.firebaseapp.com",
  projectId: "mindhaven-2fb22",
  storageBucket: "mindhaven-2fb22.appspot.com",
  messagingSenderId: "198042888095",
  appId: "1:198042888095:web:b2e5aefc4e4b8c8d93bfaa",
} as const;

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
