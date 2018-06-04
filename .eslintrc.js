module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 2017,
    sourceType: 'module',
  },
  env: {
    browser: true,
    node: true,
  },
  extends: ['prettier'],
  // required to lint *.vue files
  plugins: ['html', 'vue', 'prettier'],
  // add your custom rules here
  rules: {
    'no-console': ['warn'],
    'no-alert': ['warn'],
    'prettier/prettier': [
      'warn',
      {
        singleQuote: true,
        trailingComma: 'es5',
        printWidth: 120,
      },
    ],
  },
  globals: {},
};
