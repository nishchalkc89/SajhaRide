/**
 * SearchingBar — WEB variant.
 *
 * Neither Reanimated (no web runtime) nor core Animated (inert here) reliably
 * drive on react-native-web, so the sweep is a plain CSS keyframe animation on
 * raw DOM elements — guaranteed to run in the browser preview. Native uses the
 * Animated-based sibling file.
 */

import { createElement, useEffect } from 'react';

import { useTheme } from '@/theme';

const KEYFRAME_ID = 'sajha-searching-sweep';
const KEYFRAMES = `@keyframes ${KEYFRAME_ID} {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(360%); }
}`;

export function SearchingBar({ height = 6 }: { height?: number }) {
  const theme = useTheme();

  // Inject the keyframes once.
  useEffect(() => {
    if (document.getElementById(KEYFRAME_ID)) return;
    const style = document.createElement('style');
    style.id = KEYFRAME_ID;
    style.textContent = KEYFRAMES;
    document.head.appendChild(style);
  }, []);

  return createElement(
    'div',
    {
      style: {
        position: 'relative',
        width: '100%',
        height,
        borderRadius: height / 2,
        background: theme.colors.surfaceMuted,
        overflow: 'hidden',
      },
    },
    createElement('div', {
      style: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '40%',
        height: '100%',
        borderRadius: height / 2,
        background: theme.colors.primary,
        animation: `${KEYFRAME_ID} 1.1s ease-in-out infinite`,
      },
    })
  );
}
