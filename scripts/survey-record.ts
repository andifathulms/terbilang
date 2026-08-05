/**
 * survey:record — HANYA PENGEMBANGAN.
 *
 * Memasang dan menjalankan paket pihak ketiga di direktori sementara, lalu
 * menulis hasilnya ke data/survey/hasil.json. Tidak pernah dijalankan di CI dan
 * tidak pernah ikut dalam bundel yang dikirim: keluarannya data, bukan kodenya.
 *
 *   pnpm survey:record <paket> [paket...]
 *
 * Nama paket diberikan oleh pemakai supaya tidak ada klaim tentang paket yang
 * tidak benar-benar diukur. Paket yang gagal dipasang atau tidak bisa dipanggil
 * dicatat sebagai gagal, bukan dihilangkan.
 */

import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { BATERAI } from '../data/survey/baterai';
import type { BarisHasil, PaketTerekam, RekamanSurvei } from '../data/survey/skema';

const SEMENTARA = resolve('.survey-tmp');
const KELUARAN = resolve('data/survey/hasil.json');

const nama = process.argv.slice(2).filter((a) => !a.startsWith('-'));

if (nama.length === 0) {
  console.error('pakai: pnpm survey:record <paket> [paket...]');
  console.error('contoh: pnpm survey:record angka-terbilang-js');
  process.exit(1);
}

console.log(`survey:record — ${nama.length} paket, ${BATERAI.length} masukan`);
console.log('PERINGATAN: skrip ini menjalankan kode pihak ketiga di mesin ini.');

rmSync(SEMENTARA, { recursive: true, force: true });
mkdirSync(SEMENTARA, { recursive: true });
writeFileSync(
  join(SEMENTARA, 'package.json'),
  JSON.stringify({ name: 'survey-tmp', private: true, type: 'commonjs' }, null, 2),
);

const paket: PaketTerekam[] = [];
const hasil: BarisHasil[] = [];

for (const p of nama) {
  try {
    execFileSync('npm', ['install', '--silent', '--no-audit', '--no-fund', p], {
      cwd: SEMENTARA,
      stdio: 'inherit',
    });
  } catch (e) {
    paket.push({
      nama: p,
      versi: 'tidak terpasang',
      ekosistem: 'npm',
      bentuk: '-',
      gagal: `pemasangan gagal: ${(e as Error).message}`,
    });
    continue;
  }

  const versi = bacaVersi(p);
  const panggil = await muatPemanggil(p);

  if (panggil === undefined) {
    paket.push({
      nama: p,
      versi,
      ekosistem: 'npm',
      bentuk: '-',
      gagal: 'tidak ditemukan fungsi yang bisa dipanggil pada ekspor paket',
    });
    continue;
  }

  paket.push({ nama: p, versi, ekosistem: 'npm', bentuk: panggil.bentuk });

  for (const masukan of BATERAI) {
    try {
      const keluaran = panggil.fungsi(masukan);
      hasil.push({
        paket: p,
        masukan,
        keluaran: typeof keluaran === 'string' ? keluaran.trim() : String(keluaran),
        galat: null,
      });
    } catch (e) {
      hasil.push({ paket: p, masukan, keluaran: null, galat: (e as Error).message });
    }
  }
}

const rekaman: RekamanSurvei = {
  direkamPada: new Date().toISOString().slice(0, 10),
  runtime: process.version,
  paket,
  hasil,
};

writeFileSync(KELUARAN, `${JSON.stringify(rekaman, null, 2)}\n`);
rmSync(SEMENTARA, { recursive: true, force: true });

console.log(`survey:record — ${hasil.length} baris ditulis ke ${KELUARAN}`);

function bacaVersi(p: string): string {
  try {
    const pj = join(SEMENTARA, 'node_modules', p, 'package.json');
    return (JSON.parse(readFileSync(pj, 'utf8')) as { version?: string }).version ?? 'tidak diketahui';
  } catch {
    return 'tidak diketahui';
  }
}

/**
 * Bentuk ekspor di ekosistem ini beragam: fungsi default, named export, atau
 * objek dengan metode. Ketiganya dicoba dan yang berhasil dicatat, sehingga
 * tabel menyebut persis bagaimana paket dipanggil.
 */
async function muatPemanggil(
  p: string,
): Promise<{ fungsi: (masukan: string) => unknown; bentuk: string } | undefined> {
  const entri = pathToFileURL(join(SEMENTARA, 'node_modules', p)).href;

  let modul: Record<string, unknown>;
  try {
    modul = (await import(entri)) as Record<string, unknown>;
  } catch (e) {
    console.error(`  ${p}: gagal dimuat — ${(e as Error).message}`);
    return undefined;
  }

  const kandidat: ReadonlyArray<readonly [string, unknown]> = [
    ['module.exports', modul['default'] ?? modul],
    ['terbilang', (modul['terbilang'] ?? (modul['default'] as Record<string, unknown> | undefined)?.['terbilang'])],
    ['toWords', modul['toWords']],
  ];

  for (const [bentuk, nilai] of kandidat) {
    if (typeof nilai === 'function') {
      return { fungsi: nilai as (masukan: string) => unknown, bentuk };
    }
  }

  return undefined;
}
