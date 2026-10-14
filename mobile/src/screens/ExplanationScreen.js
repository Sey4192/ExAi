import { ScrollView, View } from "react-native";
import { Text } from "react-native-paper";
 
const NAMES = {
  screen_time_hrs: "Screen time",
  frequency: "App opens",
  session_duration_min: "Session length",
  hour_of_day: "Time of day",
};
 
// Bar length shows size; amber raised the risk, green lowered it.
function Bar({ value, max }) {
  const width = `${Math.min(100, (Math.abs(value) / max) * 100)}%`;
  return (
    <View style={{ height: 8, backgroundColor: "#E4E8EC", borderRadius: 4 }}>
      <View style={{ width, height: 8, borderRadius: 4, backgroundColor: value > 0 ? "#C9772B" : "#4C8C6A" }} />
    </View>
  );
}
 
export default function ExplanationScreen({ route }) {
  const { shap, lime, top_feature } = route.params.entry.result.explanation;
  const all = [...Object.values(shap), ...Object.values(lime)].map(Math.abs);
  const max = Math.max(...all, 0.001);
  const limeTop = Object.keys(lime).reduce((a, b) => (Math.abs(lime[a]) >= Math.abs(lime[b]) ? a : b));
 
  return (
    <ScrollView contentContainerStyle={{ padding: 24, gap: 16 }}>
      <Text variant="titleLarge">Mostly: {NAMES[top_feature]}</Text>
      <Text>
        {limeTop === top_feature
          ? "SHAP and LIME agree on the main factor."
          : "SHAP and LIME point to different main factors."}
      </Text>
      {Object.keys(NAMES).map((f) => (
        <View key={f} style={{ gap: 4 }}>
          <Text variant="labelLarge">{NAMES[f]}</Text>
          <Text>SHAP {shap[f].toFixed(3)}</Text>
          <Bar value={shap[f]} max={max} />
          <Text>LIME {lime[f].toFixed(3)}</Text>
          <Bar value={lime[f]} max={max} />
        </View>
      ))}
    </ScrollView>
  );
}
