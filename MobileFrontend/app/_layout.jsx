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
            name="officeRooms"
            options={{ title: "Office Rooms", headerShown: true }}
          />
          <Stack.Screen
            name="tableSelect"
            options={{ title: "Table Selection", headerShown: true }}
          />
          <Stack.Screen
            name="payments"
            options={{ title: "Payments", headerShown: true }}
          />
          <Stack.Screen
            name="floorPlan"
            options={{
              headerShown: true,
              title: "Floor Plan",
              gestureEnabled: true,
            }}
          />
          <Stack.Screen
            name="makeReservation"
            options={{
              headerShown: true,
              title: "Create Reservation",
              gestureEnabled: true,
            }}
          />
          <Stack.Screen
            name="payments_uvindu"
            options={{ title: "Payments", headerShown: true }}
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
          <Stack.Screen
            name="profile"
            options={{ title: "Reset Password", headerShown: false }}
          />
        </Stack>
      </ThemeProvider>
    </AuthProvider>
  );
}
