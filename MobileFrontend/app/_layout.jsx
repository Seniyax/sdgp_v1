import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="home" options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="restaurants" options={{ title: "Restaurants", headerShown: true }} />
      <Stack.Screen name="tableSelect" options={{ title: "Table Selection", headerShown: true }} />
      <Stack.Screen name="payments" options={{ title: "Payments", headerShown: true }} />
    </Stack>
  );
}
