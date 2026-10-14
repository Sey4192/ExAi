import { useEffect, useRef, useState } from "react";
import { Animated, View } from "react-native";
import { Button, Text } from "react-native-paper";
 
export default function BreakScreen({ navigation }) {
  const [left, setLeft] = useState(60);
  const scale = useRef(new Animated.Value(0.7)).current;
 
  useEffect(() => {
    const breathe = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, { toValue: 1, duration: 4000, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 0.7, duration: 4000, useNativeDriver: true }),
      ])
    );
    breathe.start();
    const timer = setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000);
    return () => {
      breathe.stop();
      clearInterval(timer);
    };
  }, [scale]);
 
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 24 }}>
      <Animated.View
        style={{ width: 200, height: 200, borderRadius: 100, backgroundColor: "#9CC3D5", transform: [{ scale }] }}
      />
      <Text variant="headlineSmall">{left > 0 ? `0:${String(left).padStart(2, "0")}` : "Welcome back."}</Text>
      <Button mode="contained" onPress={() => navigation.popToTop()}>
        {left > 0 ? "Stop early" : "Done"}
      </Button>
    </View>
  );
}
