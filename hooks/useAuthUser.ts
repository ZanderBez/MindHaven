import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

export function useAuthUser() {
  const [uid, setUid] = useState<string | null>(null);
  const [name, setName] = useState<string>("User");
  const [photoURL, setPhotoURL] = useState<string | null>(null);

  useEffect(() => {
    const off = onAuthStateChanged(auth, (u) => {
      setUid(u?.uid ?? null);
      setName(u?.displayName || "User");
      setPhotoURL(u?.photoURL ?? null);
    });
    return off;
  }, []);

  return { uid, name, photoURL };
}