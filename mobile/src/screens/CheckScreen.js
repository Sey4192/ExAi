import { useState } from "react";
import { ScrollView } from "react-native";
import { Button, Text } from "react-native-paper";
import Stepper from "../components/Stepper";
import { useRunCheck } from "../context/AppContext";
 
export default function CheckScreen({ navigation }) {
  const [screen, setScreen] = useState(2);
  const [opens, setOpens] = useState(15);
  const [length, setLength] = useState(20);
  const [hour, setHour] = useState(new Date().getHours());
  const { run, loading, error } = useRunCheck(navigation);
 
  const submit = () =>
    run({ screen_time_hrs: screen, frequency: opens, session_duration_min: length, hour_of_day: hour });
 
  return (
    <ScrollView contentContainerStyle={{ padding: 24, gap: 8 }}>
      <Text variant="titleMedium">Tell me about this session</Text>
      <Stepper label="Screen time today" value={screen} onChange={setScreen} min={0.5} max={10} step={0.5} unit=" h" />
      <Stepper label="App opens today" value={opens} onChange={setOpens} min={1} max={80} />
      <Stepper label="This session" value={length} onChange={setLength} min={1} max={120} step={5} unit=" min" />
      <Stepper label="Time of day" value={hour} onChange={setHour} min={0} max={23} unit=":00" />
      <Button mode="contained" onPress={submit} loading={loading} style={{ marginTop: 16 }}>
        Check in
      </Button>
      {error && <Text style={{ color: "crimson" }}>{error}</Text>}
    </ScrollView>
  );
}
