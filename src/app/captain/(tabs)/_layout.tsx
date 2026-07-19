/** Captain main shell — four tabs with a custom captain tab bar. */

import { Tabs } from 'expo-router';

import { CaptainTabBar } from '@/components/navigation/captain-tab-bar';

export default function CaptainTabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <CaptainTabBar {...props} />}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="earnings" />
      <Tabs.Screen name="history" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
