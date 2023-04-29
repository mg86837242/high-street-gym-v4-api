module.exports = {
  env: {
    // @see: https://stackoverflow.com/questions/49250221/fetch-is-undefined-and-localstorage-is-undefined-on-using-eslint-config-ai
    browser: true,
  },
  parserOptions: {
    // @see: https://stackoverflow.com/questions/61628947/eslint-optional-chaining-error-with-vscode
    //  & https://eslint.org/docs/latest/use/configure/language-options#specifying-parser-options
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  // @see: https://prettier.io/docs/en/integrating-with-linters.html & https://react.dev/learn/editor-setup#linting
  //  & https://www.npmjs.com/package/eslint-config-react-app & https://www.npmjs.com/package/eslint-plugin-react-hooks
  extends: ['airbnb', 'prettier', 'react-app'],
  plugins: ['react-hooks'],
  ignorePatterns: [
    // Unused folders && files
    '**/__*',
    // Temporarily ignored
  ],
  rules: {
    // @see: https://www.npmjs.com/package/eslint-plugin-react-hooks
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error',
    // Band-aid solution to lack of resolver in the backend, @see:
    // https://stackoverflow.com/questions/46208367/how-to-remove-eslint-error-no-unresolved-from-importing-react
    // & https://stackoverflow.com/questions/67316153/facing-problem-while-importing-files-in-nodejs
    'import/no-unresolved': ['warn', { caseSensitive: false }],
    'import/extensions': [
      'error',
      {
        js: 'ignorePackages',
      },
    ],
  },
};
