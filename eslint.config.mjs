import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

// Rules the codebase already broke when linting was restored (Next 16 removed
// `next lint`). They warn instead of fail; promote one back to 'error' once
// its warnings are cleaned up.
const baselineWarnings = Object.fromEntries([
  '@typescript-eslint/no-explicit-any',
  'react-hooks/immutability',
  'react-hooks/refs',
  'react-hooks/set-state-in-effect',
  'react/no-unescaped-entities',
].map(rule => [rule, 'warn']));

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  { rules: baselineWarnings },
  // package.json has no "type": "module", so these scripts are CommonJS and use require().
  { files: ['scripts/**/*.js'], rules: { '@typescript-eslint/no-require-imports': 'off' } },
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts', 'lib/generated/**', 'public/**', 'playwright-report/**', 'test-results/**']),
]);
