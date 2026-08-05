/**
 * BigInt → kata.
 *
 * M0: rangka. Isi sebenarnya menyusul setelah harness menyeluruh terbukti
 * jalan di atas rangka ini.
 */

import { galat, ok, type Hasil } from './types';
import { masukanKosong } from './errors';
import type { Options } from './options';

export function format(
  _nilai: bigint | string,
  _opsi?: Partial<Options>,
): Hasil<string> {
  return galat(masukanKosong());
}

// Menahan `ok` tetap terpakai sampai implementasi masuk.
export const _rangka = ok;
