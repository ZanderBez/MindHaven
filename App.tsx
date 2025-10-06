import "react-native-gesture-handler"
import React from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { GestureHandlerRootView } from "react-native-gesture-handler"

import SplashScreen from "./screens/SplashScreen"
import SignUpScreen from "./screens/SignUpScreen"
import ChatScreen from "./screens/ChatScreen"

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="Chat" component={ChatScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  )
}
