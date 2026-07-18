/**
 * Onboarding content. Copy is verbatim from the reference screens.
 *
 * Illustrations are 3D-rendered raster assets (generated to match the mock's
 * glossy style), bundled under assets/images/onboarding. Required with relative
 * paths so Metro's asset resolver picks them up reliably.
 */

import type { ImageSourcePropType } from 'react-native';

export type Slide = {
  id: string;
  title: string;
  body: string;
  image: ImageSourcePropType;
};

export const SLIDES: readonly Slide[] = [
  {
    id: 'comfortable-rides',
    title: 'Comfortable Rides',
    body: 'Book a ride in seconds and travel comfortably with SajhaRide.',
    image: require('../../../assets/images/onboarding/comfortable-rides.png'),
  },
  {
    id: 'safe-secure',
    title: 'Safe & Secure',
    body: 'Your safety is our priority. We ensure verified riders and secure journeys.',
    image: require('../../../assets/images/onboarding/safe-secure.png'),
  },
  {
    id: 'affordable-fares',
    title: 'Affordable Fares',
    body: 'Enjoy affordable fares and exclusive offers on every ride.',
    image: require('../../../assets/images/onboarding/affordable-fares.png'),
  },
] as const;
