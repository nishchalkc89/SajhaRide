/**
 * In-ride chat — a lightweight messaging screen used by BOTH the rider and the
 * captain (the counterpart's name comes in via the `name` param). Includes
 * quick-reply chips and a canned auto-response so the demo feels live.
 */

import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/text';
import { useHaptics } from '@/hooks/use-haptics';
import { noWebOutline, useTheme } from '@/theme';

type Message = { id: string; text: string; mine: boolean };

const QUICK_REPLIES = ['On my way', "I'm here", 'Please wait 2 min', 'Call me'];

const AUTO_REPLIES = ['Okay 👍', 'Sure, coming!', 'Got it, thanks', 'See you at the pickup'];

export function ChatScreenView() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const haptic = useHaptics();
  const { name = 'Contact' } = useLocalSearchParams<{ name?: string }>();

  const scrollRef = useRef<ScrollView>(null);
  const [messages, setMessages] = useState<Message[]>([
    { id: 'm1', text: `Hi, this is ${name}. I'm on the way.`, mine: false },
  ]);
  const [draft, setDraft] = useState('');

  const send = (text: string) => {
    const t = text.trim();
    if (!t) return;
    haptic('light');
    setMessages((m) => [...m, { id: `me-${Date.now()}`, text: t, mine: true }]);
    setDraft('');
    // Canned reply after a beat.
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        { id: `re-${Date.now()}`, text: AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)], mine: false },
      ]);
    }, 900);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background, paddingTop: insets.top }]}>
      <StatusBar style={theme.scheme === 'dark' ? 'light' : 'dark'} />

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <Pressable onPress={() => router.back()} hitSlop={12} accessibilityLabel="Back" style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
        </Pressable>
        <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
          <Text variant="bodyLg" tone="onPrimary">
            {String(name).split(' ').map((w) => w[0]).slice(0, 2).join('')}
          </Text>
        </View>
        <View style={styles.headerText}>
          <Text variant="bodyLg" numberOfLines={1} style={styles.headerName}>
            {name}
          </Text>
          <Text variant="caption" tone="success">
            Online
          </Text>
        </View>
        <Pressable
          onPress={() => router.push(`/call?name=${encodeURIComponent(String(name))}`)}
          accessibilityLabel="Call"
          style={[styles.callBtn, { backgroundColor: theme.colors.successSubtle }]}>
          <Ionicons name="call" size={18} color={theme.colors.success} />
        </Pressable>
      </View>

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          ref={scrollRef}
          style={styles.flex}
          contentContainerStyle={styles.messages}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}>
          {messages.map((m) => (
            <View
              key={m.id}
              style={[
                styles.bubble,
                m.mine
                  ? { alignSelf: 'flex-end', backgroundColor: theme.colors.primary }
                  : { alignSelf: 'flex-start', backgroundColor: theme.colors.surface },
              ]}>
              <Text variant="body" tone={m.mine ? 'onPrimary' : 'primary'}>
                {m.text}
              </Text>
            </View>
          ))}
        </ScrollView>

        {/* Quick replies */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickRow}>
          {QUICK_REPLIES.map((q) => (
            <Pressable
              key={q}
              onPress={() => send(q)}
              style={[styles.quickChip, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <Text variant="bodySm" tone="secondary">
                {q}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Composer */}
        <View style={[styles.composer, { paddingBottom: insets.bottom + 10, borderTopColor: theme.colors.border }]}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Message…"
            placeholderTextColor={theme.colors.textTertiary}
            style={[styles.input, theme.typography.body, noWebOutline, { color: theme.colors.text, backgroundColor: theme.colors.surfaceMuted }]}
            onSubmitEditing={() => send(draft)}
            returnKeyType="send"
          />
          <Pressable
            onPress={() => send(draft)}
            accessibilityLabel="Send"
            style={[styles.sendBtn, { backgroundColor: theme.colors.primary }]}>
            <Ionicons name="send" size={18} color={theme.colors.onPrimary} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
  },
  backBtn: { padding: 2 },
  avatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  headerText: { flex: 1 },
  headerName: { fontWeight: '600' },
  callBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  messages: { padding: 16, gap: 8 },
  bubble: { maxWidth: '78%', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 16 },
  quickRow: { paddingHorizontal: 12, gap: 8, paddingVertical: 8 },
  quickChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, borderWidth: StyleSheet.hairlineWidth * 2 },
  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth * 2,
  },
  input: { flex: 1, height: 44, borderRadius: 22, paddingHorizontal: 16 },
  sendBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
});
