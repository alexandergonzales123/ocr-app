module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // ← si algún día añades más plugins, ponlos antes
      'react-native-reanimated/plugin',      // SIEMPRE el último
    ],
  };
};
