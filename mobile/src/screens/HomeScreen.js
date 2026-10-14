import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import { useApp, useRunCheck } from "../context/AppContext";
 
export default function HomeScreen({ navigation }) {
  const { history } = useApp();
  const { run, loading, error } = useRunCheck(navigation);
  const last = history[0];
 
  return (
    <View style={{ flex: 1, padding: 24, gap: 16 }}>
      <Text variant="headlineSmall">How's your day going?</Text>
      {last ? (
        <Text>Last check: {Math.round(last.result.risk_probability * 100)}% risk</Text>
      ) : (
        <Text>Your numbers will show up after your first check-in.</Text>
      )}
      <Button mode="contained" onPress={() => navigation.navigate("Check")}>
        Check in
      </Button>
      <Button onPress={() => run()} loading={loading}>
        or try a sample session
      </Button>
      {error && <Text style={{ color: "crimson" }}>{error}</Text>}
    </View>
  );
}
