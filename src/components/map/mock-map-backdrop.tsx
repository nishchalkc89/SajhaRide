/**
 * A lightweight decorative "map" backdrop — abstract roads, blocks and a river.
 *
 * Used behind modal-style screens (location permission) where a real map is
 * overkill and would need an API key. NOT the production map; the home screen
 * uses react-native-maps.
 */

import Svg, { Circle, Path, Rect, type SvgProps } from 'react-native-svg';

import { useTheme } from '@/theme';

export type MockMapBackdropProps = SvgProps & {
  width: number;
  height: number;
  /** Show the user's blue location dot in the centre. */
  showUserDot?: boolean;
};

export function MockMapBackdrop({ width, height, showUserDot, ...rest }: MockMapBackdropProps) {
  const theme = useTheme();
  const land = theme.scheme === 'dark' ? '#20242B' : '#E9ECF0';
  const road = theme.scheme === 'dark' ? '#2C313A' : '#FFFFFF';
  const block = theme.scheme === 'dark' ? '#252A32' : '#DDE2E8';
  const green = theme.scheme === 'dark' ? '#24312A' : '#D6EAD9';
  const water = theme.scheme === 'dark' ? '#1E2A38' : '#C9E2F0';

  return (
    <Svg width={width} height={height} viewBox="0 0 390 700" fill="none" {...rest}>
      <Rect x={0} y={0} width={390} height={700} fill={land} />

      {/* Park blocks */}
      <Rect x={40} y={90} width={120} height={90} rx={10} fill={green} />
      <Rect x={250} y={430} width={110} height={120} rx={10} fill={green} />

      {/* City blocks */}
      <Rect x={200} y={110} width={80} height={70} rx={6} fill={block} />
      <Rect x={60} y={250} width={90} height={80} rx={6} fill={block} />
      <Rect x={240} y={250} width={110} height={70} rx={6} fill={block} />
      <Rect x={40} y={470} width={120} height={90} rx={6} fill={block} />

      {/* Arterial roads */}
      <Path d="M0 210 H390" stroke={road} strokeWidth={16} />
      <Path d="M0 400 H390" stroke={road} strokeWidth={20} />
      <Path d="M0 600 H390" stroke={road} strokeWidth={14} />
      <Path d="M180 0 V700" stroke={road} strokeWidth={18} />
      <Path d="M320 0 V700" stroke={road} strokeWidth={12} />
      <Path d="M60 0 V700" stroke={road} strokeWidth={10} />

      {/* River sweeping across the corner */}
      <Path
        d="M300 0 C320 120 260 200 300 320 C340 440 280 560 320 700"
        stroke={water}
        strokeWidth={26}
        fill="none"
        strokeLinecap="round"
      />

      {showUserDot ? (
        <>
          <Circle cx={195} cy={350} r={44} fill={theme.colors.info} opacity={0.15} />
          <Circle cx={195} cy={350} r={11} fill={theme.colors.info} />
          <Circle cx={195} cy={350} r={11} fill="none" stroke="#fff" strokeWidth={3} />
        </>
      ) : null}
    </Svg>
  );
}
