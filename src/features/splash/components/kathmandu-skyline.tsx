/**
 * Kathmandu valley skyline — original silhouette built from primitives.
 *
 * The reference splash grounds the brand in a tonal amber cityscape: tiered
 * pagoda temples and stupas. This renders that as a two-layer parallax
 * silhouette (far layer lighter, near layer darker) rather than a bitmap, so it
 * scales to any device width without an asset pipeline.
 */

import Svg, { Circle, G, Path, Rect, type SvgProps } from 'react-native-svg';

export type SkylineProps = Omit<SvgProps, 'viewBox'> & {
  width: number;
  height?: number;
  /** Far layer — lower contrast against the amber canvas. */
  farColor?: string;
  /** Near layer — the readable foreground silhouette. */
  nearColor?: string;
};

/** A tiered Newari pagoda. `tiers` controls roof count (2–3 in the valley). */
function Pagoda({ x, y, w, tiers = 3, color }: { x: number; y: number; w: number; tiers?: number; color: string }) {
  const roofs = Array.from({ length: tiers }, (_, i) => {
    const shrink = 1 - i * 0.18;
    const roofW = w * shrink;
    const roofY = y - i * (w * 0.3);
    return (
      <Path
        key={i}
        // Flared eaves: wide base tapering to the tier above it.
        d={`M${x - roofW / 2} ${roofY} L${x - roofW / 2 + roofW * 0.16} ${roofY - w * 0.2} L${
          x + roofW / 2 - roofW * 0.16
        } ${roofY - w * 0.2} L${x + roofW / 2} ${roofY} Z`}
        fill={color}
      />
    );
  });

  return (
    <G>
      {/* Plinth */}
      <Rect x={x - w * 0.42} y={y} width={w * 0.84} height={w * 0.55} fill={color} />
      {roofs}
      {/* Finial spire */}
      <Rect x={x - w * 0.03} y={y - tiers * (w * 0.3) - w * 0.28} width={w * 0.06} height={w * 0.3} fill={color} />
    </G>
  );
}

/** A stupa: hemispherical dome on a plinth with a stepped spire. */
function Stupa({ x, y, r, color }: { x: number; y: number; r: number; color: string }) {
  return (
    <G>
      <Path d={`M${x - r} ${y} A${r} ${r} 0 0 1 ${x + r} ${y} Z`} fill={color} />
      <Rect x={x - r * 0.34} y={y - r - r * 0.5} width={r * 0.68} height={r * 0.5} fill={color} />
      <Path d={`M${x} ${y - r - r * 1.1} L${x + r * 0.16} ${y - r - r * 0.5} L${x - r * 0.16} ${y - r - r * 0.5} Z`} fill={color} />
      <Circle cx={x} cy={y - r - r * 1.2} r={r * 0.09} fill={color} />
    </G>
  );
}

export function KathmanduSkyline({
  width,
  height = 180,
  farColor = 'rgba(17,17,19,0.10)',
  nearColor = 'rgba(17,17,19,0.20)',
  ...rest
}: SkylineProps) {
  // Design-space width; the SVG viewBox scales it to whatever `width` is passed.
  const VB_W = 390;
  const VB_H = 180;
  const ground = 150;

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${VB_W} ${VB_H}`} fill="none" {...rest}>
      {/* --- Far layer: hills + distant temples --- */}
      <G>
        <Path d={`M0 ${ground} L60 ${ground - 46} L120 ${ground} Z`} fill={farColor} />
        <Path d={`M90 ${ground} L165 ${ground - 62} L240 ${ground} Z`} fill={farColor} />
        <Path d={`M270 ${ground} L330 ${ground - 40} L390 ${ground} Z`} fill={farColor} />
        <Pagoda x={72} y={ground} w={40} tiers={3} color={farColor} />
        <Stupa x={300} y={ground} r={24} color={farColor} />
        <Pagoda x={355} y={ground} w={34} tiers={2} color={farColor} />
      </G>

      {/* --- Near layer: the temples that read as foreground --- */}
      <G>
        <Pagoda x={40} y={ground} w={52} tiers={3} color={nearColor} />
        <Pagoda x={140} y={ground} w={44} tiers={2} color={nearColor} />
        <Stupa x={215} y={ground} r={30} color={nearColor} />
        <Pagoda x={288} y={ground} w={48} tiers={3} color={nearColor} />
        <Rect x={330} y={ground - 40} width={26} height={40} fill={nearColor} />
        <Rect x={362} y={ground - 28} width={22} height={28} fill={nearColor} />
        {/* Ground plane the whole city sits on. */}
        <Rect x={0} y={ground} width={VB_W} height={VB_H - ground} fill={nearColor} />
      </G>
    </Svg>
  );
}
