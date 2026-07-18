/**
 * Screen — Rate Your Driver.
 *
 * Driver header, star rating (pre-filled from the completion screen), a free
 * text note, and submit. Submitting returns home and resets the ride.
 */

import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Text } from '@/components/ui/text';
import { useHaptics } from '@/hooks/use-haptics';
import { useRideStore } from '@/store/ride-store';
import { noWebOutline, useTheme } from '@/theme';

import { StarRating } from './components/star-rating';

const RATING_WORDS = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent!'];

export function RateDriverScreenView() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const haptic = useHaptics();

  const driver = useRideStore((s) => s.driver);
  const initialRating = useRideStore((s) => s.rating);
  const setRating = useRideStore((s) => s.setRating);

  const [stars, setStars] = useState(initialRating || 5);
  const [note, setNote] = useState('');

  const submit = () => {
    setRating(stars);
    haptic('success');
    useRideStore.getState().reset();
    router.dismissAll();
    router.replace('/home');
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.surface, paddingTop: insets.top }]}>
      <StatusBar style={theme.scheme === 'dark' ? 'light' : 'dark'} />
      <ScreenHeader title="Rate Your Driver" />

      <View style={[styles.content, { paddingHorizontal: 20, paddingBottom: insets.bottom + 20 }]}>
        <View style={styles.driverBlock}>
          <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
            <Text variant="h1" tone="onPrimary">
              {driver?.photoInitials ?? 'RS'}
            </Text>
          </View>
          <Text variant="h3" align="center" style={styles.name}>
            {driver?.name ?? 'Your Driver'}
          </Text>
          <Text variant="bodySm" tone="tertiary" align="center">
            {driver?.vehicleName ?? 'Vehicle'} · {driver?.plate ?? ''}
          </Text>
        </View>

        <StarRating value={stars} onChange={setStars} size={44} style={styles.stars} />
        <Text variant="bodyLg" tone="brand" align="center" style={styles.ratingWord}>
          {RATING_WORDS[stars]}
        </Text>

        <TextInput
          value={note}
          onChangeText={setNote}
          placeholder="Tell us more about your experience (optional)"
          placeholderTextColor={theme.colors.textTertiary}
          multiline
          style={[
            styles.note,
            theme.typography.body,
            noWebOutline,
            {
              color: theme.colors.text,
              backgroundColor: theme.colors.surfaceMuted,
              borderRadius: theme.radius.md,
            },
          ]}
        />

        <View style={styles.spacer} />

        <Button label="Submit" onPress={submit} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { flex: 1, paddingTop: 12 },
  driverBlock: { alignItems: 'center', marginTop: 12 },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  name: { marginBottom: 2 },
  stars: { alignSelf: 'center', marginTop: 28 },
  ratingWord: { marginTop: 14, fontWeight: '600' },
  note: {
    marginTop: 28,
    minHeight: 110,
    padding: 16,
    textAlignVertical: 'top',
  },
  spacer: { flex: 1 },
});
