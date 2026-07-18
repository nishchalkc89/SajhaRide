/**
 * Custom HTML shell for the web build (Expo Router picks this up automatically).
 *
 * The `no-store` cache directives stop the browser from serving a stale JS
 * bundle after a rebuild — the reason the dev preview kept showing an old
 * screen until a hard refresh. Also disables body scroll bounce and sets the
 * viewport for a mobile-like frame.
 */

import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover"
        />

        {/* Prevent the browser from caching the document/bundle across rebuilds. */}
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />

        <ScrollViewStyleReset />
      </head>
      <body>{children}</body>
    </html>
  );
}
