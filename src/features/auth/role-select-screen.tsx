/**
 * Role selection — the fork after onboarding.
 *
 * Two cards: continue as a Passenger (→ login) or join as a Captain (→ captain
 * registration). This is the single entry point into the two sides of the app,
 * replacing the old "switch mode from profile" affordance.
 */

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LogoMark } from '@/components/brand/logo-mark';
import { Text } from '@/components/ui/text';
import { useHaptics } from '@/hooks/use-haptics';
import { useTheme } from '@/theme';

export function RoleSelectScreenView() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const haptic = useHaptics();

  const go = (path: '/login' | '/captain/register') => {
    haptic('medium');
    router.push(path);
  };

  return (
    <View
      style={[
        styles.root,
        { backgroundColor: theme.colors.surface, paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 },
      ]}>
      <StatusBar style={theme.scheme === 'dark' ? 'light' : 'dark'} />

      {/* Brand */}
      <View style={styles.brand}>
        <LogoMark size={54} color={theme.colors.text} apertureColor={theme.colors.surface} />
        <Text variant="h1" align="center" style={styles.title}>
          Welcome to SajhaRide
        </Text>
        <Text variant="body" tone="secondary" align="center" style={styles.subtitle}>
          How would you like to continue?
        </Text>
      </View>

      {/* Cards */}
      <View style={styles.cards}>
        <RoleCard
          title="Join as a Passenger"
          subtitle="Book bikes & autos across Nepal, ride comfortably and pay easily."
          cta="Continue as Passenger"
          image={require('../../../assets/images/onboarding/comfortable-rides.png')}
          onPress={() => go('/login')}
        />
        <RoleCard
          title="Join as a Captain"
          subtitle="Drive, accept ride requests and earn on your own schedule."
          cta="Register as Captain"
          image={require('../../../assets/images/vehicles/bike.png')}
          highlighted
          onPress={() => go('/captain/register')}
        />
      </View>

      <Text variant="caption" tone="tertiary" align="center">
        You can switch anytime from your profile.
      </Text>
    </View>
  );
}

function RoleCard({
  title,
  subtitle,
  cta,
  image,
  highlighted,
  onPress,
}: {
  title: string;
  subtitle: string;
  cta: string;
  image: number;
  highlighted?: boolean;
  onPress: () => void;
}) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
      style={[
        styles.card,
        {
          borderRadius: theme.radius['2xl'],
          borderColor: highlighted ? theme.colors.primary : theme.colors.border,
          borderWidth: highlighted ? 2 : StyleSheet.hairlineWidth * 2,
          backgroundColor: highlighted ? theme.colors.primarySubtle : theme.colors.surface,
        },
        theme.elevation.sm,
      ]}>
      <Image source={image} style={styles.cardImage} resizeMode="contain" />
      <View style={styles.cardBody}>
        <Text variant="h3">{title}</Text>
        <Text variant="bodySm" tone="secondary" style={styles.cardSub}>
          {subtitle}
        </Text>
        <View style={styles.ctaRow}>
          <Text variant="label" tone="brand">
            {cta}
          </Text>
          <Ionicons name="arrow-forward" size={18} color={theme.colors.primary} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, paddingHorizontal: 20, justifyContent: 'space-between' },
  brand: { alignItems: 'center', marginTop: 12 },
  title: { marginTop: 16 },
  subtitle: { marginTop: 6 },
  cards: { gap: 16 },
  card: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 14 },
  cardImage: { width: 84, height: 84 },
  cardBody: { flex: 1 },
  cardSub: { marginTop: 4 },
  ctaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12 },
});
