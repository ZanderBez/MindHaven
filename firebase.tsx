import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY as string,
  authDomain: "mindhaven-2fb22.firebaseapp.com",
  projectId: "mindhaven-2fb22",
  storageBucket: "mindhaven-2fb22.appspot.com",
  messagingSenderId: "610930782566",
  appId: "1:610930782566:web:5b9e0f2e06c5d6dcf8d5b6"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
