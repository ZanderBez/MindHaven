import React from "react";
import { View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator, Image, Alert,} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import GlobalBackground from "../components/GlobalBackground";
import { styles } from "../styles/editProfile";
import { useEditProfile } from "../hooks/useEditProfile";

export default function EditProfileScreen() {
  const navigation = useNavigation<any>();
  const {
    displayName,
    setDisplayName,
    photoURL,
    pickedUri,
    uploading,
    saving,
    err,
    pickImage,
    save,
  } = useEditProfile();

  const onSave = async () => {
    const res = await save();
    if (res.ok) {
      navigation.navigate("Profile", { refresh: res.ts });
    } else if (res.error) {
      Alert.alert("Save failed", res.error);
    }
  };

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
