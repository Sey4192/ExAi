import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppProvider } from "./src/context/AppContext";
import HomeScreen from "./src/screens/HomeScreen";
import CheckScreen from "./src/screens/CheckScreen";
import HistoryScreen from "./src/screens/HistoryScreen";
import AlertScreen from "./src/screens/AlertScreen";
import LowRiskResultScreen from "./src/screens/LowRiskResultScreen";
import ExplanationScreen from "./src/screens/ExplanationScreen";
import BreakScreen from "./src/screens/BreakScreen";
 
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
 
function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Check" component={CheckScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
    </Tab.Navigator>
  );
}
 
export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <AppProvider>
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
              <Stack.Screen name="Alert" component={AlertScreen} options={{ title: "A gentle nudge" }} />
              <Stack.Screen name="LowRiskResult" component={LowRiskResultScreen} options={{ title: "Checked in" }} />
              <Stack.Screen name="Explanation" component={ExplanationScreen} options={{ title: "Why you're seeing this" }} />
              <Stack.Screen name="Break" component={BreakScreen} options={{ title: "A minute for you" }} />
            </Stack.Navigator>
          </NavigationContainer>
        </AppProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
