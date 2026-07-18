/** A saved-place tile (Home / Work / custom) shown in the Home horizontal row. */

import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/text';
import { useTheme } from '@/theme';
import type { SavedPlace, SavedPlaceKind } from '@/types/ride';

const ICON: Record<SavedPlaceKind, keyof typeof Ionicons.glyphMap> = {
  home: 'home',
  work: 'briefcase',
  custom: 'school',
};

export function SavedPlaceCard({ place, onPress }: { place: SavedPlace; onPress?: () => void }) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={place.title}
      style={[
        styles.card,
        { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderRadius: theme.radius.lg },
      ]}>
      <Ionicons name={ICON[place.kind]} size={22} color={theme.colors.primary} />
      <Text variant="bodySm" numberOfLines={1} style={styles.title}>
        {place.title}
      </Text>
      {place.subtitle ? (
        <Text variant="caption" tone="tertiary" numberOfLines={1}>
          {place.subtitle}
        </Text>
      ) : null}
    </Pressable>
  );
}

/** The "+ Add New" companion tile. */
export function AddPlaceCard({ onPress }: { onPress?: () => void }) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Add new saved place"
      style={[
        styles.card,
        { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderRadius: theme.radius.lg },
      ]}>
      <View style={[styles.addCircle, { backgroundColor: theme.colors.surfaceMuted }]}>
        <Ionicons name="add" size={20} color={theme.colors.textSecondary} />
      </View>
      <Text variant="bodySm" numberOfLines={1} style={styles.title}>
        Add New
      </Text>
      <Text variant="caption" tone="tertiary" numberOfLines={1}>
        Save location
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 110,
    padding: 12,
    borderWidth: StyleSheet.hairlineWidth * 2,
    gap: 4,
  },
  title: {
    marginTop: 6,
    fontWeight: '600',
  },
  addCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
