import { FlatList, View } from "react-native";
import { IconButton, Text } from "react-native-paper";
import { useApp } from "../context/AppContext";
import { confirm } from "../utils/confirm";
 
export default function HistoryScreen({ navigation }) {
  const { history, deleteEntry, clearHistory } = useApp();
 
  const remove = async (entry) => {
    const ok = await confirm({ title: "Delete this check-in?", confirmText: "Delete", destructive: true });
    if (ok) deleteEntry(entry.id);
  };
 
  const clearAll = async () => {
    const ok = await confirm({
      title: "Start fresh?",
      message: "This clears all your check-ins. It can't be undone.",
      confirmText: "Clear all",
      destructive: true,
    });
    if (ok) clearHistory();
  };
 
  const open = (entry) =>
    navigation.navigate(entry.result.risk_label === "high_risk" ? "Alert" : "LowRiskResult", { entry });
 
  return (
    <FlatList
      data={history}
      keyExtractor={(e) => e.id}
      contentContainerStyle={{ padding: 16 }}
      ListHeaderComponent={
        history.length ? <IconButton icon="trash-can-outline" onPress={clearAll} accessibilityLabel="Clear history" /> : null
      }
      ListEmptyComponent={<Text>Nothing here yet.</Text>}
      renderItem={({ item }) => (
        <View style={{ flexDirection: "row", alignItems: "center", padding: 12, marginBottom: 8, backgroundColor: "#fff", borderRadius: 12 }}>
          <Text style={{ flex: 1 }} onPress={() => open(item)}>
            {new Date(item.timestamp).toLocaleString()} {"  "}
            {Math.round(item.result.risk_probability * 100)}%
          </Text>
          <IconButton icon="trash-can-outline" onPress={() => remove(item)} accessibilityLabel="Delete this check-in" />
        </View>
      )}
    />
  );
}
