/**
 * Kata → BigInt.
 *
 * M0: rangka. Arah balik inilah yang membuat uji bolak-balik mungkin, jadi ia
 * ditulis setelah harness ada, bukan sebelumnya.
 */

import { galat, type Hasil, type Terurai } from './types';
import { masukanKosong } from './errors';
import type { Options } from './options';

export function parse(_kata: string, _opsi?: Partial<Options>): Hasil<Terurai> {
  return galat(masukanKosong());
}
