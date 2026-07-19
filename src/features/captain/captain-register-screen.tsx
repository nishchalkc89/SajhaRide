/**
 * Captain registration — a 3-step signup collecting the identity, vehicle and
 * documents a rider-hailing captain needs (modelled on Rapido onboarding).
 *
 * Step 1 Personal · Step 2 Vehicle · Step 3 Documents. Photo uploads are
 * simulated (tap to "attach") so the flow is testable without native camera;
 * wiring expo-image-picker later is a drop-in on the UploadTile onPress.
 */

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Text } from '@/components/ui/text';
import { TextField } from '@/components/ui/text-field';
import { DialPrefix } from '@/features/auth/components/dial-prefix';
import { useHaptics } from '@/hooks/use-haptics';
import { useCaptainStore, type CaptainProfile } from '@/store/captain-store';
import { toast } from '@/store/toast-store';
import { useTheme } from '@/theme';
import type { VehicleId } from '@/types/ride';

const STEPS = ['Personal', 'Vehicle', 'Documents'] as const;

export function CaptainRegisterScreenView() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const haptic = useHaptics();
  const registerCaptain = useCaptainStore((s) => s.registerCaptain);

  const [step, setStep] = useState(0);

  // Form state
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [citizenshipNo, setCitizenshipNo] = useState('');
  const [vehicleType, setVehicleType] = useState<VehicleId>('bike');
  const [vehicleModel, setVehicleModel] = useState('');
  const [plate, setPlate] = useState('');
  const [bikePhoto, setBikePhoto] = useState(false);
  const [licenseNo, setLicenseNo] = useState('');
  const [licensePhoto, setLicensePhoto] = useState(false);
  const [citizenshipPhoto, setCitizenshipPhoto] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const validateStep = (): boolean => {
    if (step === 0) {
      if (!fullName.trim() || !/^9[78]\d{8}$/.test(phone) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || citizenshipNo.trim().length < 5) {
        setError('Please fill in all personal details correctly.');
        return false;
      }
    }
    if (step === 1) {
      if (!vehicleModel.trim() || plate.trim().length < 4 || !bikePhoto) {
        setError('Add your vehicle model, plate number and a photo.');
        return false;
      }
    }
    if (step === 2) {
      if (licenseNo.trim().length < 4 || !licensePhoto || !citizenshipPhoto) {
        setError('Provide your license number and upload both documents.');
        return false;
      }
    }
    setError(null);
    return true;
  };

  const next = () => {
    if (!validateStep()) {
      haptic('error');
      return;
    }
    haptic('light');
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
      return;
    }
    // Final submit
    const profile: CaptainProfile = {
      fullName: fullName.trim(),
      phone,
      email: email.trim(),
      citizenshipNo: citizenshipNo.trim(),
      licenseNo: licenseNo.trim(),
      vehicleType,
      vehicleModel: vehicleModel.trim(),
      plate: plate.trim().toUpperCase(),
      rating: 5.0,
      documents: { bikePhoto, license: licensePhoto, citizenship: citizenshipPhoto },
    };
    registerCaptain(profile);
    haptic('success');
    toast('Welcome aboard, Captain!', 'success');
    router.replace('/captain');
  };

  const back = () => {
    if (step === 0) {
      router.back();
      return;
    }
    setError(null);
    setStep((s) => s - 1);
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.surface, paddingTop: insets.top }]}>
      <StatusBar style={theme.scheme === 'dark' ? 'light' : 'dark'} />
      <ScreenHeader title="Captain Registration" onBack={back} />

      {/* Stepper */}
      <View style={styles.stepper}>
        {STEPS.map((label, i) => (
          <View key={label} style={styles.stepItem}>
            <View
              style={[
                styles.stepDot,
                {
                  backgroundColor: i <= step ? theme.colors.primary : theme.colors.surfaceMuted,
                  borderColor: i <= step ? theme.colors.primary : theme.colors.border,
                },
              ]}>
              {i < step ? (
                <Ionicons name="checkmark" size={14} color={theme.colors.onPrimary} />
              ) : (
                <Text variant="caption" tone={i === step ? 'onPrimary' : 'tertiary'}>
                  {i + 1}
                </Text>
              )}
            </View>
            <Text variant="caption" tone={i <= step ? 'primary' : 'tertiary'}>
              {label}
            </Text>
            {i < STEPS.length - 1 ? (
              <View style={[styles.stepLine, { backgroundColor: i < step ? theme.colors.primary : theme.colors.border }]} />
            ) : null}
          </View>
        ))}
      </View>

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {step === 0 ? (
            <>
              <TextField value={fullName} onChangeText={setFullName} placeholder="Full Name" autoCapitalize="words" containerStyle={styles.field} />
              <TextField value={phone} onChangeText={setPhone} placeholder="Mobile Number" keyboardType="number-pad" maxLength={10} prefix={<DialPrefix />} containerStyle={styles.field} />
              <TextField value={email} onChangeText={setEmail} placeholder="Email Address" keyboardType="email-address" autoCapitalize="none" containerStyle={styles.field} />
              <TextField value={citizenshipNo} onChangeText={setCitizenshipNo} placeholder="Citizenship Number" containerStyle={styles.field} />
            </>
          ) : null}

          {step === 1 ? (
            <>
              <Text variant="bodySm" tone="secondary" style={styles.label}>
                Vehicle Type
              </Text>
              <View style={styles.segment}>
                {(['bike', 'auto'] as VehicleId[]).map((t) => {
                  const active = vehicleType === t;
                  return (
                    <Pressable
                      key={t}
                      onPress={() => setVehicleType(t)}
                      style={[
                        styles.segmentItem,
                        {
                          backgroundColor: active ? theme.colors.primary : theme.colors.surface,
                          borderColor: active ? theme.colors.primary : theme.colors.border,
                        },
                      ]}>
                      <Ionicons name={t === 'bike' ? 'bicycle' : 'car-sport'} size={18} color={active ? theme.colors.onPrimary : theme.colors.textSecondary} />
                      <Text variant="label" tone={active ? 'onPrimary' : 'secondary'}>
                        {t === 'bike' ? 'Bike' : 'Auto'}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
              <TextField value={vehicleModel} onChangeText={setVehicleModel} placeholder="Vehicle Model (e.g. Honda Dio)" containerStyle={styles.field} />
              <TextField value={plate} onChangeText={setPlate} placeholder="Plate Number (e.g. BA 12 PA 1234)" autoCapitalize="characters" containerStyle={styles.field} />
              <UploadTile label="Vehicle Photo" done={bikePhoto} onPress={() => setBikePhoto(true)} icon="camera" />
            </>
          ) : null}

          {step === 2 ? (
            <>
              <TextField value={licenseNo} onChangeText={setLicenseNo} placeholder="Driving License Number" autoCapitalize="characters" containerStyle={styles.field} />
              <UploadTile label="Driving License Photo" done={licensePhoto} onPress={() => setLicensePhoto(true)} icon="card" />
              <UploadTile label="Citizenship Photo" done={citizenshipPhoto} onPress={() => setCitizenshipPhoto(true)} icon="document-text" />
              <View style={[styles.notice, { backgroundColor: theme.colors.infoSubtle }]}>
                <Ionicons name="shield-checkmark" size={18} color={theme.colors.info} />
                <Text variant="bodySm" tone="secondary" style={styles.noticeText}>
                  Your documents are verified before you can go online.
                </Text>
              </View>
            </>
          ) : null}

          {error ? (
            <Text variant="bodySm" tone="danger" style={styles.error}>
              {error}
            </Text>
          ) : null}
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: insets.bottom + 16, paddingHorizontal: 20 }]}>
          <Button label={step === STEPS.length - 1 ? 'Submit & Continue' : 'Next'} onPress={next} />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

function UploadTile({
  label,
  done,
  icon,
  onPress,
}: {
  label: string;
  done: boolean;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Upload ${label}`}
      style={[
        styles.upload,
        {
          borderColor: done ? theme.colors.success : theme.colors.border,
          backgroundColor: done ? theme.colors.successSubtle : theme.colors.surface,
        },
      ]}>
      <View style={[styles.uploadIcon, { backgroundColor: done ? theme.colors.success : theme.colors.surfaceMuted }]}>
        <Ionicons name={done ? 'checkmark' : icon} size={20} color={done ? '#fff' : theme.colors.textSecondary} />
      </View>
      <View style={styles.uploadBody}>
        <Text variant="bodyLg" style={styles.uploadLabel}>
          {label}
        </Text>
        <Text variant="caption" tone={done ? 'success' : 'tertiary'}>
          {done ? 'Attached' : 'Tap to upload'}
        </Text>
      </View>
      <Ionicons name="cloud-upload-outline" size={20} color={theme.colors.textTertiary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
  stepper: { flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 16 },
  stepItem: { flex: 1, alignItems: 'center', gap: 6, position: 'relative' },
  stepDot: { width: 26, height: 26, borderRadius: 13, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  stepLine: { position: 'absolute', top: 13, left: '60%', right: '-40%', height: 2 },
  content: { paddingHorizontal: 20, paddingTop: 8 },
  field: { marginBottom: 14 },
  label: { marginBottom: 8, marginLeft: 4 },
  segment: { flexDirection: 'row', gap: 12, marginBottom: 14 },
  segmentItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 52,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  upload: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    marginBottom: 14,
  },
  uploadIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  uploadBody: { flex: 1, gap: 2 },
  uploadLabel: { fontWeight: '600' },
  notice: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: 12, marginTop: 4 },
  noticeText: { flex: 1 },
  error: { marginTop: 6 },
  footer: { paddingTop: 12 },
});
