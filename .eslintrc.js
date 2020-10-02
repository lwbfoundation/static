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
  overrides: [
    {
      files: ['*.{ts,tsx}'],
      extends: ['plugin:@typescript-eslint/recommended'],
      plugins: ['@typescript-eslint'],
      rules: {
        'react/prop-types': 'off',
      },
    },
  ],
  rules: {
    'prettier/prettier': 'error',
    'react/jsx-filename-extension': 'off',
    'import/prefer-default-export': 'off',
    'import/extensions': [
      'error',
      {
        js: 'never',
        ts: 'never',
        tsx: 'never',
        json: 'always',
      },
    ],
    'react/jsx-props-no-spreading': 'off',
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': 'error',
  },
  settings: {
    'import/resolver': {
      typescript: {}, // this loads <rootdir>/tsconfig.json to eslint
    },
  },
};
