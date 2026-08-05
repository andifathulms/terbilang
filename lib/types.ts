/**
 * Tipe dasar. Tidak ada ketergantungan pada lingkungan: tidak ada DOM, tidak
 * ada Date, tidak ada Intl, tidak ada `number` di jalur aritmetika.
 */

import type { Galat } from './errors';

/**
 * Hasil bertipe union terdiskriminasi pada `type`. Tidak ada pengecualian yang
 * dilempar dari permukaan publik: kegagalan adalah nilai, dan nilai itu
 * menyebutkan persis apa yang gagal.
 */
export type Hasil<T> =
  | { readonly type: 'ok'; readonly nilai: T }
  | { readonly type: 'galat'; readonly galat: Galat };

export function ok<T>(nilai: T): Hasil<T> {
  return { type: 'ok', nilai };
}

export function galat<T>(g: Galat): Hasil<T> {
  return { type: 'galat', galat: g };
}

/** Nama kelompok tiga angka, dari yang terkecil. */
export type NamaSkala =
  | 'satuan'
  | 'ribu'
  | 'juta'
  | 'miliar'
  | 'triliun'
  | 'kuadriliun';

export interface InfoSkala {
  readonly nama: NamaSkala;
  readonly nilai: bigint;
  /** Ejaan KBBI. */
  readonly baku: string;
  /** Ejaan varian yang lazim di lapangan (milyar, trilyun). */
  readonly varian: string;
}

/**
 * Satu kelompok tiga angka beserta skalanya. `nilai` selalu 0..999; kelompok
 * bernilai 0 tetap muncul di dekomposisi dan disaring saat pembentukan kata —
 * pemisahan itu disengaja agar situs bisa menggambarkan kelompok kosong runtuh.
 */
export interface Kelompok {
  readonly nilai: bigint;
  readonly skala: InfoSkala;
}

/**
 * Bentuk masukan yang sudah dinormalkan: tanda, bagian bulat sebagai digit,
 * dan bagian pecahan sebagai digit (bukan angka pecahan biner).
 */
export interface Terurai {
  readonly negatif: boolean;
  readonly bulat: bigint;
  /** Digit di belakang koma, apa adanya. String kosong berarti tanpa pecahan. */
  readonly pecahan: string;
}
