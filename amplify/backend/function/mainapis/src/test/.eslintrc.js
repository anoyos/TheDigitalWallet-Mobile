module.exports = {
  "extends": "eslint:recommended",
  "parserOptions": {
    "sourceType": "module",
    "ecmaVersion": 2018,
  },
  "env": {
    "es6": true,
    "node": true,
    "mocha": true,
  },
  rules: {
    semi: "error",
    quotes: ["error", "double"],
  }
};
