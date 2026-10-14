import { View } from "react-native";
import { IconButton, Text } from "react-native-paper";
 
// +/- buttons keep values inside the range the model was trained on.
export default function Stepper({ label, value, onChange, min, max, step = 1, unit = "" }) {
  const set = (v) => onChange(Math.min(max, Math.max(min, Math.round(v * 10) / 10)));
  return (
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
      <Text>{label}</Text>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <IconButton icon="minus" onPress={() => set(value - step)} disabled={value <= min} />
        <Text style={{ minWidth: 64, textAlign: "center" }}>
          {value}
          {unit}
        </Text>
        <IconButton icon="plus" onPress={() => set(value + step)} disabled={value >= max} />
      </View>
    </View>
  );
}
