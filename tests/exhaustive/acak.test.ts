/**
 * Bolak-balik acak berbenih di atas satu juta, sampai batas magnitudo yang
 * didukung, ditambah tetangga setiap pangkat sepuluh — tempat implementasi
 * biasanya patah (kelompok kosong, peralihan skala).
 */

import { describe, expect, it } from 'vitest';
import { BATAS_ATAS, format, parse } from '@/lib';
import { acakBerbenih, bigintAcak, pelanggaranStruktur } from '../struktur';

function periksa(n: bigint): string | undefined {
  const hasil = format(n);
  if (hasil.type !== 'ok') return `format menolak ${n}: ${hasil.galat.type}`;

  const salah = pelanggaranStruktur(hasil.nilai, n);
  if (salah.length > 0) return `${n} → "${hasil.nilai}": ${salah.join('; ')}`;

  const balik = parse(hasil.nilai);
  if (balik.type !== 'ok') return `parse menolak "${hasil.nilai}": ${balik.galat.type}`;
  if (balik.nilai.bulat !== n) return `${n} → "${hasil.nilai}" → ${balik.nilai.bulat}`;

  return undefined;
}

describe('bolak-balik acak berbenih', () => {
  it('50.000 nilai acak sampai batas magnitudo', () => {
    const rng = acakBerbenih(20250805);
    const gagal: string[] = [];

    for (let i = 0; i < 50_000; i += 1) {
      const n = bigintAcak(rng, 18);
      if (n >= BATAS_ATAS) continue;
      const sebab = periksa(n);
      if (sebab) {
        gagal.push(sebab);
        if (gagal.length >= 5) break;
      }
    }

    expect(gagal).toEqual([]);
  });

  it('tetangga setiap pangkat sepuluh', () => {
    const gagal: string[] = [];

    for (let p = 0n; p < 18n; p += 1n) {
      const pangkat = 10n ** p;
      for (const delta of [-2n, -1n, 0n, 1n, 2n]) {
        const n = pangkat + delta;
        if (n < 0n || n >= BATAS_ATAS) continue;
        const sebab = periksa(n);
        if (sebab) gagal.push(sebab);
      }
    }

    expect(gagal).toEqual([]);
  });
});
