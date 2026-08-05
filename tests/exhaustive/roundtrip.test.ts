/**
 * Sapuan menyeluruh 0..1.000.000.
 *
 * Setiap nilai dibentuk menjadi kata, diperiksa strukturnya, lalu dibaca
 * kembali dan harus menghasilkan nilai semula. Tidak disampel, tidak dilewati,
 * tidak ditandai lambat. Domainnya terbatas dan fungsinya murni, jadi
 * verifikasi lengkap memang bisa dilakukan — itu sebabnya proyek ini ada.
 *
 * Kegagalan dilaporkan sebagai kegagalan pertama, bukan sejuta pernyataan
 * expect(), supaya sapuan tetap selesai dalam hitungan detik.
 */

import { describe, expect, it } from 'vitest';
import { format, parse } from '@/lib';
import { pelanggaranStruktur } from '../struktur';

const BATAS = 1_000_000n;

interface Kegagalan {
  nilai: string;
  sebab: string;
  kata?: string;
}

function sapu(): Kegagalan[] {
  const gagal: Kegagalan[] = [];

  for (let n = 0n; n <= BATAS; n += 1n) {
    const hasil = format(n);
    if (hasil.type !== 'ok') {
      gagal.push({ nilai: n.toString(), sebab: `format menolak: ${hasil.galat.type}` });
      if (gagal.length >= 5) return gagal;
      continue;
    }

    const kata = hasil.nilai;

    const salah = pelanggaranStruktur(kata, n);
    if (salah.length > 0) {
      gagal.push({ nilai: n.toString(), kata, sebab: salah.join('; ') });
      if (gagal.length >= 5) return gagal;
      continue;
    }

    const balik = parse(kata);
    if (balik.type !== 'ok') {
      gagal.push({ nilai: n.toString(), kata, sebab: `parse menolak: ${balik.galat.type}` });
      if (gagal.length >= 5) return gagal;
      continue;
    }

    if (balik.nilai.bulat !== n || balik.nilai.negatif || balik.nilai.pecahan !== '') {
      gagal.push({
        nilai: n.toString(),
        kata,
        sebab: `bolak-balik menghasilkan ${balik.nilai.negatif ? '-' : ''}${balik.nilai.bulat}`,
      });
      if (gagal.length >= 5) return gagal;
    }
  }

  return gagal;
}

describe('sapuan menyeluruh 0..1.000.000', () => {
  it('bolak-balik dan struktur benar untuk setiap nilai', () => {
    expect(sapu()).toEqual([]);
  });
});
