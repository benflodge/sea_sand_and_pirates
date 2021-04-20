module.exports = {
    env: {
        es6: true,
    },
    extends: ['eslint:recommended', 'prettier'],
    parserOptions: {
        sourceType: 'module',
    },
    rules: {
        indent: ['error', 4, { SwitchCase: 1 }],
        'linebreak-style': ['error', 'unix'],
        quotes: ['error', 'single'],
        semi: ['error', 'always'],
        "no-var": "error"
    },
};
