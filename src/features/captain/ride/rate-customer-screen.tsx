/** Page 35 — Rate Your Customer (stars + tags). */

import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Ionicons } from '@expo/vector-icons';

import { Button } from '@/components/ui/button';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Text } from '@/components/ui/text';
import { StarRating } from '@/features/ride/components/star-rating';
import { useHaptics } from '@/hooks/use-haptics';
import { useCaptainStore } from '@/store/captain-store';
import { toast } from '@/store/toast-store';
import { useTheme } from '@/theme';

const TAGS = ['Polite', 'On time', 'Friendly', 'Clean', 'Respectful'];

export function RateCustomerScreenView() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const haptic = useHaptics();

  const request = useCaptainStore((s) => s.request);
  const finishRide = useCaptainStore((s) => s.finishRide);

  const [stars, setStars] = useState(5);
  const [tags, setTags] = useState<string[]>(['Polite', 'On time']);

  const name = request?.riderName ?? 'Customer';
  const rating = request?.riderRating ?? 4.8;
  const rides = request?.riderRides ?? 124;

  const submit = () => {
    haptic('success');
    finishRide();
    toast('Thanks for the feedback!', 'success');
    router.replace('/captain');
  };

  const toggleTag = (t: string) =>
    setTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.surface, paddingTop: insets.top }]}>
      <StatusBar style={theme.scheme === 'dark' ? 'light' : 'dark'} />
      <ScreenHeader title="Rate Your Customer" onBack={submit} />

      <View style={[styles.content, { paddingBottom: insets.bottom + 20 }]}>
        <View style={styles.center}>
          <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
            <Text variant="h1" tone="onPrimary">
              {name.split(' ').map((w) => w[0]).slice(0, 2).join('')}
            </Text>
          </View>
          <Text variant="h3" style={styles.name}>
            {name}
          </Text>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={13} color={theme.colors.primary} />
            <Text variant="bodySm" tone="secondary">
              {rating.toFixed(1)} ({rides} rides)
            </Text>
          </View>
        </View>

        <StarRating value={stars} onChange={setStars} size={40} style={styles.stars} />

        <View style={styles.tagRow}>
          {TAGS.map((t) => {
            const active = tags.includes(t);
            return (
              <Pressable
                key={t}
                onPress={() => toggleTag(t)}
                style={[
                  styles.tag,
                  {
                    borderColor: active ? theme.colors.primary : theme.colors.border,
                    backgroundColor: active ? theme.colors.primarySubtle : theme.colors.surface,
                  },
                ]}>
                <Text variant="bodySm" tone={active ? 'brand' : 'secondary'}>
                  {t}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.spacer} />

        <Button label="Submit" onPress={submit} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  center: { alignItems: 'center' },
  avatar: { width: 84, height: 84, borderRadius: 42, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  name: { marginBottom: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  stars: { alignSelf: 'center', marginTop: 28 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginTop: 32 },
  tag: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 999, borderWidth: 1.5 },
  spacer: { flex: 1 },
});
