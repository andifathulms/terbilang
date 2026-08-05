import { defineConfig } from 'tsup';

// The package is lib/ only. The site is not part of the published artefact.
export default defineConfig({
  entry: ['lib/index.ts'],
  format: ['esm', 'cjs'],
  outExtension: ({ format }) => ({ js: format === 'cjs' ? '.cjs' : '.js' }),
  dts: true,
  clean: true,
  sourcemap: true,
  treeshake: true,
  target: 'es2020',
});
