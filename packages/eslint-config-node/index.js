/*eslint no-undef: "error"*/
/*eslint-env node*/
module.exports = {
  extends: ['plugin:node/recommended', '@ronda-penal/eslint-config'],
  plugins: ['node'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  settings: {
    node: {
      resolvePaths: [__dirname],
      tryExtensions: ['.ts', '.js', '.json', '.node']
    }
  },
  rules: {
    'node/no-unsupported-features/es-syntax': 'off'
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],

      rules: {
        '@typescript-eslint/no-misused-promises': [
          'error',
          {
            checksVoidReturn: false
          }
        ]
      }
    }
  ]
};
