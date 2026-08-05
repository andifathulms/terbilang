import { defineConfig } from 'tsup';

// The package is lib/ only. The site is not part of the published artefact.
export default defineConfig({
  entry: ['lib/index.ts'],
  // tsconfig tersendiri: lib/ dibangun tanpa DOM, tanpa tipe Next, tanpa
  // incremental — sekaligus bukti bahwa pustaka ini berdiri tanpa situs.
  tsconfig: 'tsconfig.lib.json',
  format: ['esm', 'cjs'],
  outExtension: ({ format }) => ({ js: format === 'cjs' ? '.cjs' : '.js' }),
  dts: true,
  clean: true,
  sourcemap: true,
  treeshake: true,
  target: 'es2020',
});
