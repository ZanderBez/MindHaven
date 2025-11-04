import React, { useState } from "react"
import { View, Text, TextInput, Pressable, ActivityIndicator, Alert, StyleSheet, ImageBackground, Image, ScrollView, Platform, KeyboardAvoidingView, TouchableOpacity } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Feather } from "@expo/vector-icons"
import { registerUser } from "../services/authService"
import { styles } from "../styles/signup";


export default function SignUpScreen() {
  const navigation = useNavigation<any>();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    setError(null);
    if (!name.trim() || !email.trim() || !password || !confirm) {
      setError("Please complete all fields.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await registerUser(name.trim(), email.trim(), password);
      navigation.navigate("Home");
    } catch (e: any) {
      setError(e?.message ?? "Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.select({ ios: "padding", android: undefined })}>
      <ImageBackground source={require("../assets/Background.png")} style={styles.bg} imageStyle={styles.bgImage}>
        <View style={styles.overlay}>
          <View style={styles.header}>
            <Image source={require("../assets/mindhaven-logo.png")} style={styles.logo} resizeMode="contain" />
          </View>
          <ScrollView contentContainerStyle={styles.bottomFill} keyboardShouldPersistTaps="handled">
            <View style={styles.card}>
              <Text style={styles.welcome}>WELCOME.</Text>

              <Text style={styles.label}>Name</Text>
              <TextInput style={styles.input} placeholder="name" value={name} onChangeText={setName} autoCapitalize="words" />

              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />

              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordRow}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.iconWrap}>
                  <Feather name={showPassword ? "eye-off" : "eye"} size={20} color="#333333" />
                </TouchableOpacity>
              </View>

              <Text style={styles.label}>Confirm Password</Text>
              <View style={styles.passwordRow}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="confirm password"
                  value={confirm}
                  onChangeText={setConfirm}
                  secureTextEntry={!showConfirm}
                />
                <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)} style={styles.iconWrap}>
                  <Feather name={showConfirm ? "eye-off" : "eye"} size={20} color="#333333" />
                </TouchableOpacity>
              </View>

              {error ? <Text style={styles.error}>{error}</Text> : null}

              <View style={styles.loginRow}>
                <Text style={styles.muted}>Already have an account </Text>
                <Text onPress={() => navigation.navigate("SignIn")} style={styles.loginLink}>Log In</Text>
                <Text style={styles.muted}> ?</Text>
              </View>

              <View style={styles.divider} />

              <Pressable style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]} onPress={onSubmit} disabled={loading}>
                {loading ? <ActivityIndicator /> : <Text style={styles.buttonText}>SIGN UP</Text>}
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}