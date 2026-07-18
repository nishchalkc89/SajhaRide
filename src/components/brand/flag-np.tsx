/**
 * Nepal's flag as a small inline SVG — the only non-rectangular national flag,
 * so it can't be an emoji fallback reliably. Used in the phone dial-code prefix.
 */

import Svg, { Path, type SvgProps } from 'react-native-svg';

export function FlagNP({ width = 18, ...rest }: Omit<SvgProps, 'viewBox'> & { width?: number }) {
  // Aspect follows the constitutional 0.75:1-ish double-pennon shape.
  const height = width * 1.22;
  return (
    <Svg width={width} height={height} viewBox="0 0 100 122" {...rest}>
      {/* Crimson field with the blue border, drawn as one filled double pennant. */}
      <Path d="M4 4 L70 60 L40 60 L74 100 L4 100 Z" fill="#1A3A8F" />
      <Path d="M9 12 L60 60 L36 60 L64 94 L9 94 Z" fill="#DC143C" />
    </Svg>
  );
}
