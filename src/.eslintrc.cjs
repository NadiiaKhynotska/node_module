module.exports = {
    extends: ['plugin:prettier/recommended', 'plugin:@typescript-eslint/recommended'],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'simple-import-sort'],
    root: true,
    env: {
        browser: true,
        amd: true,
        node: true,
    },
    rules: {
        "no-unused-vars": ["error", { argsIgnorePattern: "req|res|next" }],
        "simple-import-sort/imports": "error",
        "simple-import-sort/exports": "error",
    },
};