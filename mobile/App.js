import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Platform, View, useWindowDimensions } from "react-native";
import {
  NavigationContainer,
  createNavigationContainerRef,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MD3LightTheme, PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as Notifications from "expo-notifications";
import { AppProvider } from "./src/context/AppContext";
import HomeScreen from "./src/screens/HomeScreen";
import CheckScreen from "./src/screens/CheckScreen";
import HistoryScreen from "./src/screens/HistoryScreen";
import AlertScreen from "./src/screens/AlertScreen";
import LowRiskResultScreen from "./src/screens/LowRiskResultScreen";
import ExplanationScreen from "./src/screens/ExplanationScreen";
import BreakScreen from "./src/screens/BreakScreen";
// Side effect: defines the background task before the app renders.
import "./src/notifications/backgroundTask";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const navigationRef = createNavigationContainerRef();

function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="home-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Check"
        component={CheckScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="radar" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="history" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Opens the right tab when a notification is tapped, including when the tap launched the app.
function NotificationRouter({ navReady }) {
  const response = Notifications.useLastNotificationResponse();
  useEffect(() => {
    const screen = response?.notification.request.content.data?.screen;
    if (navReady && screen) navigationRef.navigate("Main", { screen });
  }, [response, navReady]);
  return null;
}
// On wide browser windows, keep a phone-sized column in the middle.
function WebFrame({ children }) {
  const { width } = useWindowDimensions();
  if (Platform.OS !== "web" || width <= 480) return children;
  return (
    <View style={{ flex: 1, alignItems: "center", backgroundColor: "#DCE6EC" }}>
      <View style={{ flex: 1, width: 440, overflow: "hidden" }}>
        {children}
      </View>
    </View>
  );
}

export default function App() {
  const [navReady, setNavReady] = useState(false);

  return (
    <SafeAreaProvider>
      <PaperProvider theme={MD3LightTheme}>
        <AppProvider>
          <WebFrame>
            <NavigationContainer
              ref={navigationRef}
              onReady={() => setNavReady(true)}
            >
              {Platform.OS !== "web" && (
                <NotificationRouter navReady={navReady} />
              )}
              <Stack.Navigator>
                <Stack.Screen
                  name="Main"
                  component={MainTabs}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Alert"
                  component={AlertScreen}
                  options={{ title: "A gentle nudge" }}
                />
                <Stack.Screen
                  name="LowRiskResult"
                  component={LowRiskResultScreen}
                  options={{ title: "Checked in" }}
                />
                <Stack.Screen
                  name="Explanation"
                  component={ExplanationScreen}
                  options={{ title: "Why you're seeing this" }}
                />
                <Stack.Screen
                  name="Break"
                  component={BreakScreen}
                  options={{ title: "A minute for you" }}
                />
              </Stack.Navigator>
            </NavigationContainer>
          </WebFrame>
        </AppProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
