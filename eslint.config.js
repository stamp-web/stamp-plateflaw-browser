import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'
import tseslint from '@typescript-eslint/eslint-plugin'

export default [
  {
    ignores: [
      'dist/assets/**',
      'coverage/**',
      'test-results/**',
      'node_modules/**',
      'playwright-report/**'
    ]
  },

  ...defineConfigWithVueTs(
    {
      name: 'app/files-to-lint',
      files: ['src/**/*.{ts,mts,tsx,vue}']
    },
    pluginVue.configs['flat/essential'],
    vueTsConfigs.recommended,
    {
      files: ['src/**/__tests__/*']
    },
    skipFormatting
  ),
  {
    name: 'TypeScript specific overrides',
    files: ['src/**/*.{ts,tsx,mts,vue}', 'e2e/**/*.ts'],
    plugins: {
      tseslint
    },
    rules: {
      'no-console': 'warn',
      '@typescript-eslint/ban-ts-comment': 'warn'
    }
  }
]
