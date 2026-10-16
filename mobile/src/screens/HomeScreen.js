import { useEffect, useState } from "react";
import { Platform, View } from "react-native";
import { Button, Card, Text } from "react-native-paper";
import * as Notifications from "expo-notifications";
import { useApp, useRunCheck } from "../context/AppContext";
import { enableReminders, planEveningReminders, sendTestNotification } from "../notifications/notifications";

export default function HomeScreen({ navigation }) {
  const { history } = useApp();
  const { run, loading, error } = useRunCheck(navigation);
  const [askReminders, setAskReminders] = useState(false);
  const last = history[0];

  // Offer reminders only on a phone, and only if they aren't switched on yet.
  useEffect(() => {
    if (Platform.OS === "web") return;
    Notifications.getPermissionsAsync().then(({ granted }) => setAskReminders(!granted));
  }, []);

  const turnOn = async () => {
    const granted = await enableReminders(); // shows Android's permission prompt
    if (granted) {
      await planEveningReminders(history);
      await sendTestNotification();
      setAskReminders(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 24, gap: 16 }}>
      <Text variant="headlineSmall">How's your day going?</Text>
      {last ? (
        <Text>Last check: {Math.round(last.result.risk_probability * 100)}% risk</Text>
      ) : (
        <Text>Your numbers will show up after your first check-in.</Text>
      )}

      {askReminders && (
        <Card>
          <Card.Title title="Can I check in with you?" />
          <Card.Content>
            <Text>
              Now and then I'll send a gentle evening check-in. You can turn it off anytime in your
              phone's settings.
            </Text>
          </Card.Content>
          <Card.Actions>
            <Button onPress={() => setAskReminders(false)}>Not now</Button>
            <Button mode="contained" onPress={turnOn}>
              Yes, check in with me
            </Button>
          </Card.Actions>
        </Card>
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
