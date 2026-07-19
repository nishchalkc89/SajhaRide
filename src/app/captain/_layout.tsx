/** Captain (driver) app section — its own stack, no rider tab bar. */

import { Stack } from 'expo-router';

export default function CaptainLayout() {
  return <Stack screenOptions={{ headerShown: false, animation: 'fade' }} />;
}
