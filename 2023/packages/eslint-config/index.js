/*eslint no-undef: "error"*/
/*eslint-env node*/
module.exports = {
  env: {browser: true, es2020: true, node: true, jest: true},
  extends: ['eslint:recommended', 'prettier'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  settings: {
    'import/resolver': {
      typescript: {}
    }
  },
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'warn',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        ignoreRestSiblings: true,
        destructuredArrayIgnorePattern: '[A-Za-z0-9_-]',
        caughtErrors: 'none'
      }
    ]
  },
  ignorePatterns: [
    '**/.eslintrc.js',
    '**/.eslintrc.cjs',
    '**/dist/**/*',
    'packages/app/android/**/*',
    'packages/app/ios/**/*'
  ],
  overrides: [
    {
      files: ['*.ts', '*.tsx'], // Your TypeScript files extension

      // As mentioned in the comments, you should extend TypeScript plugins here,
      // instead of extending them outside the `overrides`.
      // If you don't want to extend any rules, you don't need an `extends` attribute.
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:import/typescript'
      ],

      parser: '@typescript-eslint/parser',

      plugins: ['@typescript-eslint', 'prettier'],

      parserOptions: {
        project: ['./tsconfig.json'] // Specify it only for TypeScript files
      }
    }
  ]
};
