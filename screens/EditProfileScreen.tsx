import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { auth, db, storage } from "../firebase";
import { User, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { FirebaseError } from "firebase/app";
import GlobalBackground from "../components/GlobalBackground";

export default function EditProfileScreen() {
  const navigation = useNavigation<any>();
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

  async function onSave() {
    if (!user) return;
    setErr(null);
    setSaving(true);

    let finalPhoto = photoURL;
    try {
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
        {
          name: displayName.trim(),
          photoURL: finalPhoto || "",
          updatedAt: Date.now(),
        },
        { merge: true }
      );
      await auth.currentUser?.reload();
      setSaving(false);
      const ts = Date.now();
      navigation.navigate("Profile" as never, { refresh: ts } as never);
    } catch (e) {
      const fe = e as FirebaseError;
      const msg = `Error: ${fe.code || "unknown"} — ${fe.message || "Something went wrong"}`;
      setSaving(false);
      setErr(msg);
      Alert.alert("Save failed", msg);
    }
  }

  return (
    <View style={styles.root}>
      <GlobalBackground />
      <View style={styles.overlay} />
      <SafeAreaView style={styles.safe}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn} hitSlop={styles.hitSlop as any}>
            <Feather name="chevron-left" size={28} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.title}>Edit Profile</Text>
          <View style={styles.headerSpacer} />
        </View>

        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.body}>
          <TouchableOpacity onPress={pickImage} style={styles.avatarPicker} activeOpacity={0.9}>
            {pickedUri || photoURL ? (
              <View style={styles.avatarRing}>
                <Image source={{ uri: pickedUri || photoURL }} style={styles.avatar} />
              </View>
            ) : (
              <View style={styles.avatarRing}>
                <View style={styles.avatarFallback}>
                  <Feather name="user" size={56} color="#FFFFFF" />
                </View>
              </View>
            )}
            <View style={styles.changePhotoPill}>
              {uploading ? <ActivityIndicator color="#ffffffff" /> : <Text style={styles.changePhotoText}>Change Photo</Text>}
            </View>
          </TouchableOpacity>

          <View style={styles.group}>
            <Text style={styles.label}>Display Name</Text>
            <View style={styles.inputRow}>
              <Feather name="user" size={18} color="#FFFFFF" />
              <TextInput
                value={displayName}
                onChangeText={setDisplayName}
                placeholder="Your name"
                placeholderTextColor="rgba(255,255,255,0.7)"
                style={styles.input}
              />
            </View>
          </View>

          {err ? <Text style={styles.err}>{err}</Text> : null}

          <TouchableOpacity style={styles.primaryBtn} onPress={onSave} disabled={saving || uploading} activeOpacity={0.9}>
            {saving ? <ActivityIndicator color="#0B0B12" /> : <Text style={styles.primaryText}>Save Changes</Text>}
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  safe: {
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  iconBtn: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  hitSlop: {
    top: 10,
    left: 10,
    right: 10,
    bottom: 10,
  },
  title: {
    flex: 1,
    fontSize: 22,
    fontWeight: "800",
    color: "#FFFFFF",
    textAlign: "center",
  },
  headerSpacer: {
    width: 28,
    height: 28,
  },
  body: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  avatarPicker: {
    alignItems: "center",
    marginBottom: 18,
  },
  avatarRing: {
    width: 152,
    height: 152,
    borderRadius: 76,
    padding: 4,
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 76,
    borderWidth: 3,
    borderColor: "#7AD7FF",
  },
  avatarFallback: {
    width: "100%",
    height: "100%",
    borderRadius: 76,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderWidth: 3,
    borderColor: "#7AD7FF",
  },
  changePhotoPill: {
    marginTop: 10,
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#45B7D1",
  },
  changePhotoText: {
    color: "#ffffffff",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
  group: {
    marginBottom: 14,
  },
  label: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 13,
    marginBottom: 8,
    fontWeight: "700",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    height: 52,
    borderRadius: 14,
    paddingHorizontal: 14,
    backgroundColor: "rgba(255,255,255,0.20)",
  },
  input: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
    marginLeft: 10,
  },
  err: {
    color: "#FFD1D1",
    marginTop: 6,
  },
  primaryBtn: {
    height: 52,
    borderRadius: 16,
    backgroundColor: "#45B7D1",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  primaryText: {
    color: "#ffffffff",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
});
