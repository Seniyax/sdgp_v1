import { Stack } from "expo-router";
import { ThemeProvider } from "../contexts/ThemeContext";
import { AuthProvider } from "../contexts/AuthContext";

export default function Layout() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name="index"
            options={{ headerShown: false, gestureEnabled: false }}
          />
          <Stack.Screen
            name="home"
            options={{ headerShown: false, gestureEnabled: false }}
          />
          <Stack.Screen
            name="restaurants"
            options={{ title: "Restaurants", headerShown: true }}
          />
          <Stack.Screen
            name="hotels"
            options={{ title: "Hotels", headerShown: true }}
          />
          <Stack.Screen
            name="saloons"
            options={{ title: "Saloons", headerShown: true }}
          />
          <Stack.Screen
            name="theatres"
            options={{ title: "Theatres", headerShown: true }}
          />
          <Stack.Screen
            name="spas"
            options={{ title: "Spas", headerShown: true }}
          />
          <Stack.Screen
            name="floorPlan"
            options={{
              headerShown: false,
              title: "Floor Plan",
              gestureEnabled: true,
            }}
          />
          <Stack.Screen
            name="makeReservation"
            options={{
              headerShown: false,
              title: "Create Reservation",
              gestureEnabled: true,
            }}
          />
          <Stack.Screen
            name="payments"
            options={{ title: "Payments", headerShown: false }}
          />
          <Stack.Screen
            name="auth/signin"
            options={{ title: "Sign In", headerShown: false }}
          />
          <Stack.Screen
            name="auth/signup"
            options={{ title: "Sign Up", headerShown: false }}
          />
          <Stack.Screen
            name="auth/reset-password"
            options={{ title: "Reset Password", headerShown: false }}
          />
        </Stack>
      </ThemeProvider>
    </AuthProvider>
  );
}
