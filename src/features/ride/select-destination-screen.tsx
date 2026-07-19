/**
 * Screen 10 — Select Destination / Pickup.
 *
 * A keyword search over the Nepal-wide place catalogue, plus saved places and
 * recent searches as shortcuts. The `field` param decides whether a pick sets
 * the pickup or the destination:
 *   - destination (default) → seeds destination, advances to ride selection.
 *   - pickup → updates pickup, returns to the previous screen.
 */

import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/ui/screen-header';
import { Text } from '@/components/ui/text';
import { RECENT_SEARCHES, SAVED_PLACES } from '@/services/mock-data';
import { searchPlaces, searchPlacesRemote } from '@/services/nepal-places';
import { useRideStore } from '@/store/ride-store';
import { noWebOutline, useTheme } from '@/theme';
import type { NamedPlace } from '@/types/ride';

import { PlaceRow } from '../home/components/place-row';
import { SavedPlaceCard } from '../home/components/saved-place-card';

/** Debounce before hitting the geocoder (Nominatim asks for ≤1 req/sec). */
const SEARCH_DEBOUNCE_MS = 450;

export function SelectDestinationScreenView() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { field } = useLocalSearchParams<{ field?: string }>();

  const isPickup = field === 'pickup';

  const setDestination = useRideStore((s) => s.setDestination);
  const setPickup = useRideStore((s) => s.setPickup);
  const [query, setQuery] = useState('');
  const [remote, setRemote] = useState<NamedPlace[]>([]);
  const [loading, setLoading] = useState(false);

  // Instant local matches (built-in hubs) shown while the network resolves.
  const local = useMemo(() => searchPlaces(query), [query]);

  // Debounced live geocode across all of Nepal.
  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setRemote([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const controller = new AbortController();
    const t = setTimeout(async () => {
      const found = await searchPlacesRemote(q, controller.signal);
      setRemote(found);
      setLoading(false);
    }, SEARCH_DEBOUNCE_MS);
    return () => {
      clearTimeout(t);
      controller.abort();
    };
  }, [query]);

  // Merge local + remote, de-duplicating by rounded coordinate/title.
  const results = useMemo(() => {
    const seen = new Set<string>();
    const out: NamedPlace[] = [];
    for (const p of [...local, ...remote]) {
      const key = `${p.title.toLowerCase()}|${p.coordinate.latitude.toFixed(3)}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(p);
    }
    return out;
  }, [local, remote]);

  const choose = (place: NamedPlace) => {
    if (isPickup) {
      setPickup(place);
      router.back();
    } else {
      setDestination(place);
      router.push('/choose-ride');
    }
  };

  const searching = query.trim().length > 0;

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.surface, paddingTop: insets.top }]}>
      <StatusBar style={theme.scheme === 'dark' ? 'light' : 'dark'} />
      <ScreenHeader title={isPickup ? 'Set Pickup Location' : 'Select Destination'} />

      {/* Search field */}
      <View style={[styles.searchWrap, { paddingHorizontal: theme.screenPadding }]}>
        <View
          style={[
            styles.search,
            { backgroundColor: theme.colors.surfaceMuted, borderRadius: theme.radius.md },
          ]}>
          <Ionicons name="search" size={20} color={theme.colors.textTertiary} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={isPickup ? 'Search pickup location' : 'Search destination'}
            placeholderTextColor={theme.colors.textTertiary}
            autoFocus
            style={[styles.searchInput, theme.typography.bodyLg, noWebOutline, { color: theme.colors.text }]}
          />
          {searching ? (
            <Pressable onPress={() => setQuery('')} hitSlop={8} accessibilityLabel="Clear search">
              <Ionicons name="close-circle" size={18} color={theme.colors.textTertiary} />
            </Pressable>
          ) : null}
        </View>
      </View>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: theme.screenPadding, paddingBottom: insets.bottom + 24 }}>
        {searching ? (
          <View style={styles.section}>
            {results.map((p, i) => (
              <View key={p.id}>
                {i > 0 ? <View style={[styles.divider, { backgroundColor: theme.colors.border }]} /> : null}
                <PlaceRow place={p} icon="location-outline" onPress={() => choose(p)} />
              </View>
            ))}

            {loading ? (
              <View style={styles.searchStatus}>
                <ActivityIndicator size="small" color={theme.colors.primary} />
                <Text variant="bodySm" tone="tertiary">
                  Searching across Nepal…
                </Text>
              </View>
            ) : results.length === 0 ? (
              <View style={styles.empty}>
                <Ionicons name="search" size={40} color={theme.colors.textTertiary} />
                <Text variant="body" tone="secondary" align="center" style={styles.emptyText}>
                  No places match “{query}”.
                </Text>
              </View>
            ) : null}
          </View>
        ) : (
          <>
            {/* Saved Places */}
            <View style={styles.section}>
              <Text variant="h3" style={styles.sectionTitle}>
                Saved Places
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.savedRow}>
                {SAVED_PLACES.map((p) => (
                  <SavedPlaceCard key={p.id} place={p} onPress={() => choose(p)} />
                ))}
              </ScrollView>
            </View>

            {/* Recent */}
            <View style={styles.section}>
              <Text variant="h3" style={styles.sectionTitle}>
                Recent Searches
              </Text>
              {RECENT_SEARCHES.map((p, i) => (
                <View key={p.id}>
                  {i > 0 ? <View style={[styles.divider, { backgroundColor: theme.colors.border }]} /> : null}
                  <PlaceRow place={p} onPress={() => choose(p)} />
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  searchWrap: { paddingVertical: 12 },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    paddingHorizontal: 14,
    gap: 10,
  },
  searchInput: { flex: 1 },
  section: { marginTop: 16 },
  sectionTitle: { marginBottom: 12 },
  savedRow: { gap: 12, paddingRight: 8 },
  divider: { height: StyleSheet.hairlineWidth * 2 },
  searchStatus: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 16 },
  empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText: { maxWidth: 240 },
});
