/**
 * Dua betulan pada keluaran ekspor statis yang tidak bisa dikerjakan dari
 * dalam Next.
 *
 * 1. GitHub Pages menjalankan Jekyll kecuali diberi tahu untuk tidak. Tanpa
 *    .nojekyll, direktori _next diabaikan diam-diam dan situs terbit tanpa
 *    aset.
 *
 * 2. lang pada <html> per lokal. Tata letak akarlah yang merender <html>, dan
 *    ia tidak menerima ruas lokal, jadi seluruh halaman /en/ terbit dengan
 *    lang="id". Skrip pra-cat membetulkannya di peramban, tetapi perayap dan
 *    pengambil pratinjau membaca markah yang disajikan dan tidak menjalankan
 *    JavaScript — bagi mereka halaman Inggris tetap mengaku berbahasa
 *    Indonesia. Penggantiannya di sini hanya menyentuh atribut lang pada tag
 *    <html> pembuka, sekali per berkas.
 */
import { writeFileSync, existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const keluaran = 'out';

if (!existsSync(keluaran)) {
  console.error(`postbuild: direktori ${keluaran}/ tidak ada`);
  process.exit(1);
}

writeFileSync(join(keluaran, '.nojekyll'), '');
console.log('postbuild: out/.nojekyll ditulis');

/** Lokal selain bawaan; halaman /id/ sudah benar apa adanya. */
const LOKAL_LAIN = ['en'];

function berkasHtml(dir) {
  return readdirSync(dir).flatMap((nama) => {
    const jalur = join(dir, nama);
    return statSync(jalur).isDirectory()
      ? berkasHtml(jalur)
      : nama.endsWith('.html')
        ? [jalur]
        : [];
  });
}

let diubah = 0;
for (const lokal of LOKAL_LAIN) {
  const akar = join(keluaran, lokal);
  if (!existsSync(akar)) continue;

  for (const berkas of berkasHtml(akar)) {
    const isi = readFileSync(berkas, 'utf8');
    const betul = isi.replace(/(<html[^>]*?)lang="id"/, `$1lang="${lokal}"`);
    if (betul !== isi) {
      writeFileSync(berkas, betul);
      diubah += 1;
    }
  }
}
console.log(`postbuild: lang="en" dipasang pada ${diubah} berkas`);
