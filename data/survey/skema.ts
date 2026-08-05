/**
 * Bentuk data survei. Setiap klaim membawa versi paket dan tanggal
 * pengukuran, supaya klaimnya tetap dapat diperiksa dan menua dengan jujur.
 */

export interface PaketTerekam {
  readonly nama: string;
  readonly versi: string;
  readonly ekosistem: 'npm' | 'packagist';
  /** Bentuk ekspor yang berhasil dipakai, dicatat apa adanya. */
  readonly bentuk: string;
  /** Terisi bila paket gagal dipasang atau tidak bisa dipanggil. */
  readonly gagal?: string;
}

export interface BarisHasil {
  readonly paket: string;
  readonly masukan: string;
  /** Keluaran apa adanya, tanpa dirapikan. */
  readonly keluaran: string | null;
  /** Pesan galat bila paket melempar. */
  readonly galat: string | null;
}

export interface RekamanSurvei {
  /** Tanggal pengukuran, ISO 8601. `null` berarti belum pernah direkam. */
  readonly direkamPada: string | null;
  readonly runtime: string | null;
  readonly paket: readonly PaketTerekam[];
  readonly hasil: readonly BarisHasil[];
}

export const REKAMAN_KOSONG: RekamanSurvei = {
  direkamPada: null,
  runtime: null,
  paket: [],
  hasil: [],
};
