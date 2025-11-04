import { useEffect, useState } from "react";
import { onIdTokenChanged } from "firebase/auth";
import { useFocusEffect } from "@react-navigation/native";
import React from "react";
import { auth } from "../firebase";

export function useProfileUser() {
  const [name, setName] = useState<string>("Guest");
  const [photo, setPhoto] = useState<string | undefined>(undefined);
  const [cacheBust, setCacheBust] = useState<number>(0);

  useEffect(() => {
    const unsub = onIdTokenChanged(auth, () => {
      const u = auth.currentUser;
      setName(u?.displayName || "Guest");
      setPhoto(u?.photoURL || undefined);
    });
    const u = auth.currentUser;
    setName(u?.displayName || "Guest");
    setPhoto(u?.photoURL || undefined);
    return () => unsub();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      let alive = true;
      (async () => {
        await auth.currentUser?.reload();
        if (alive) {
          const u = auth.currentUser;
          setName(u?.displayName || "Guest");
          setPhoto(u?.photoURL || undefined);
        }
      })();
      return () => {
        alive = false;
      };
    }, [])
  );

  const refreshNow = async () => {
    await auth.currentUser?.reload();
    const u = auth.currentUser;
    setName(u?.displayName || "Guest");
    setPhoto(u?.photoURL || undefined);
    setCacheBust(Date.now());
  };

  return { name, photo, cacheBust, refreshNow };
}
