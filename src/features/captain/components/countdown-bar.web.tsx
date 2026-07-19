/**
 * CountdownBar — WEB. Drains full→empty via a CSS keyframe (core Animated is
 * inert on react-native-web). Native uses the Animated sibling file.
 */

import { createElement, useEffect } from 'react';

import { useTheme } from '@/theme';

const KEYFRAME_ID = 'sajha-countdown-drain';
const KEYFRAMES = `@keyframes ${KEYFRAME_ID} { from { width: 100%; } to { width: 0%; } }`;

export function CountdownBar({ durationSeconds }: { durationSeconds: number }) {
  const theme = useTheme();

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
        height: 4,
        width: '100%',
        borderRadius: 2,
        overflow: 'hidden',
        background: theme.colors.surfaceMuted,
      },
    },
    createElement('div', {
      style: {
        height: '100%',
        background: theme.colors.primary,
        animation: `${KEYFRAME_ID} ${durationSeconds}s linear forwards`,
      },
    })
  );
}
