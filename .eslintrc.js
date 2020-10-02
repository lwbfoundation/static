module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:react/recommended',
    'airbnb',
    'plugin:prettier/recommended',
    'prettier/react',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'react', 'prettier'],
  overrides: {
    files: ['*.ts'],
    extends: ['plugin:@typescript-eslint/recommended'],
    plugins: ['@typescript-eslint'],
  },
  rules: {
    'prettier/prettier': 'error',
    'react/jsx-filename-extension': 'off',
    'import/prefer-default-export': 'off',
  },
};
