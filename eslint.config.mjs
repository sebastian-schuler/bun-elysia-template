import eslint from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import eslintPrettier from 'eslint-plugin-prettier/recommended';
import globals from 'globals';

export default [
    eslint.configs.recommended,
    {
        files: ['**/*.ts', '**/*.mts'],
        plugins: {
            '@typescript-eslint': tseslint,
        },
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
                project: './tsconfig.json',
            },
            globals: {
                ...globals.node,
                Bun: 'readonly',
            },
        },
        rules: {
            // Error prevention
            'no-var': 'error',
            'prefer-const': 'error',
            'no-unused-expressions': 'error',
            'no-duplicate-imports': 'error',
            'no-return-await': 'error',
            'require-await': 'error',
            'eqeqeq': ['error', 'always', { null: 'ignore' }],

            // TypeScript-specific rules
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                },
            ],
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-unnecessary-type-assertion': 'error',
            '@typescript-eslint/no-floating-promises': 'error',
            '@typescript-eslint/await-thenable': 'error',
            '@typescript-eslint/ban-ts-comment': [
                'error',
                {
                    'ts-ignore': 'allow-with-description',
                    'minimumDescriptionLength': 10,
                },
            ],

            // Stylistic choices
            'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
            'arrow-body-style': ['error', 'as-needed'],
            'curly': ['error', 'multi-line'],

            // Promise handling
            'no-promise-executor-return': 'error',

            // Error handling
            'no-throw-literal': 'error',
        },
    },
    {
        // Ignore patterns
        ignores: ['node_modules/**', 'dist/**', 'build/**'],
    },
    eslintPrettier,
];
