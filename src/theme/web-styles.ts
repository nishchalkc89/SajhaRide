/**
 * Web-only style shims.
 *
 * react-native-web renders a native browser focus outline on TextInputs, which
 * shows as an odd dark ring/line inside our custom-bordered fields. These
 * properties exist only on web and aren't in RN's style types, so they're cast
 * here once and consumed everywhere an input is rendered.
 */

import { Platform, type TextStyle } from 'react-native';

/** Spread onto any TextInput style to remove the browser focus outline on web. */
export const noWebOutline: TextStyle =
  Platform.OS === 'web' ? ({ outlineStyle: 'none', outlineWidth: 0 } as unknown as TextStyle) : {};
