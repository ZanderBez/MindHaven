import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { signOut } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";
import BottomNav from "../components/BottomNav";
import GlobalBackground from "../components/GlobalBackground";
import { auth } from "../firebase";
import { styles } from "../styles/profile";
import { useProfileUser } from "../hooks/useProfileUser";
import ProfileAvatar from "../components/ProfileAvatar";

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const { name, photo, cacheBust } = useProfileUser();
  const tagline = "Taking it one day at a time.";

  const handleTab = (tab: "home" | "journal" | "chats" | "profile") => {
    if (tab === "home") navigation.navigate("Home");
    if (tab === "journal") navigation.navigate("Journal");
    if (tab === "chats") navigation.navigate("Chats");
    if (tab === "profile") navigation.navigate("Profile");
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigation.reset({ index: 0, routes: [{ name: "SignIn" }] });
  };

  return (
    <View style={styles.root}>
      <GlobalBackground />
      <View style={styles.overlay} />
      <SafeAreaView style={styles.safe}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Profile</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatarRing}>
              <ProfileAvatar
                uri={photo}
                cacheBust={cacheBust}
                inheritSize
                showRing={false}
                containerStyle={styles.avatar}
                imageStyle={styles.avatar}
                fallbackStyle={styles.avatarFallback}
              />
            </View>
          </View>

          <Text style={styles.name}>{name}</Text>
          {!!tagline && <Text style={styles.tagline}>{tagline}</Text>}

          <View style={styles.actions}>
            <GlassRow label="Edit Profile" onPress={() => navigation.navigate("EditProfile")} />
            <GlassRow label="Change Password" onPress={() => navigation.navigate("ChangePassword")} />
            <GlassRow label="Journal" onPress={() => navigation.navigate("Journal")} />
          </View>

          <View style={{ flex: 1 }} />

          <TouchableOpacity style={styles.signOutBtn} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={18} color="#ffffffff" style={{ marginRight: 8 }} />
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        <BottomNav active="profile" onChange={handleTab} />
      </SafeAreaView>
    </View>
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
