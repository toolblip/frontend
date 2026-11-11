import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

// Rules the codebase already broke when linting was restored (Next 16 removed
// `next lint`). They warn instead of fail; promote one back to 'error' once
// its warnings are cleaned up.
const baselineWarnings = Object.fromEntries([
  '@typescript-eslint/no-explicit-any',
  '@typescript-eslint/no-require-imports',
  'prefer-const',
  'react-hooks/immutability',
  'react-hooks/refs',
  'react-hooks/set-state-in-effect',
  'react-hooks/static-components',
  'react/no-unescaped-entities',
].map(rule => [rule, 'warn']));

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  { rules: baselineWarnings },
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts', 'lib/generated/**', 'public/**', 'playwright-report/**', 'test-results/**']),
]);
