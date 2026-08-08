# SajhaRide

A ride-hailing app for Nepal, built with Expo + React Native. Two sides of one
codebase: a **passenger** app (book a bike or auto, track your ride, pay) and
a **captain** app (go online, accept requests, navigate, get paid) — sharing
the same design system and running on iOS, Android, and web.

## Stack

- Expo SDK 57 / React Native 0.86 / React 19, file-based routing via Expo Router
- NativeWind (Tailwind for RN) + a small custom theme system
- Zustand stores, persisted with MMKV
- `react-native-maps` on native; a keyless Google Maps embed on web
- OpenStreetMap Nominatim for Nepal-wide place search
- Distance-based fares (haversine distance, Bike/Auto rates)

## Getting started

```bash
npm install
npx expo start
```

This opens the Expo dev tools — from there, launch on Android, iOS, or web.
A Google Maps API key is required for native maps; set
`REPLACE_WITH_YOUR_GOOGLE_MAPS_API_KEY` in `app.json` under `ios.config` and
`android.config.googleMaps`. The web build doesn't need a key.

## Trying it out

The app ships with demo data so the whole flow works without a real backend:

- **Passenger OTP**: `123456` (tap the on-screen hint to autofill)
- **Captain start PIN**: `4242`, entered by the captain to begin a ride

From the role-select screen, choose **Join as a Passenger** to book a ride, or
**Join as a Captain** to register a captain profile and go online.

## Project layout

- `src/app` — Expo Router routes (thin shells that render the matching screen
  from `src/features`)
- `src/features` — screens and their feature-local components, grouped by
  flow (`auth`, `home`, `ride`, `captain`, `bookings`, `wallet`, `profile`, …)
- `src/store` — Zustand stores (`ride-store`, `captain-store`, `auth-store`, …)
- `src/components` — shared UI primitives, map, navigation chrome
- `src/theme` — spacing/radius/elevation/motion tokens and the theme provider
- `src/services` — mock data and the Nepal place-search client

## Scripts

```bash
npm run android   # expo start --android
npm run ios       # expo start --ios
npm run web       # expo start --web
npm run lint      # expo lint
```
