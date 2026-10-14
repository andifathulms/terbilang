/**
 * Varian dan bawaannya. Tidak ada bawaan diam-diam: setiap opsi menyertakan
 * dasar pemakaian untuk kedua sisinya di `SITASI_OPSI` (sitasi.ts), dan situs
 * menampilkan sitasi itu apa adanya.
 *
 * Kunci opsi ikut muncul di hash URL situs, jadi kunci tetap stabil.
 */

export interface Options {
  /** `sejuta` untuk 1.000.000, alih-alih bentuk baku `satu juta`. */
  readonly sejuta: boolean;
  /** Ejaan kata skala: KBBI (`miliar`, `triliun`) atau varian (`milyar`, `trilyun`). */
  readonly ejaanMiliar: 'baku' | 'varian';
  /** Imbuhan mata uang di akhir. */
  readonly mataUang: 'tidak' | 'rupiah';
  /** Perlakuan angka di belakang koma. */
  readonly sen: 'koma' | 'sen';
  /** Gaya kapitalisasi untuk keperluan dokumen. */
  readonly kapitalisasi: 'tidak' | 'kalimat' | 'judul';
}

export const OPSI_BAWAAN: Options = {
  sejuta: false,
  ejaanMiliar: 'baku',
  mataUang: 'tidak',
  sen: 'koma',
  kapitalisasi: 'tidak',
};

export function lengkapiOpsi(opsi?: Partial<Options>): Options {
  return { ...OPSI_BAWAAN, ...opsi };
}
