import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "./Component/HomeScreen";
import AuthenticateScreen from "./Component/AuthenticateScreen";
import UserAccountScreen from "./Component/UserAccountScreen";

const Stack = createNativeStackNavigator();

const config = {
  screens: {
    Home: "",
    Authenticate: "authenticate",
    User: "user",
  },
};

const linking = {
  prefixes: ["/"],
  config,
  cardStyle: { backgroundColor: "#fff" },
};

function App() {
  return (
    <NavigationContainer
      linking={linking}
      fallback={<Text>Loading...</Text>}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          options={{ headerShown: false }}
          component={HomeScreen}
        />
        <Stack.Screen
          name="Authenticate"
          options={{ headerShown: true }}
          component={AuthenticateScreen}
        />
        <Stack.Screen
          name="User"
          component={UserAccountScreen}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
