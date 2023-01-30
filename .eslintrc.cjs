module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  env: {
    browser: true,
    amd: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'prettier', // Make sure this is always the last element in the array.
  ],
  plugins: ['simple-import-sort', '@typescript-eslint'],
  rules: {
    'no-unused-vars': 'off',
    'no-undef': 'off',
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-unused-vars': ['error'],
    '@typescript-eslint/consistent-type-imports': ['error'],
  },
};
