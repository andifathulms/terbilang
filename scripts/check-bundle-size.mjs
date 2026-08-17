/**
 * PRD.md §10: Site JS <= 100 KB gzipped. Tidak ada yang memeriksanya —
 * DESIGN-REWORK.md §4 menyebutnya tepat: "this project's whole character is
 * that its claims are checked."
 *
 * Dijalankan setelah `next build` (sebelum `postbuild.mjs` menghapus apa
 * pun), memakai .next/app-build-manifest.json — sumber yang sama dipakai
 * Next sendiri untuk mencetak tabel "First Load JS" di keluaran build.
 * Dihitung ulang di sini, bukan dikutip dari teks keluaran itu, supaya
 * gerbangnya tidak bisa diam-diam lewat kalau format tabelnya berubah.
 *
 *   pnpm build:size     — setelah pnpm build:lib && next build
 */
import { gzipSync } from 'node:zlib';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const AKAR_NEXT = '.next';
const BATAS_KB = 100;
const BATAS_BYTE = BATAS_KB * 1024;

const manifestJalur = join(AKAR_NEXT, 'app-build-manifest.json');
if (!existsSync(manifestJalur)) {
  console.error(`check-bundle-size: ${manifestJalur} tidak ada — jalankan setelah \`next build\`.`);
  process.exit(1);
}

const manifest = JSON.parse(readFileSync(manifestJalur, 'utf8'));

/** Satu baris per rute nyata (bukan /layout, bukan entri internal Next). */
const rute = Object.entries(manifest.pages).filter(([kunci]) => kunci.endsWith('/page'));

const gzipCache = new Map();
function ukuranGzip(berkasRelatif) {
  const cache = gzipCache.get(berkasRelatif);
  if (cache !== undefined) return cache;
  const isi = readFileSync(join(AKAR_NEXT, berkasRelatif));
  const ukuran = gzipSync(isi).length;
  gzipCache.set(berkasRelatif, ukuran);
  return ukuran;
}

let terbesar = 0;
let ruteTerbesar = '';
const baris = [];

for (const [kunci, berkas] of rute) {
  /* Hanya JS: PRD menyebut "Site JS", dan CSS punya anggaran yang berbeda. */
  const jsUnik = [...new Set(berkas.filter((b) => b.endsWith('.js')))];
  const total = jsUnik.reduce((a, b) => a + ukuranGzip(b), 0);
  baris.push({ kunci, total });
  if (total > terbesar) {
    terbesar = total;
    ruteTerbesar = kunci;
  }
}

baris.sort((a, b) => b.total - a.total);
for (const { kunci, total } of baris) {
  console.log(`${(total / 1024).toFixed(1).padStart(6)} kB  ${kunci}`);
}

console.log('');
console.log(
  `check-bundle-size: rute terberat ${ruteTerbesar} = ${(terbesar / 1024).toFixed(1)} kB gzip (batas ${BATAS_KB} kB, PRD.md §10)`,
);

if (terbesar > BATAS_BYTE) {
  console.error(`check-bundle-size: GAGAL — melebihi batas ${BATAS_KB} kB.`);
  process.exit(1);
}
