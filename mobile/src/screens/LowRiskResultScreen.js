import { View } from "react-native";
import { Button, Text } from "react-native-paper";
 
export default function LowRiskResultScreen({ route, navigation }) {
  const { entry } = route.params;
  const percent = Math.round(entry.result.risk_probability * 100);
 
  return (
    <View style={{ flex: 1, padding: 24, gap: 16, backgroundColor: "#EAF4EE" }}>
      <Text variant="displaySmall" style={{ color: "#4C8C6A" }}>
        {percent}%
      </Text>
      <Text variant="titleLarge">This looks like a balanced session. Nice one.</Text>
      <Button onPress={() => navigation.navigate("Explanation", { entry })}>See what shaped this</Button>
      <Button mode="contained" onPress={() => navigation.popToTop()}>
        Done
      </Button>
    </View>
  );
}
