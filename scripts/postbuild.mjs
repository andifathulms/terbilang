/**
 * GitHub Pages menjalankan Jekyll kecuali diberi tahu untuk tidak. Tanpa
 * .nojekyll, direktori _next diabaikan diam-diam dan situs terbit tanpa aset.
 */
import { writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const keluaran = 'out';

if (!existsSync(keluaran)) {
  console.error(`postbuild: direktori ${keluaran}/ tidak ada`);
  process.exit(1);
}

writeFileSync(join(keluaran, '.nojekyll'), '');
console.log('postbuild: out/.nojekyll ditulis');
