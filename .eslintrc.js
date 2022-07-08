module.exports = {
  root: true,
  plugins: ["prettier", "react"],
  extends: [
    "@react-native-community",
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:prettier/recommended",
  ],
  parserOptions: {
    ecmaVersion: "12",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    es2021: true,
    jest: true,
  },
  ignorePatterns: ["node_modules/"],
  rules: {
    "react/react-in-jsx-scope": "off",
    "react/prop-types": 0,
  },
};
