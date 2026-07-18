/**
 * SajhaRide logomark — an original construction, not a trace of the reference.
 *
 * Concept: a single "S" ribbon whose lower terminal sharpens into a map-pin
 * tip, with the pin's aperture knocked out of the bowl. Drawn as vector paths
 * so it stays crisp at every density and can be recoloured per surface.
 */

import Svg, { Circle, Path, type SvgProps } from 'react-native-svg';

export type LogoMarkProps = Omit<SvgProps, 'viewBox'> & {
  size?: number;
  /** Ribbon colour. Defaults to near-black, as on the amber splash. */
  color?: string;
  /** Colour showing through the pin aperture — should match the backdrop. */
  apertureColor?: string;
};

export function LogoMark({
  size = 96,
  color = '#111113',
  apertureColor = '#FFC107',
  ...rest
}: LogoMarkProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" fill="none" {...rest}>
      {/* Upper bowl of the S: sweeps left and hooks under. */}
      <Path
        d="M72 29c0-11-11-18-24-16C36 15 27 23 27 34c0 9 6 15 16 19l12 5"
        stroke={color}
        strokeWidth={13}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Lower bowl: mirrors the upper sweep and drives toward the pin tip. */}
      <Path
        d="M55 58c10 4 16 10 16 19 0 6-3 11-8 14"
        stroke={color}
        strokeWidth={13}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Pin tip — the S's terminal resolves into a downward point. */}
      <Path d="M63 91 47 74c10-4 20-3 25 2z" fill={color} />
      {/* Aperture: the pin's hole, knocked through the lower bowl. */}
      <Circle cx="63" cy="72" r="5.5" fill={apertureColor} />
    </Svg>
  );
}
