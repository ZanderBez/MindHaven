import "react-native-gesture-handler"
import React from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { StyleSheet } from "react-native"
import { setLogLevel } from "firebase/firestore"
import SplashScreen from "./screens/SplashScreen"
import SignUpScreen from "./screens/SignUpScreen"
import SignInScreen from "./screens/SignInScreen"
import HomeScreen from "./screens/HomeScreen"
import JournalScreen from './screens/JournalScreen'
import ProfileScreen from './screens/ProfileScreen'
import ChatsScreen from "./screens/ChatsScreen"
import ChatRoomScreen from "./screens/ChatRoomScreen"



const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Journal" component={JournalScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Chats" component={ChatsScreen} />
          <Stack.Screen name="ChatRoom" component={ChatRoomScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1
  }
})
