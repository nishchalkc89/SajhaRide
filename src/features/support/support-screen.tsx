/**
 * Screen — Help & Support.
 *
 * Popular help topics as a tappable list plus a "Chat with Support" CTA. Static
 * content; topics are placeholders for future help articles.
 */

import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Text } from '@/components/ui/text';
import { useTheme } from '@/theme';

type Topic = {
  id: string;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const TOPICS: Topic[] = [
  { id: 'lost', title: 'I lost an item', subtitle: 'Find help for lost items', icon: 'bag-remove-outline' },
  { id: 'fare', title: 'Fare issue', subtitle: 'I have a question about my fare', icon: 'cash-outline' },
  { id: 'payment', title: 'Payment issue', subtitle: 'I need help with payment', icon: 'card-outline' },
  { id: 'report', title: 'Report an issue', subtitle: 'Let us know what went wrong', icon: 'alert-circle-outline' },
  { id: 'safety', title: 'Safety concern', subtitle: 'Report a safety-related problem', icon: 'shield-outline' },
];

export function SupportScreenView() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.surface, paddingTop: insets.top }]}>
      <StatusBar style={theme.scheme === 'dark' ? 'light' : 'dark'} />
      <ScreenHeader title="Help & Support" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 24 }}>
        <Text variant="body" tone="secondary" style={styles.intro}>
          We are here to help you
        </Text>

        <Text variant="h3" style={styles.sectionTitle}>
          Popular Topics
        </Text>

        <View style={[styles.card, { backgroundColor: theme.colors.background }]}>
          {TOPICS.map((topic, i) => (
            <View key={topic.id}>
              {i > 0 ? <View style={[styles.divider, { backgroundColor: theme.colors.border }]} /> : null}
              <Pressable style={styles.topicRow} accessibilityRole="button" accessibilityLabel={topic.title}>
                <View style={[styles.topicIcon, { backgroundColor: theme.colors.surfaceMuted }]}>
                  <Ionicons name={topic.icon} size={20} color={theme.colors.text} />
                </View>
                <View style={styles.topicBody}>
                  <Text variant="bodyLg" style={styles.topicTitle}>
                    {topic.title}
                  </Text>
                  <Text variant="bodySm" tone="tertiary">
                    {topic.subtitle}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={theme.colors.textTertiary} />
              </Pressable>
            </View>
          ))}
        </View>

        {/* Contact card */}
        <View style={[styles.contactCard, { backgroundColor: theme.colors.primarySubtle }]}>
          <Ionicons name="chatbubbles" size={26} color={theme.colors.primary} />
          <View style={styles.contactBody}>
            <Text variant="bodyLg" style={styles.topicTitle}>
              Chat with Support
            </Text>
            <Text variant="bodySm" tone="secondary">
              We typically reply in a few minutes
            </Text>
          </View>
        </View>

        <Button
          label="Start a Chat"
          onPress={() => {}}
          leadingIcon={<Ionicons name="chatbubble-ellipses" size={18} color={theme.colors.onPrimary} />}
          style={styles.cta}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  intro: { marginTop: 4, marginBottom: 24 },
  sectionTitle: { marginBottom: 14 },
  card: { borderRadius: 16, paddingHorizontal: 16 },
  divider: { height: StyleSheet.hairlineWidth * 2 },
  topicRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, gap: 14 },
  topicIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  topicBody: { flex: 1, gap: 2 },
  topicTitle: { fontWeight: '600' },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    borderRadius: 16,
    marginTop: 24,
  },
  contactBody: { flex: 1, gap: 2 },
  cta: { marginTop: 16 },
});
