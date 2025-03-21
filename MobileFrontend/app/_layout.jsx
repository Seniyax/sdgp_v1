<<<<<<< HEAD
import { Stack } from 'expo-router';
=======
// import { Stack } from 'expo-router';

// export default function Layout() {
//   return (
//     <Stack screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="index" options={{ headerShown: false, gestureEnabled: false }} />
//       <Stack.Screen name="home" options={{ headerShown: false, gestureEnabled: false }} />
//       <Stack.Screen name="Restaurants" options={{ title: "Restaurants", headerShown: true }} />
//       <Stack.Screen name="tableSelect" options={{ title: "Table Selection", headerShown: true }} />
//       <Stack.Screen name="payments" options={{ title: "Payments", headerShown: true }} />
//     </Stack>
//   );
// }

import { Stack } from "expo-router";
>>>>>>> teamA

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
<<<<<<< HEAD
      <Stack.Screen name="index" options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="home" options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="restaurants" options={{ title: "Restaurants", headerShown: true }} />
      <Stack.Screen name="tableSelect" options={{ title: "Table Selection", headerShown: true }} />
      <Stack.Screen name="payments" options={{ title: "Payments", headerShown: true }} />
=======
      <Stack.Screen
        name="index"
        options={{ headerShown: false, gestureEnabled: false }}
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
>>>>>>> teamA
    </Stack>
  );
}
