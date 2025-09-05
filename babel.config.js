module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // add any other plugins you need first
      "react-native-reanimated/plugin", // 👈 must be last
    ],
  };
};
