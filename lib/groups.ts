/**
 * Dekomposisi tiga angka. Pengelompokan inilah algoritmanya; situs
 * menggambarkannya persis dari fungsi ini.
 */

import type { Kelompok } from './types';
import { SKALA, SKALA_SATUAN } from './words';

/**
 * Pecah bilangan bulat non-negatif menjadi kelompok tiga angka, dari skala
 * terbesar ke terkecil. Kelompok bernilai nol tetap disertakan di sini —
 * penyaringannya urusan format.ts, supaya situs bisa menunjukkan kelompok
 * kosong runtuh menjadi tidak ada kata.
 *
 * Nilai nol menghasilkan satu kelompok satuan bernilai nol.
 */
export function kelompokkan(bulat: bigint): Kelompok[] {
  if (bulat === 0n) {
    return [{ nilai: 0n, skala: SKALA_SATUAN }];
  }

  const kelompok: Kelompok[] = [];
  let sisa = bulat;
  let indeks = 0;

  while (sisa > 0n && indeks < SKALA.length) {
    const skala = SKALA[indeks];
    if (skala === undefined) break;
    kelompok.unshift({ nilai: sisa % 1000n, skala });
    sisa /= 1000n;
    indeks += 1;
  }

  // Sisa yang tidak tertampung skala tersitasi tidak pernah sampai ke sini:
  // format.ts menolak nilai di atas BATAS_ATAS lebih dahulu.
  return kelompok;
}

/** Kelompok yang benar-benar menghasilkan kata. */
export function kelompokTerpakai(kelompok: readonly Kelompok[]): Kelompok[] {
  return kelompok.filter((k) => k.nilai !== 0n);
}
