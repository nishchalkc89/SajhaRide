/**
 * PaymentQR — renders a scannable QR encoding a SajhaRide payment intent.
 *
 * The payload mimics a UPI/FonePay-style deep link so any bank/wallet scanner
 * would recognise an amount + payee. Built on react-native-qrcode-svg (SVG →
 * works on web and native).
 */

import { StyleSheet, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

export type PaymentQRProps = {
  amount: number;
  /** Human label embedded alongside the amount. */
  label: string;
  /** Payee identifier (captain id / merchant code). */
  payee?: string;
  size?: number;
  color?: string;
};

export function PaymentQR({ amount, label, payee = 'sajharide-captain', size = 180, color = '#111113' }: PaymentQRProps) {
  // A deep-link-ish payload a bank app could parse: scheme + query params.
  const payload = `sajharide://pay?pa=${encodeURIComponent(payee)}&am=${amount}&cu=NPR&tn=${encodeURIComponent(label)}`;

  return (
    <View style={[styles.frame, { width: size + 24 }]}>
      <QRCode value={payload} size={size} color={color} backgroundColor="#FFFFFF" ecl="M" />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 16,
    alignItems: 'center',
  },
});
