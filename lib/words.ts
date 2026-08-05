/**
 * Leksikon. Satu-satunya tempat kata muncul sebagai literal.
 *
 * Ejaan mengikuti KBBI dan PUEBI/EYD (Badan Pengembangan dan Pembinaan Bahasa).
 */

import type { InfoSkala } from './types';

/** Indeks = nilai. `nol` hanya dipakai untuk nol dan untuk digit di belakang koma. */
export const SATUAN = [
  'nol',
  'satu',
  'dua',
  'tiga',
  'empat',
  'lima',
  'enam',
  'tujuh',
  'delapan',
  'sembilan',
] as const;

export const PULUH = 'puluh';
export const BELAS = 'belas';
export const RATUS = 'ratus';

/**
 * Bentuk lebur `se-`. Aturan ini leksikal, bukan aritmetis: peleburan berlaku
 * untuk puluh, belas, ratus, dan ribu — tetapi pemakaian baku mengambil
 * `satu juta`, bukan `sejuta` (lihat opsi `sejuta` di options.ts).
 */
export const SEPULUH = 'sepuluh';
export const SEBELAS = 'sebelas';
export const SERATUS = 'seratus';
export const SERIBU = 'seribu';
export const SEJUTA = 'sejuta';

export const MINUS = 'minus';
export const KOMA = 'koma';
export const RUPIAH = 'rupiah';
export const SEN = 'sen';

/**
 * Kata skala. Berhenti di kuadriliun: KBBI memuat ribu, juta, miliar, triliun,
 * dan kuadriliun (bilangan 1 diikuti 15 nol). Di atas itu pemakaian belum
 * mapan, jadi `format` menolak alih-alih meneruskan pola.
 *
 * Ejaan `milyar` dan `trilyun` lazim di lapangan tetapi bukan bentuk KBBI;
 * keduanya tersedia lewat opsi `ejaanMiliar`, bukan sebagai bawaan diam-diam.
 */
export const SKALA: readonly InfoSkala[] = [
  { nama: 'satuan', nilai: 1n, baku: '', varian: '' },
  { nama: 'ribu', nilai: 10n ** 3n, baku: 'ribu', varian: 'ribu' },
  { nama: 'juta', nilai: 10n ** 6n, baku: 'juta', varian: 'juta' },
  { nama: 'miliar', nilai: 10n ** 9n, baku: 'miliar', varian: 'milyar' },
  { nama: 'triliun', nilai: 10n ** 12n, baku: 'triliun', varian: 'trilyun' },
  { nama: 'kuadriliun', nilai: 10n ** 15n, baku: 'kuadriliun', varian: 'kuadriliun' },
];

/** Batas eksklusif: 10^18. Nilai >= batas ditolak, tidak dipangkas. */
export const BATAS_ATAS = 10n ** 18n;

/** Ditampilkan di pesan galat: 999.999.999.999.999.999. */
export const BATAS_ATAS_TERBACA = '999.999.999.999.999.999';
