import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  ImageBackground,
  Image,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { loginUser } from "../services/authService";
import { styles } from "../styles/signin";

export default function SignInScreen() {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    setError(null);
    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setLoading(true);
    try {
      await loginUser(email.trim(), password);
      navigation.reset({ index: 0, routes: [{ name: "Home" }] });
    } catch (e: any) {
      setError(e?.message ?? "Failed to sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground source={require("../assets/Background.png")} style={styles.bg} imageStyle={styles.bgImage}>
      <View style={styles.overlay}>
        <View style={styles.header}>
          <Image source={require("../assets/mindhaven-logo.png")} style={styles.logo} resizeMode="contain" />
        </View>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? -20 : 0}
        >
          <ScrollView contentContainerStyle={styles.bottomFill} keyboardShouldPersistTaps="handled">
            <View style={styles.card}>
              <Text style={styles.welcome}>WELCOME BACK</Text>

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

              {error ? <Text style={styles.error}>{error}</Text> : null}

              <View style={styles.loginRow}>
                <Text style={styles.muted}>Don't have an account? </Text>
                <Text onPress={() => navigation.navigate("SignUp")} style={styles.loginLink}>Sign Up</Text>
              </View>

              <View style={styles.divider} />

              <Pressable
                style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
                onPress={onSubmit}
                disabled={loading}
              >
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>LOG IN</Text>}
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </ImageBackground>
  );
}
