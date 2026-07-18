/**
 * Screen 9/10 — Home (Search Destination).
 *
 * The booking hub: a live map of nearby vehicles, a pickup / "Where to?" card,
 * saved places, recent searches and explore categories. Selecting any
 * destination seeds the ride store and moves into ride selection.
 */

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LogoMark } from '@/components/brand/logo-mark';
import { RideMap } from '@/components/map/ride-map';
import { Text } from '@/components/ui/text';
import {
  EXPLORE_CATEGORIES,
  NEARBY_VEHICLES,
  RECENT_SEARCHES,
  SAVED_PLACES,
} from '@/services/mock-data';
import { useRideStore } from '@/store/ride-store';
import { useTheme } from '@/theme';
import type { NamedPlace } from '@/types/ride';

import { MapControlButton } from './components/map-control-button';
import { PlaceRow } from './components/place-row';
import { AddPlaceCard, SavedPlaceCard } from './components/saved-place-card';
import { WhereToCard } from './components/where-to-card';

export function HomeScreenView() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();

  const pickup = useRideStore((s) => s.pickup);
  const destination = useRideStore((s) => s.destination);
  const setDestination = useRideStore((s) => s.setDestination);
  const setStage = useRideStore((s) => s.setStage);

  // Recent searches are local so "Clear All" can empty them in-session.
  const [recents, setRecents] = useState<NamedPlace[]>(RECENT_SEARCHES);

  const chooseDestination = (place: NamedPlace) => {
    setDestination(place);
    setStage('idle');
    router.push('/choose-ride');
  };

  const mapHeight = Math.max(220, height * 0.32);

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={theme.scheme === 'dark' ? 'light' : 'dark'} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
        stickyHeaderIndices={[0]}>
        {/* Header (sticky) */}
        <View
          style={[
            styles.header,
            { paddingTop: insets.top + 8, backgroundColor: theme.colors.background },
          ]}>
          <View style={styles.brandRow}>
            <LogoMark size={26} color={theme.colors.text} apertureColor={theme.colors.background} />
            <Text variant="h3" style={styles.brand}>
              Sajha<Text variant="h3" tone="brand">Ride</Text>
            </Text>
          </View>
          <MapControlButton icon="notifications-outline" onPress={() => {}} />
        </View>

        {/* Where-to card */}
        <View style={styles.section}>
          <WhereToCard
            pickup={pickup}
            destination={destination}
            onPressPickup={() => router.push('/select-destination?field=pickup')}
            onPressDestination={() => {
              if (destination) router.push('/choose-ride');
              else router.push('/select-destination');
            }}
            onPressAddStop={() => router.push('/select-destination')}
          />
        </View>

        {/* Map */}
        <View style={[styles.mapWrap, { height: mapHeight, borderRadius: theme.radius.xl }]}>
          <RideMap pickup={pickup.coordinate} destination={destination?.coordinate} nearbyVehicles={NEARBY_VEHICLES}>
            <View style={styles.mapControls}>
              <MapControlButton icon="locate" onPress={() => {}} />
            </View>
            <View style={[styles.etaBadge, { backgroundColor: theme.colors.surface }, theme.elevation.md]}>
              <Text variant="caption" tone="secondary">
                2 min away
              </Text>
            </View>
          </RideMap>
        </View>

        {/* Saved Places */}
        <View style={styles.section}>
          <SectionHeader
            title="Saved Places"
            actionLabel="View All"
            onAction={() => router.push('/select-destination')}
          />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.savedRow}>
            {SAVED_PLACES.map((p) => (
              <SavedPlaceCard key={p.id} place={p} onPress={() => chooseDestination(p)} />
            ))}
            <AddPlaceCard onPress={() => router.push('/select-destination')} />
          </ScrollView>
        </View>

        {/* Recent Searches */}
        {recents.length > 0 ? (
          <View style={styles.section}>
            <SectionHeader
              title="Recent Searches"
              actionLabel="Clear All"
              destructive
              onAction={() => setRecents([])}
            />
            <View style={[styles.list, { borderColor: theme.colors.border }]}>
              {recents.map((p, i) => (
                <View key={p.id}>
                  {i > 0 ? <View style={[styles.divider, { backgroundColor: theme.colors.border }]} /> : null}
                  <PlaceRow place={p} onPress={() => chooseDestination(p)} />
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {/* Explore Nearby */}
        <View style={styles.section}>
          <Text variant="h3" style={styles.exploreTitle}>
            Explore Nearby
          </Text>
          <View style={styles.exploreRow}>
            {EXPLORE_CATEGORIES.map((c) => (
              <Pressable
                key={c.id}
                onPress={() => router.push('/select-destination')}
                accessibilityRole="button"
                accessibilityLabel={c.label}
                style={styles.exploreItem}>
                <View style={[styles.exploreCircle, { backgroundColor: `${c.color}22` }]}>
                  <Ionicons name={c.icon as keyof typeof Ionicons.glyphMap} size={22} color={c.color} />
                </View>
                <Text variant="caption" tone="secondary" numberOfLines={1}>
                  {c.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

/** Section title with an optional trailing action. */
function SectionHeader({
  title,
  actionLabel,
  destructive,
  onAction,
}: {
  title: string;
  actionLabel?: string;
  destructive?: boolean;
  onAction?: () => void;
}) {
  return (
    <View style={styles.sectionHeader}>
      <Text variant="h3">{title}</Text>
      {actionLabel ? (
        <Text variant="bodySm" tone={destructive ? 'danger' : 'brand'} onPress={onAction}>
          {actionLabel}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  brand: { letterSpacing: -0.3 },
  section: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  mapWrap: {
    marginHorizontal: 20,
    marginTop: 16,
    overflow: 'hidden',
  },
  mapControls: {
    position: 'absolute',
    right: 12,
    bottom: 12,
  },
  etaBadge: {
    position: 'absolute',
    top: 12,
    alignSelf: 'center',
    left: '50%',
    marginLeft: -34,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  savedRow: { gap: 12, paddingRight: 8 },
  list: {
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderRadius: 16,
    paddingHorizontal: 14,
  },
  divider: { height: StyleSheet.hairlineWidth * 2 },
  exploreTitle: { marginBottom: 16 },
  exploreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  exploreItem: { alignItems: 'center', gap: 6, width: 52 },
  exploreCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
