module.exports = {
  env: {
    // @see https://stackoverflow.com/questions/49250221/fetch-is-undefined-and-localstorage-is-undefined-on-using-eslint-config-ai
    browser: true,
    // @see https://github.com/eslint/eslint/issues/9812
    es2020: true,
    // @see https://stackoverflow.com/questions/50894000/eslint-process-is-not-defined
    node: true,
  },
  parserOptions: {
    // @see https://stackoverflow.com/questions/61628947/eslint-optional-chaining-error-with-vscode & https://eslint.org/docs/latest/use/configure/language-options#specifying-parser-options
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  // @see https://react.dev/learn/editor-setup#linting & 'plugin:react/jsx-runtime' for React 17+: https://github.com/jsx-eslint/eslint-plugin-react#configuration-legacy-eslintrc- & https://prettier.io/docs/en/integrating-with-linters.html
  extends: ['eslint:recommended', 'prettier'],
  ignorePatterns: ['dist', '.eslintrc.cjs', '**/__*'],
  plugins: ['simple-import-sort'],
  rules: {
    // `simple-import-sort`: https://dev.to/julioxavierr/sorting-your-imports-with-eslint-3ped
    'simple-import-sort/imports': 'warn',
    'simple-import-sort/exports': 'warn',
    // Personal preference:
    camelcase: ['error', { properties: 'always' }],
  },
  overrides: [
    {
      files: ['*.js', '*.jsx', '*.ts', '*.tsx'],
      rules: {
        'simple-import-sort/imports': [
          'error',
          {
            groups: [
              // Packages `react` related packages come first.
              ['^react', '^@?\\w'],
              // Internal packages.
              ['^(@|components)(/.*|$)'],
              // Side effect imports.
              ['^\\u0000'],
              // Parent imports. Put `..` last.
              ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
              // Other relative imports. Put same-folder imports and `.` last.
              ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
              // Style imports.
              ['^.+\\.?(css)$'],
            ],
          },
        ],
      },
    },
  ],
};
