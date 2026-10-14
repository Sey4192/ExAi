import { View } from "react-native";
import { Button, Text } from "react-native-paper";
 
export default function AlertScreen({ route, navigation }) {
  const { entry } = route.params;
  const percent = Math.round(entry.result.risk_probability * 100);
 
  return (
    <View style={{ flex: 1, padding: 24, gap: 16, backgroundColor: "#FBF1E6" }}>
      <Text variant="displaySmall" style={{ color: "#C9772B" }}>
        {percent}%
      </Text>
      <Text variant="titleLarge">{entry.result.intervention.message}</Text>
      <Button onPress={() => navigation.navigate("Explanation", { entry })}>Why am I seeing this?</Button>
      <Button mode="contained" onPress={() => navigation.replace("Break")}>
        Take a breather
      </Button>
      <Button onPress={() => navigation.popToTop()}>I'm okay</Button>
    </View>
  );
}
