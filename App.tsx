import "react-native-gesture-handler";
import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Asset } from "expo-asset";
import SplashScreenView from "./screens/SplashScreen";
import SignUpScreen from "./screens/SignUpScreen";
import SignInScreen from "./screens/SignInScreen";
import HomeScreen from "./screens/HomeScreen";
import JournalListScreen from "./screens/JournalListScreen";
import ProfileScreen from "./screens/ProfileScreen";
import ChatsScreen from "./screens/ChatsScreen";
import ChatRoomScreen from "./screens/ChatRoomScreen";
import EditProfileScreen from "./screens/EditProfileScreen";
import ChangePasswordScreen from "./screens/ChangePasswordScreen";
import JournalEditScreen from "./screens/JournalEditScreen";

const Stack = createNativeStackNavigator();
const theme = { ...DarkTheme, colors: { ...DarkTheme.colors, background: "#1C1C1C", card: "#1C1C1C" } };
const BG = require("./assets/Background.png");

export default function App() {
  useEffect(() => {
    Asset.loadAsync([BG]).catch(() => {});
  }, []);

  return (
    <GestureHandlerRootView style={styles.root}>
      <NavigationContainer theme={theme}>
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#1C1C1C" },
            gestureEnabled: false, 
          }}
        >
          <Stack.Screen name="Splash" component={SplashScreenView} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Journal" component={JournalListScreen} />
          <Stack.Screen name="JournalEdit" component={JournalEditScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Chats" component={ChatsScreen} />
          <Stack.Screen name="ChatRoom" component={ChatRoomScreen} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#1C1C1C",
  },
});
