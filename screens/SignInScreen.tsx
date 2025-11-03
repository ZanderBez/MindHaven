import React, { useState } from "react"
import { View, Text, TextInput, Pressable, ActivityIndicator, Alert, StyleSheet, ImageBackground, Image, ScrollView, Platform, KeyboardAvoidingView, TouchableOpacity } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Feather } from "@expo/vector-icons"
import { loginUser } from "../services/authService"

export default function SignInScreen() {
  const navigation = useNavigation<any>()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async () => {
    setError(null)
    if (!email.trim() || !password) { setError("Please enter your email and password."); return }
    setLoading(true)
    try {
      await loginUser(email.trim(), password)
      navigation.reset({ index: 0, routes: [{ name: "Home" }] })
    } catch (e: any) {
      setError(e?.message ?? "Failed to sign in.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.select({ ios: "padding", android: undefined })}>
      <ImageBackground source={require("../assets/Background.png")} style={styles.bg} imageStyle={styles.bgImage}>
        <View style={styles.header}>
          <Image source={require("../assets/mindhaven-logo.png")} style={styles.logo} resizeMode="contain" />
        </View>
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
              <Text style={styles.muted}>Already have an account </Text>
              <Text onPress={() => navigation.navigate("SignUp")} style={styles.loginLink}>Sign Up</Text>
              <Text style={styles.muted}> ?</Text>
            </View>
            <View style={styles.divider} />
            <Pressable style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]} onPress={onSubmit} disabled={loading}>
              {loading ? <ActivityIndicator /> : <Text style={styles.buttonText}>LOG IN</Text>}
            </Pressable>
          </View>
        </ScrollView>
      </ImageBackground>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  bg: {
    flex: 1
  },
  bgImage: {
    width: "100%",
    height: "100%"
  },
  header: {
    height: 160,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 40
  },
  logo: {
    marginTop: 200,
    width: 700,
    height: 400
  },
  bottomFill: {
    flexGrow: 1,
    justifyContent: "flex-end"
  },
  card: {
    backgroundColor: "#E6E6E6",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
    minHeight: "65%"
  },
  welcome: {
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 16
  },
  label: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 8,
    marginBottom: 6
  },
  input: {
    borderWidth: 1,
    borderColor: "#333333",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF"
  },
  passwordRow: {
    flexDirection: "row",
    alignItems: "center"
  },
  iconWrap: {
    position: "absolute",
    right: 12,
    padding: 4
  },
  error: {
    color: "crimson",
    marginTop: 10
  },
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 14
  },
  muted: {
    color: "#444444"
  },
  loginLink: {
    fontWeight: "700",
    color: "#000000"
  },
  divider: {
    height: 2,
    backgroundColor: "#111111",
    width: "70%",
    alignSelf: "center",
    marginVertical: 18
  },
  button: {
    backgroundColor: "#2FB0DE",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 24
  },
  buttonPressed: {
    opacity: 0.9
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 1
  }
})