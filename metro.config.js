const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Dev-only: tell the browser never to cache the HTML/JS the dev server returns.
// Without this, the browser can keep serving an old bundle after a rebuild —
// the "stale until hard refresh" problem. Harmless in production (this config
// only runs for the local dev server).
const baseEnhance = config.server?.enhanceMiddleware;
config.server = {
  ...config.server,
  enhanceMiddleware: (middleware, server) => {
    const wrapped = baseEnhance ? baseEnhance(middleware, server) : middleware;
    return (req, res, next) => {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      return wrapped(req, res, next);
    };
  },
};

module.exports = withNativeWind(config, { input: './src/global.css' });
