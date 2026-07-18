/** Main app shell — four primary tabs with a custom floating tab bar. */

import { Tabs } from 'expo-router';

import { BottomTabBar } from '@/components/navigation/bottom-tab-bar';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <BottomTabBar {...props} />}>
      <Tabs.Screen name="home" />
      <Tabs.Screen name="bookings" />
      <Tabs.Screen name="wallet" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
