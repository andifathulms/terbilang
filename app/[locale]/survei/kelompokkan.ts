/**
 * Menyusun rekaman survei per ciri kegagalan, bukan per paket.
 *
 * Baterai dan rekaman menjawab "apa keluarannya"; klasifikasi menjawab
 * "kenapa itu penting". Modul ini hanya menggabungkan ketiganya — tidak ada
 * kata yang diubah menjadi angka atau sebaliknya di sini, itu tetap kerja
 * lib/. Lihat DESIGN-REWORK.md §1.2: sumbu tabel adalah bagian dari nada
 * faktualnya, bukan sekadar tata letak.
 */

import type { Lokal } from '../../kamus';
import type { RekamanSurvei } from '../../../data/survey/skema';
import { KLASIFIKASI, MODUS, type Kelas } from '../../../tests/survey/klasifikasi';

export interface ContohModus {
  readonly paket: string;
  readonly versi: string;
  readonly masukan: string;
  readonly kami: string;
  readonly keluaran: string | null;
  readonly galat: string | null;
  readonly catatan: string;
}

export interface KelompokModus {
  readonly kunci: string;
  readonly kelas: Kelas;
  readonly judul: string;
  readonly deskripsi: string;
  readonly contoh: readonly ContohModus[];
}

/** bug-kita didahulukan: kejujuran atas pustaka sendiri, sebelum apa pun soal paket lain. */
const URUTAN_KELAS: readonly Kelas[] = ['bug-kita', 'bug-mereka', 'varian-sah'];

export function kelompokkanModus(
  rekaman: RekamanSurvei,
  lokal: Lokal,
  kataKita: (masukan: string) => string,
): readonly KelompokModus[] {
  const versiPaket = new Map(rekaman.paket.map((p) => [p.nama, p.versi] as const));

  const contohPerModus = new Map<string, ContohModus[]>();
  for (const k of KLASIFIKASI) {
    const baris = rekaman.hasil.find((b) => b.paket === k.paket && b.masukan === k.masukan);
    if (baris === undefined) continue;

    const daftar = contohPerModus.get(k.modus) ?? [];
    daftar.push({
      paket: k.paket,
      versi: versiPaket.get(k.paket) ?? '?',
      masukan: k.masukan,
      kami: kataKita(k.masukan),
      keluaran: baris.keluaran,
      galat: baris.galat,
      catatan: k.catatan,
    });
    contohPerModus.set(k.modus, daftar);
  }

  return Object.entries(MODUS)
    .filter(([kunciModus]) => contohPerModus.has(kunciModus))
    .map(([kunciModus, info]) => ({
      kunci: kunciModus,
      kelas: info.kelas,
      judul: info.judul[lokal],
      deskripsi: info.deskripsi[lokal],
      contoh: contohPerModus.get(kunciModus) ?? [],
    }))
    .sort((a, b) => URUTAN_KELAS.indexOf(a.kelas) - URUTAN_KELAS.indexOf(b.kelas));
}

export type StatusBaris = 'sama' | 'beda' | 'menolak' | 'tak-terekam';

export function statusBaris(
  baris: { readonly keluaran: string | null; readonly galat: string | null } | undefined,
  kami: string,
): StatusBaris {
  if (baris === undefined) return 'tak-terekam';
  if (baris.galat !== null) return 'menolak';
  if (baris.keluaran === kami) return 'sama';
  return 'beda';
}
