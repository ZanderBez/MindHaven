import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { EmailAuthProvider, getAuth, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import { Feather } from "@expo/vector-icons";
import GlobalBackground from "../components/GlobalBackground";
import { styles } from "../styles/changePassword";

export default function ChangePasswordScreen() {
  const navigation = useNavigation<any>();
  const auth = getAuth();
  const user = auth.currentUser;

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    setErr(null);
    setOk(null);
  }, [currentPassword, newPassword, confirmPassword]);

  async function onChangePassword() {
    if (!user?.email) return;
    if (!currentPassword || !newPassword) {
      setErr("Please fill in all fields");
      return;
    }
    if (newPassword.length < 6) {
      setErr("New password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErr("Passwords do not match");
      return;
    }
    setSaving(true);
    setErr(null);
    setOk(null);
    try {
      const cred = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, cred);
      await updatePassword(user, newPassword);
      setOk("Password updated");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => navigation.goBack(), 600);
    } catch (e: any) {
      setErr(e?.message || "Could not update password");
    } finally {
      setSaving(false);
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
          <Text style={styles.title}>Change Password</Text>
          <View style={styles.headerSpacer} />
        </View>

        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.body}>
          <View style={styles.group}>
            <Text style={styles.label}>Current Password</Text>
            <View style={styles.inputRow}>
              <Feather name="lock" size={18} color="#FFFFFF" />
              <TextInput
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Enter current password"
                placeholderTextColor="rgba(255,255,255,0.7)"
                secureTextEntry={!showCurrent}
                style={styles.input}
              />
              <TouchableOpacity onPress={() => setShowCurrent((v) => !v)} style={styles.eyeBtn} hitSlop={styles.hitSlop as any}>
                <Feather name={showCurrent ? "eye" : "eye-off"} size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.group}>
            <Text style={styles.label}>New Password</Text>
            <View style={styles.inputRow}>
              <Feather name="key" size={18} color="#FFFFFF" />
              <TextInput
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Enter new password"
                placeholderTextColor="rgba(255,255,255,0.7)"
                secureTextEntry={!showNew}
                style={styles.input}
              />
              <TouchableOpacity onPress={() => setShowNew((v) => !v)} style={styles.eyeBtn} hitSlop={styles.hitSlop as any}>
                <Feather name={showNew ? "eye" : "eye-off"} size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.group}>
            <Text style={styles.label}>Confirm Password</Text>
            <View style={styles.inputRow}>
              <Feather name="check-circle" size={18} color="#FFFFFF" />
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm new password"
                placeholderTextColor="rgba(255,255,255,0.7)"
                secureTextEntry={!showConfirm}
                style={styles.input}
              />
              <TouchableOpacity onPress={() => setShowConfirm((v) => !v)} style={styles.eyeBtn} hitSlop={styles.hitSlop as any}>
                <Feather name={showConfirm ? "eye" : "eye-off"} size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          {err ? <Text style={styles.err}>{err}</Text> : null}
          {ok ? <Text style={styles.ok}>{ok}</Text> : null}

          <TouchableOpacity style={styles.primaryBtn} onPress={onChangePassword} disabled={saving} activeOpacity={0.9}>
            {saving ? <ActivityIndicator color="#0B0B12" /> : <Text style={styles.primaryText}>Update Password</Text>}
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
