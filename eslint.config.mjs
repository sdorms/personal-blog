import typescriptEslint from '@typescript-eslint/eslint-plugin'
import globals from 'globals'
import tsParser from '@typescript-eslint/parser'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
})

export default [
  {
    ignores: [
      '.next/**',
      'out/**',
      'node_modules/**',
      '.yarn/**',
      '.pnp.*',
      'coverage/**',
      'contentlayer/generated/**',
      '.contentlayer/**',
      'dist/**',
      'public/**'
    ],
  },
  // 1) Non-type-aware defaults (safe for JS/config/etc)
  js.configs.recommended,
  ...compat.extends(
    'plugin:jsx-a11y/recommended',
    'plugin:prettier/recommended',
    'next',
    'next/core-web-vitals'
  ),

    // Type-aware configs, restricted to TS/TSX
  ...compat
    .extends('plugin:@typescript-eslint/recommended', 'plugin:@typescript-eslint/recommended-type-checked')
    .map((cfg) => ({
      ...cfg,
      files: ['**/*.ts', '**/*.tsx'],
    })),

  // 2) Type-aware ONLY for TS files
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: { '@typescript-eslint': typescriptEslint },
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: __dirname,
      },
    },

    rules: {
      'prettier/prettier': 'error',
      'react/react-in-jsx-scope': 'off',

      'jsx-a11y/anchor-is-valid': [
        'error',
        {
          components: ['Link'],
          specialLink: ['hrefLeft', 'hrefRight'],
          aspects: ['invalidHref', 'preferButton'],
        },
      ],
      'react/prop-types': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'react/no-unescaped-entities': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',

    // turn off the strict “unsafe” family (template wasn’t built for it)
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-argument': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',

    // this one fires a lot with Next + generated code
    '@typescript-eslint/no-floating-promises': 'off',

    // Next route/page functions are often async for convention
    '@typescript-eslint/require-await': 'off',

    // common in Next templates when using template literals with `StaticImport`
    '@typescript-eslint/restrict-template-expressions': 'off',
    '@typescript-eslint/no-base-to-string': 'off',

    // optional: often noisy in app router templates
    '@typescript-eslint/no-unnecessary-type-assertion': 'off',
    },
  },
]
