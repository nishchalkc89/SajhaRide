/** Captain section — a Stack holding the tab shell + the ride-flow screens. */

import { Stack } from 'expo-router';

export default function CaptainLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="register" />
      <Stack.Screen name="wallet" />
      <Stack.Screen name="heatmap" />
      {/* Ride flow */}
      <Stack.Screen name="ride-details" />
      <Stack.Screen name="accepted" options={{ animation: 'fade' }} />
      <Stack.Screen name="navigate" />
      <Stack.Screen name="arrived" />
      <Stack.Screen name="verify" />
      <Stack.Screen name="ride" />
      <Stack.Screen name="payment" />
      <Stack.Screen name="complete" options={{ animation: 'fade' }} />
      <Stack.Screen name="rate" />
    </Stack>
  );
}
