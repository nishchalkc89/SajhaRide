module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      // jsxImportSource routes JSX through NativeWind so `className` works.
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    plugins: [
      // Reanimated 4 compiles worklets via react-native-worklets. This plugin
      // MUST be listed last — it rewrites the output of everything above it.
      'react-native-worklets/plugin',
    ],
  };
};
