/**
 * In-ride call — a simulated voice-call screen shared by rider and captain.
 * Shows a connecting→ongoing timer with mute/speaker/end controls. No real
 * telephony; ending returns to the previous screen.
 */

import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/text';
import { useHaptics } from '@/hooks/use-haptics';
import { useTheme } from '@/theme';

function mmss(total: number) {
  const m = Math.floor(total / 60).toString().padStart(2, '0');
  const s = (total % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export function CallScreenView() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const haptic = useHaptics();
  const { name = 'Contact' } = useLocalSearchParams<{ name?: string }>();

  const [connected, setConnected] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [muted, setMuted] = useState(false);
  const [speaker, setSpeaker] = useState(false);

  // Connect after a beat, then run the call timer.
  useEffect(() => {
    const c = setTimeout(() => setConnected(true), 1500);
    return () => clearTimeout(c);
  }, []);
  useEffect(() => {
    if (!connected) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [connected]);

  const initials = String(name).split(' ').map((w) => w[0]).slice(0, 2).join('');

  const end = () => {
    haptic('medium');
    router.back();
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.text, paddingTop: insets.top + 40, paddingBottom: insets.bottom + 40 }]}>
      <StatusBar style="light" />

      <View style={styles.top}>
        <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
          <Text variant="display" tone="onPrimary">
            {initials}
          </Text>
        </View>
        <Text variant="h1" style={[styles.name, { color: theme.colors.background }]}>
          {name}
        </Text>
        <Text variant="body" style={{ color: theme.colors.background, opacity: 0.7 }}>
          {connected ? mmss(seconds) : 'Calling…'}
        </Text>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <View style={styles.controlRow}>
          <CircleButton
            icon={muted ? 'mic-off' : 'mic'}
            label="Mute"
            active={muted}
            onPress={() => {
              haptic('light');
              setMuted((v) => !v);
            }}
            theme={theme}
          />
          <CircleButton
            icon={speaker ? 'volume-high' : 'volume-medium'}
            label="Speaker"
            active={speaker}
            onPress={() => {
              haptic('light');
              setSpeaker((v) => !v);
            }}
            theme={theme}
          />
          <CircleButton icon="keypad" label="Keypad" onPress={() => haptic('light')} theme={theme} />
        </View>

        <Pressable onPress={end} accessibilityLabel="End call" style={[styles.endBtn, { backgroundColor: theme.colors.danger }]}>
          <Ionicons name="call" size={28} color="#fff" style={styles.endIcon} />
        </Pressable>
      </View>
    </View>
  );
}

function CircleButton({
  icon,
  label,
  active,
  onPress,
  theme,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  active?: boolean;
  onPress: () => void;
  theme: ReturnType<typeof useTheme>;
}) {
  return (
    <Pressable onPress={onPress} accessibilityLabel={label} style={styles.control}>
      <View
        style={[
          styles.controlCircle,
          { backgroundColor: active ? theme.colors.background : 'rgba(255,255,255,0.14)' },
        ]}>
        <Ionicons name={icon} size={24} color={active ? theme.colors.text : theme.colors.background} />
      </View>
      <Text variant="caption" style={{ color: theme.colors.background, opacity: 0.7 }}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'space-between', alignItems: 'center' },
  top: { alignItems: 'center', marginTop: 40 },
  avatar: { width: 120, height: 120, borderRadius: 60, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  name: { marginBottom: 8 },
  controls: { alignItems: 'center', gap: 36, width: '100%' },
  controlRow: { flexDirection: 'row', justifyContent: 'center', gap: 28 },
  control: { alignItems: 'center', gap: 8 },
  controlCircle: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center' },
  endBtn: { width: 68, height: 68, borderRadius: 34, alignItems: 'center', justifyContent: 'center' },
  endIcon: { transform: [{ rotate: '135deg' }] },
});
