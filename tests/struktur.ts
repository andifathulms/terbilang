/**
 * Invarian struktural, ditegakkan di seluruh sapuan menyeluruh.
 *
 * Ini bukan pemeriksaan tambahan: setiap butir di sini menandai satu bug nyata
 * yang muncul berulang di implementasi terbilang yang beredar.
 */

import { SKALA } from '@/lib';

/**
 * Pengali yang tidak pernah sah didahului "satu": bentuk leburnya wajib.
 * "satu ribu" perlu perlakuan terpisah — lihat periksaSatu() — karena
 * "dua puluh satu ribu" benar dan memuat potongan kata yang sama.
 */
const PENGALI_LEBUR = new Set(['puluh', 'belas', 'ratus']);

const KATA_SKALA = new Set<string>();
for (const s of SKALA) {
  if (s.baku) KATA_SKALA.add(s.baku);
  if (s.varian) KATA_SKALA.add(s.varian);
}

const URUTAN_SKALA = new Map<string, number>();
SKALA.forEach((s, i) => {
  if (s.baku) URUTAN_SKALA.set(s.baku, i);
  if (s.varian) URUTAN_SKALA.set(s.varian, i);
});

const PENGALI = new Set(['puluh', 'belas', 'ratus']);
const SATUAN = new Set([
  'satu',
  'dua',
  'tiga',
  'empat',
  'lima',
  'enam',
  'tujuh',
  'delapan',
  'sembilan',
]);
/** Bentuk lebur berdiri sendiri sebagai kuantitas penuh: sepuluh ribu, seratus ribu. */
const LEBUR = new Set(['sepuluh', 'sebelas', 'seratus']);

/**
 * Kembalikan daftar pelanggaran. Kosong berarti keluaran sah secara struktur.
 * `nilai` dipakai hanya untuk memutuskan apakah `nol` boleh muncul.
 */
export function pelanggaranStruktur(kata: string, nilai: bigint): string[] {
  const salah: string[] = [];

  if (kata.length === 0) {
    salah.push('keluaran kosong');
    return salah;
  }

  if (kata.includes('  ')) salah.push('spasi ganda');
  if (kata !== kata.trim()) salah.push('spasi di tepi');

  const token = kata.split(' ');

  const adaNol = token.includes('nol');
  if (adaNol && nilai !== 0n) salah.push('"nol" pada nilai bukan nol');
  if (!adaNol && nilai === 0n) salah.push('nol tanpa kata "nol"');

  let skalaTerakhir = Number.POSITIVE_INFINITY;
  for (let i = 0; i < token.length; i += 1) {
    const t = token[i]!;

    if (t === 'satu') {
      const sesudah = i + 1 < token.length ? token[i + 1]! : undefined;
      if (sesudah !== undefined && PENGALI_LEBUR.has(sesudah)) {
        // sepuluh, sebelas, seratus — bukan satu puluh, satu belas, satu ratus
        salah.push(`memuat "satu ${sesudah}"`);
      }
      // "satu ribu" salah hanya ketika satu adalah seluruh kuantitas kelompok;
      // pada "dua puluh satu ribu" ia bagian dari 21 dan sudah benar.
      const sebelum = i > 0 ? token[i - 1]! : undefined;
      const mulaiKelompok = sebelum === undefined || KATA_SKALA.has(sebelum);
      if (sesudah === 'ribu' && mulaiKelompok) salah.push('memuat "satu ribu"');
    }

    if (KATA_SKALA.has(t)) {
      // Kata skala wajib didahului kuantitas: satuan, pengali (dua puluh ribu),
      // atau bentuk lebur (sepuluh ribu). Bentuk seribu berdiri sendiri dan
      // tidak pernah lewat cabang ini.
      const sebelum = i > 0 ? token[i - 1] : undefined;
      if (
        sebelum === undefined ||
        !(SATUAN.has(sebelum) || PENGALI.has(sebelum) || LEBUR.has(sebelum))
      ) {
        salah.push(`kata skala "${t}" tanpa kuantitas`);
      }

      const peringkat = URUTAN_SKALA.get(t)!;
      if (peringkat >= skalaTerakhir) {
        salah.push(`urutan skala tidak menurun pada "${t}"`);
      }
      skalaTerakhir = peringkat;
    }

    if (PENGALI.has(t)) {
      const sebelum = i > 0 ? token[i - 1] : undefined;
      if (sebelum === undefined || !SATUAN.has(sebelum)) {
        salah.push(`pengali "${t}" tanpa kuantitas`);
      }
    }
  }

  return salah;
}

/** Pembangkit acak berbenih — sama di setiap mesin, setiap kali. */
export function acakBerbenih(benih: number): () => number {
  let a = benih >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Bilangan bulat acak 0..maks-1 sebagai BigInt, tanpa aritmetika `number` pada nilainya. */
export function bigintAcak(rng: () => number, digitMaks: number): bigint {
  const panjang = 1 + Math.floor(rng() * digitMaks);
  let digit = '';
  for (let i = 0; i < panjang; i += 1) {
    digit += String(Math.floor(rng() * 10));
  }
  return BigInt(digit);
}
