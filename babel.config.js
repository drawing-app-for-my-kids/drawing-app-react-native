module.exports = {
  presets: [
    "module:metro-react-native-babel-preset",
    "@babel/preset-env",
    "@babel/preset-react",
    "babel-preset-expo",
  ],
  plugins: [
    "babel-plugin-styled-components",
    "@babel/plugin-proposal-export-namespace-from",
    [
      "@babel/plugin-proposal-private-methods",
      {
        loose: true,
      },
    ],
    [
      "@babel/plugin-proposal-class-properties",
      {
        loose: true,
      },
    ],
    ["@babel/plugin-proposal-private-property-in-object", { loose: true }],
  ],
  env: {
    test: {
      plugins: ["@babel/plugin-transform-runtime"],
    },
  },
};
