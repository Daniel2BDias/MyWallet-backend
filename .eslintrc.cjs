module.exports = {
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  extends: [
    'plugin:import/recommended',
    'plugin:prettier/recommended', // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  rules: {
    'import/no-unresolved': 'error',
    'import/order': 'warn',
    'import/no-named-as-default-member': 'off',
    'import/newline-after-import': ['error'],
    'lines-between-class-members': ['error', 'always'],
  }
};
