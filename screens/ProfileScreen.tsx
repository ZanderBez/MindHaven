import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useFocusEffect, useRoute, RouteProp } from "@react-navigation/native";
import { signOut, onIdTokenChanged } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";
import BottomNav from "../components/BottomNav";
import { auth } from "../firebase";

type RootStackParamList = {
  Profile: { refresh?: number } | undefined;
};
type ProfileRouteProp = RouteProp<RootStackParamList, "Profile">;

export default function ProfileScreen() {
  const navigation = useNavigation();
  const route = useRoute<ProfileRouteProp>();
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

  useEffect(() => {
    if (route.params?.refresh) {
      (async () => {
        await auth.currentUser?.reload();
        const u = auth.currentUser;
        setName(u?.displayName || "Guest");
        setPhoto(u?.photoURL || undefined);
        setCacheBust(route.params?.refresh || Date.now());
      })();
      navigation.setParams({ refresh: undefined } as any);
    }
  }, [route.params?.refresh]);

  const handleTab = (tab: "home" | "chats" | "profile") => {
    if (tab === "home") navigation.navigate("Home" as never);
    if (tab === "chats") navigation.navigate("Chats" as never);
    if (tab === "profile") navigation.navigate("Profile" as never);
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigation.reset({ index: 0, routes: [{ name: "SignIn" as never }] });
  };

  const tagline = "Taking it one day at a time.";

  return (
    <ImageBackground
      source={require("../assets/Background.png")}
      resizeMode="cover"
      style={styles.bg}
      imageStyle={styles.bgImage}
    >
      <SafeAreaView style={styles.safe}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
            hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
          >
            <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.title}>Profile</Text>
          <View style={{ width: 28 }} />
        </View>

        <View style={styles.content}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatarRing}>
              {photo ? (
                <Image source={{ uri: `${photo}${photo.includes("?") ? "&" : "?"}v=${cacheBust}` }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatar, styles.avatarFallback]}>
                  <Ionicons name="person" size={56} color="#ffffff" />
                </View>
              )}
            </View>
          </View>

          <Text style={styles.name}>{name}</Text>
          {!!tagline && <Text style={styles.tagline}>{tagline}</Text>}

          <View style={styles.actions}>
            <GlassRow
              label="Edit Profile"
              onPress={() => navigation.navigate("EditProfile" as never)}
            />
            <GlassRow
              label="Change Password"
              onPress={() => navigation.navigate("ChangePassword" as never)}
            />
            <GlassRow
              label="Journal"
              onPress={() => navigation.navigate("Journal" as never)}
            />
          </View>

          <View style={{ flex: 1 }} />

          <TouchableOpacity style={styles.signOutBtn} onPress={handleLogout}>
            <Ionicons
              name="log-out-outline"
              size={18}
              color="#ffffffff"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        <BottomNav active="profile" onChange={handleTab} />
      </SafeAreaView>
    </ImageBackground>
  );
}

function GlassRow({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.rowBtn} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Ionicons name="chevron-forward" size={22} color="#FFFFFF" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  bgImage: { opacity: 1 },
  safe: { flex: 1 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  backBtn: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    flex: 1,
    fontSize: 22,
    fontWeight: "800",
    color: "#FFF",
    textAlign: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 88,
  },
  avatarWrap: {
    alignItems: "center",
    marginTop: 8,
    marginBottom: 8,
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
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    width: "100%",
    height: "100%",
    borderRadius: 76,
    borderWidth: 3,
    borderColor: "#7AD7FF",
  },
  name: {
    textAlign: "center",
    color: "#FFF",
    fontSize: 20,
    fontWeight: "800",
    marginTop: 6,
  },
  tagline: {
    textAlign: "center",
    color: "rgba(255,255,255,0.85)",
    fontSize: 13,
    marginTop: 6,
  },
  actions: {
    marginTop: 18,
    gap: 12,
  },
  rowBtn: {
    height: 56,
    borderRadius: 14,
    paddingHorizontal: 16,
    backgroundColor: "rgba(255,255,255,0.20)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowLabel: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  signOutBtn: {
    height: 52,
    borderRadius: 16,
    backgroundColor: "#45B7D1",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 16,
    marginTop: 16,
  },
  signOutText: {
    color: "#ffffffff",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
});
