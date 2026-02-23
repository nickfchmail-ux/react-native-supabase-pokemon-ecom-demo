module.exports = function (api) {
  api.cache(true);

  const plugins = [
    // Worklets plugin should come early
    'react-native-worklets/plugin',
    // Uncomment and move to the VERY END if you actively use Reanimated animations
    // 'react-native-reanimated/plugin',
  ];

  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],
    plugins, // reference the plugins array here

    env: {
      production: {
        plugins: ['transform-remove-console'],
      },
    },
  };
};
