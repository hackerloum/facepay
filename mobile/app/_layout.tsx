import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#0A0F1E" },
        headerTintColor: "#00D4FF",
        headerTitleStyle: { fontFamily: "System" },
      }}
    >
      <Stack.Screen name="index" options={{ title: "FacePay" }} />
      <Stack.Screen name="scan" options={{ title: "Scan Face" }} />
      <Stack.Screen name="confirm" options={{ title: "Confirm Payment" }} />
      <Stack.Screen name="status" options={{ title: "Payment Status" }} />
    </Stack>
  );
}
