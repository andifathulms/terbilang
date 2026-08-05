import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  resolve: {
    alias: {
      '@/lib': fileURLToPath(new URL('./lib/index.ts', import.meta.url)),
    },
  },
  test: {
    include: ['tests/**/*.test.ts'],
    // The exhaustive sweep is a million round-trips; it is never marked slow
    // and never sampled, so give it room rather than an excuse to be skipped.
    testTimeout: 300_000,
  },
});
