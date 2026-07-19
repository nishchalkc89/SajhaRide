/** Fallback when a ride-flow screen is opened without an active request. */

import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useTheme } from '@/theme';

export function CaptainRideGuard() {
  const theme = useTheme();
  const router = useRouter();
  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <Text variant="h3" align="center">
        No active ride
      </Text>
      <Text variant="body" tone="secondary" align="center" style={styles.sub}>
        This ride has ended or was cancelled.
      </Text>
      <Button label="Back to Home" fullWidth={false} onPress={() => router.replace('/captain')} style={styles.btn} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  sub: { marginTop: 6 },
  btn: { marginTop: 20 },
});
