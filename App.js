import { StatusBar } from "expo-status-bar";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { ApplicationProvider } from "@ui-kitten/components";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as eva from "@eva-design/eva";
import Home from "./src/pages/home";
import WifiSetup from "./src/pages/wifiSetup";
const Stack = createNativeStackNavigator();
export default function App() {
  function RootStack() {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Wifi" component={WifiSetup} />
        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>
    );
  }

  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>
      <StatusBar style="auto" />
    </ApplicationProvider>
  );
}
