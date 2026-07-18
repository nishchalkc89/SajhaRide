/** Route: `/` — Screen 1, Splash. Thin route shell; the screen lives in features. */

import { SplashScreenView } from '@/features/splash/splash-screen';

export default function Index() {
  return <SplashScreenView />;
}
