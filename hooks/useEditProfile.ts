import { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { User, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { FirebaseError } from "firebase/app";
import { auth, db, storage } from "../firebase";

export function useEditProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [pickedUri, setPickedUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const u = auth.currentUser;
    setUser(u || null);
    setDisplayName(u?.displayName || "");
    setPhotoURL(u?.photoURL || "");
  }, []);

  async function pickImage() {
    setErr(null);
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      setErr("Permission required to access photos");
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9,
    });
    if (!res.canceled && res.assets?.length) setPickedUri(res.assets[0].uri);
  }

  async function uploadAvatar(uri: string, uid: string) {
    setUploading(true);
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const filename = `${Date.now()}.jpg`;
      const rf = ref(storage, `users/${uid}/${filename}`);
      await uploadBytes(rf, blob);
      const url = await getDownloadURL(rf);
      return url;
    } finally {
      setUploading(false);
    }
  }

  async function save() {
    if (!user) return { ok: false, error: "No user" };
    setErr(null);
    setSaving(true);
    try {
      let finalPhoto = photoURL;
      if (pickedUri) {
        finalPhoto = await uploadAvatar(pickedUri, user.uid);
        setPhotoURL(finalPhoto);
      }
      await updateProfile(user, {
        displayName: displayName.trim(),
        photoURL: (finalPhoto || null) as any,
      });
      await setDoc(
        doc(db, "users", user.uid),
        { name: displayName.trim(), photoURL: finalPhoto || "", updatedAt: Date.now() },
        { merge: true }
      );
      await auth.currentUser?.reload();
      setSaving(false);
      return { ok: true, ts: Date.now() };
    } catch (e) {
      const fe = e as FirebaseError;
      const msg = `Error: ${fe.code || "unknown"} — ${fe.message || "Something went wrong"}`;
      setSaving(false);
      setErr(msg);
      return { ok: false, error: msg };
    }
  }

  return {
    user,
    displayName,
    setDisplayName,
    photoURL,
    pickedUri,
    uploading,
    saving,
    err,
    pickImage,
    save,
  };
}
