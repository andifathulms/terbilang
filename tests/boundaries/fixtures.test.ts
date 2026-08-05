/**
 * Fixture batas, bernama dan permanen. Di sinilah implementasi terbilang
 * biasanya mati; setiap baris punya alasan berada di daftar ini.
 */

import { describe, expect, it } from 'vitest';
import { format, parse } from '@/lib';

function kata(n: bigint | string): string {
  const hasil = format(n);
  if (hasil.type !== 'ok') throw new Error(`format menolak ${n}: ${hasil.galat.pesan}`);
  return hasil.nilai;
}

const FIXTURE: ReadonlyArray<readonly [bigint, string, string]> = [
  [0n, 'nol', 'nol berdiri sendiri'],
  [1n, 'satu', ''],
  [2n, 'dua', ''],
  [9n, 'sembilan', ''],
  [10n, 'sepuluh', 'peleburan se-, bukan "satu puluh"'],
  [11n, 'sebelas', 'peleburan se-, bukan "satu belas"'],
  [12n, 'dua belas', 'belasan tidak turun dari pola puluhan'],
  [19n, 'sembilan belas', ''],
  [20n, 'dua puluh', ''],
  [21n, 'dua puluh satu', ''],
  [99n, 'sembilan puluh sembilan', ''],
  [100n, 'seratus', 'peleburan se-, bukan "satu ratus"'],
  [101n, 'seratus satu', ''],
  [110n, 'seratus sepuluh', ''],
  [111n, 'seratus sebelas', ''],
  [999n, 'sembilan ratus sembilan puluh sembilan', ''],
  [1_000n, 'seribu', 'peleburan se-, bukan "satu ribu"'],
  [1_001n, 'seribu satu', 'kelompok ratusan kosong tidak menghasilkan kata'],
  [1_100n, 'seribu seratus', ''],
  [1_500n, 'seribu lima ratus', 'contoh kuitansi yang paling sering dipakai'],
  [2_000n, 'dua ribu', ''],
  [10_000n, 'sepuluh ribu', ''],
  [11_000n, 'sebelas ribu', ''],
  [100_000n, 'seratus ribu', ''],
  [101_000n, 'seratus satu ribu', ''],
  [1_000_000n, 'satu juta', 'bukan "sejuta" pada opsi bawaan'],
  [1_000_001n, 'satu juta satu', 'kelompok 000 tidak menghasilkan kata sama sekali'],
  [1_000_100n, 'satu juta seratus', ''],
  [1_234_567n, 'satu juta dua ratus tiga puluh empat ribu lima ratus enam puluh tujuh', ''],
  [1_000_000_000n, 'satu miliar', ''],
  [1_000_000_001n, 'satu miliar satu', 'dua kelompok kosong berturut-turut'],
  [10n ** 12n, 'satu triliun', 'batas triliun'],
  [
    10n ** 12n + 1n,
    'satu triliun satu',
    'tiga kelompok kosong berturut-turut',
  ],
  [10n ** 15n, 'satu kuadriliun', 'skala tertinggi yang masih dapat disitasi'],
];

describe('fixture batas', () => {
  for (const [nilai, harapan, alasan] of FIXTURE) {
    const nama = alasan ? `${nilai} → ${harapan} (${alasan})` : `${nilai} → ${harapan}`;
    it(nama, () => {
      expect(kata(nilai)).toBe(harapan);
    });
  }

  it('setiap fixture terbaca kembali ke nilai semula', () => {
    for (const [nilai, harapan] of FIXTURE) {
      const balik = parse(harapan);
      expect(balik.type, `parse("${harapan}")`).toBe('ok');
      if (balik.type === 'ok') expect(balik.nilai.bulat, `parse("${harapan}")`).toBe(nilai);
    }
  });
});

describe('negatif dan desimal', () => {
  it('-1 → minus satu', () => {
    expect(kata(-1n)).toBe('minus satu');
  });

  it('1,25 dibaca digit per digit, bukan sebagai puluhan', () => {
    expect(kata('1,25')).toBe('satu koma dua lima');
  });

  it('0,05 mempertahankan nol di depan', () => {
    expect(kata('0,05')).toBe('nol koma nol lima');
  });
});

describe('lingkup pengali pada arah balik', () => {
  it('dua ratus lima puluh ribu = (2×100 + 5×10) × 1000', () => {
    const balik = parse('dua ratus lima puluh ribu');
    expect(balik.type).toBe('ok');
    if (balik.type === 'ok') expect(balik.nilai.bulat).toBe(250_000n);
  });

  it('dua ratus lima puluh ribu bukan 200 + 50.000', () => {
    const balik = parse('dua ratus lima puluh ribu');
    if (balik.type === 'ok') expect(balik.nilai.bulat).not.toBe(50_200n);
  });

  it('seratus dua puluh tiga juta empat ratus lima puluh enam ribu tujuh ratus delapan puluh sembilan', () => {
    const balik = parse(
      'seratus dua puluh tiga juta empat ratus lima puluh enam ribu tujuh ratus delapan puluh sembilan',
    );
    expect(balik.type).toBe('ok');
    if (balik.type === 'ok') expect(balik.nilai.bulat).toBe(123_456_789n);
  });
});

describe('menolak, bukan menebak', () => {
  it('menolak `number`', () => {
    // @ts-expect-error — number memang tidak boleh diterima
    const hasil = format(1000);
    expect(hasil.type).toBe('galat');
    if (hasil.type === 'galat') expect(hasil.galat.type).toBe('tipe-tidak-didukung');
  });

  it('menolak nilai di atas skala tersitasi', () => {
    const hasil = format(10n ** 18n);
    expect(hasil.type).toBe('galat');
    if (hasil.type === 'galat') expect(hasil.galat.type).toBe('di-luar-jangkauan');
  });

  it('menolak masukan bukan bilangan', () => {
    const hasil = format('seribu');
    expect(hasil.type).toBe('galat');
    if (hasil.type === 'galat') expect(hasil.galat.type).toBe('bukan-bilangan');
  });

  it('menolak kata yang tidak dikenal, menyebut kata dan posisinya', () => {
    const hasil = parse('seribu limaratus');
    expect(hasil.type).toBe('galat');
    if (hasil.type === 'galat') {
      expect(hasil.galat.type).toBe('kata-tidak-dikenal');
      if (hasil.galat.type === 'kata-tidak-dikenal') {
        expect(hasil.galat.kata).toBe('limaratus');
        expect(hasil.galat.posisi).toBe(1);
      }
    }
  });

  it('menolak kata skala tanpa kuantitas', () => {
    const hasil = parse('ribu');
    expect(hasil.type).toBe('galat');
    if (hasil.type === 'galat') expect(hasil.galat.type).toBe('skala-tanpa-kuantitas');
  });

  it('menolak urutan skala yang tidak menurun', () => {
    const hasil = parse('seribu dua juta');
    expect(hasil.type).toBe('galat');
    if (hasil.type === 'galat') expect(hasil.galat.type).toBe('urutan-skala-salah');
  });

  it('menolak masukan kosong', () => {
    expect(parse('   ').type).toBe('galat');
    expect(format('').type).toBe('galat');
  });
});
