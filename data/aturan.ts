/**
 * Rujukan aturan. Teksnya di sini; contohnya dihitung oleh pustaka saat
 * halaman dibangun, sehingga tidak ada contoh yang bisa basi tanpa ketahuan.
 */

import type { Lokal } from '../app/kamus';

export interface Contoh {
  /** Masukan untuk format(). */
  readonly masukan: bigint | string;
  /** Bentuk keliru yang lazim muncul di implementasi lain, bila ada. */
  readonly keliru?: string;
}

export interface Aturan {
  readonly kunci: string;
  readonly judul: Record<Lokal, string>;
  readonly isi: Record<Lokal, string>;
  readonly sumber: string;
  readonly contoh: readonly Contoh[];
}

export const ATURAN: readonly Aturan[] = [
  {
    kunci: 'se',
    judul: { id: 'Aturan se-', en: 'The se- rule' },
    isi: {
      id: 'Untuk angka 1 di depan, katanya melebur, bukan tersusun: sepuluh, sebelas, seratus, seribu. Peleburan berhenti di ribu — pemakaian baku mengambil satu juta.',
      en: 'For a leading 1 the word fuses rather than compounds: sepuluh, sebelas, seratus, seribu. The fusion stops at ribu — standard usage takes satu juta.',
    },
    sumber: 'KBBI; PUEBI/EYD, penulisan bilangan.',
    contoh: [
      { masukan: 10n, keliru: 'satu puluh' },
      { masukan: 11n, keliru: 'satu belas' },
      { masukan: 100n, keliru: 'satu ratus' },
      { masukan: 1_000n, keliru: 'satu ribu' },
      { masukan: 1_000_000n, keliru: 'sejuta (varian, lihat opsi)' },
    ],
  },
  {
    kunci: 'belasan',
    judul: { id: 'Belasan', en: 'The teens' },
    isi: {
      id: '11 sampai 19 memakai belas dan tidak dapat diturunkan dari pola puluhan. Sebelas melebur; sisanya tersusun.',
      en: '11 to 19 use belas and are not derivable from the tens pattern. Sebelas fuses; the rest compound.',
    },
    sumber: 'KBBI, lema belas.',
    contoh: [{ masukan: 11n }, { masukan: 12n }, { masukan: 19n }],
  },
  {
    kunci: 'kelompok-kosong',
    judul: { id: 'Kelompok kosong', en: 'Empty group suppression' },
    isi: {
      id: 'Kelompok tiga angka yang bernilai 000 tidak menghasilkan kata sama sekali. Ini bug struktural yang paling sering muncul di implementasi lain.',
      en: 'A three-digit group of 000 emits nothing at all. This is the most common structural bug in other implementations.',
    },
    sumber: 'Konvensi pembacaan bilangan; PUEBI/EYD.',
    contoh: [
      { masukan: 1_000_001n, keliru: 'satu juta nol ribu satu' },
      { masukan: 1_000_000_001n, keliru: 'satu miliar nol juta nol ribu satu' },
      { masukan: 101_000n },
    ],
  },
  {
    kunci: 'skala',
    judul: { id: 'Kata skala', en: 'Scale words' },
    isi: {
      id: 'ribu (10³), juta (10⁶), miliar (10⁹), triliun (10¹²), kuadriliun (10¹⁵). Ejaan milyar dan trilyun lazim di lapangan tetapi bukan bentuk KBBI; keduanya tersedia sebagai opsi. Di atas kuadriliun pemakaian belum mapan, jadi pustaka menolak alih-alih mengarang kata baru.',
      en: 'ribu (10³), juta (10⁶), miliar (10⁹), triliun (10¹²), kuadriliun (10¹⁵). The spellings milyar and trilyun are common in the field but are not KBBI forms; both are available as an option. Above kuadriliun usage is unsettled, so the library refuses rather than inventing a scale word.',
    },
    sumber: 'KBBI, lema ribu, juta, miliar, triliun, kuadriliun.',
    contoh: [
      { masukan: 1_000_000_000n },
      { masukan: 10n ** 12n },
      { masukan: 10n ** 15n },
      { masukan: 10n ** 18n },
    ],
  },
  {
    kunci: 'desimal',
    judul: { id: 'Desimal', en: 'Decimals' },
    isi: {
      id: 'Koma adalah pemisah desimal dan dibaca koma; digit di belakangnya dibaca satu per satu, bukan sebagai bilangan puluhan.',
      en: 'The comma is the decimal separator and is read as koma; the digits after it are read individually, not as a tens number.',
    },
    sumber: 'PUEBI/EYD, tanda koma pada angka desimal.',
    contoh: [
      { masukan: '1,25', keliru: 'satu koma dua puluh lima' },
      { masukan: '0,05' },
    ],
  },
  {
    kunci: 'presisi',
    judul: { id: 'Presisi di atas 2⁵³', en: 'Precision above 2⁵³' },
    isi: {
      id: 'Bilangan JavaScript kehilangan ketepatan di atas 2⁵³ ≈ 9×10¹⁵, tepat di atas triliun. Implementasi berbasis number benar sampai triliun lalu salah diam-diam — lolos uji sekilas, dan merusak faktur sungguhan. Pustaka ini memakai BigInt di seluruh jalur aritmetika dan menolak masukan number.',
      en: 'JavaScript numbers lose precision above 2⁵³ ≈ 9×10¹⁵, just past triliun. A number-based implementation is correct through triliun and silently wrong after — it passes casual testing and corrupts a real invoice. This library uses BigInt throughout and rejects number input.',
    },
    sumber: 'ECMA-262, Number.MAX_SAFE_INTEGER.',
    contoh: [{ masukan: 9_007_199_254_740_993n }, { masukan: '999999999999999999' }],
  },
  {
    kunci: 'dokumen',
    judul: { id: 'Mata uang dan dokumen', en: 'Currency and documents' },
    isi: {
      id: 'Pada kuitansi dan cek, jumlah terbilang ditutup rupiah dan dikurung tanda pagar di kedua ujung supaya tidak bisa ditambahi setelah ditandatangani. Sen dipakai untuk perseratusan bila konteks pembukuan menuntutnya.',
      en: 'On receipts and cheques the amount in words ends with rupiah and is bracketed with hash marks at both ends so nothing can be added after signing. Sen is used for hundredths where the accounting context requires it.',
    },
    sumber: 'Konvensi dokumen keuangan Indonesia; KBBI, lema sen.',
    contoh: [{ masukan: 1_500n }, { masukan: '1500,25' }],
  },
];
