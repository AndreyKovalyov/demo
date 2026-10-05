import js from '@eslint/js'
import ts from 'typescript-eslint'
import vue from 'eslint-plugin-vue'
import prettier from 'eslint-config-prettier'

export default ts.config(
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '.yarn/**',
      '.idea/**',
      'apps/web/public/mockServiceWorker.js',
      'playwright-report/**',
      'test-results/**'
    ]
  },
  js.configs.recommended,
  ...ts.configs.recommended,
  ...vue.configs['flat/recommended'],
  {
    files: ['**/*.vue'],
    languageOptions: { parserOptions: { parser: ts.parser, extraFileExtensions: ['.vue'] } },
    rules: {
      'no-undef': 'off',
      'vue/multi-word-component-names': 'off',
      'vue/max-attributes-per-line': 'off',
      'vue/html-self-closing': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/html-indent': 'off'
    }
  },
  { files: ['**/*.{ts,mjs,vue}'], rules: { '@typescript-eslint/no-explicit-any': 'error' } },
  {
    files: ['**/*.mjs'],
    languageOptions: { globals: { console: 'readonly', process: 'readonly', URL: 'readonly' } }
  },
  prettier,
  { rules: { curly: ['error', 'all'] } }
)
