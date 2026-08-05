/**
 * Batas presisi. Bilangan JavaScript kehilangan ketepatan di atas 2^53 ≈ 9×10^15,
 * yaitu tepat di atas triliun — sehingga implementasi berbasis `number` benar
 * sampai triliun lalu salah diam-diam setelahnya. Ini uji permanen, bukan
 * pemeriksaan sekali jalan.
 */

import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { format, parse } from '@/lib';

const DUA_PANGKAT_53 = 2n ** 53n; // 9.007.199.254.740.992

function kata(n: bigint): string {
  const hasil = format(n);
  if (hasil.type !== 'ok') throw new Error(`format menolak ${n}: ${hasil.galat.pesan}`);
  return hasil.nilai;
}

describe('di atas 2^53', () => {
  it('2^53 dan 2^53+1 menghasilkan kata yang berbeda', () => {
    expect(kata(DUA_PANGKAT_53)).not.toBe(kata(DUA_PANGKAT_53 + 1n));
  });

  it('2^53+1 bolak-balik utuh — nilai yang hilang pada implementasi `number`', () => {
    const n = DUA_PANGKAT_53 + 1n;
    const balik = parse(kata(n));
    expect(balik.type).toBe('ok');
    if (balik.type === 'ok') expect(balik.nilai.bulat).toBe(n);
  });

  it('string digit panjang tidak melewati pembulatan biner', () => {
    const teks = '123456789012345678';
    const balik = parse(kata(BigInt(teks)));
    expect(balik.type).toBe('ok');
    if (balik.type === 'ok') expect(balik.nilai.bulat.toString()).toBe(teks);
  });

  it('nilai terbesar yang didukung utuh', () => {
    const n = 10n ** 18n - 1n;
    const balik = parse(kata(n));
    expect(balik.type).toBe('ok');
    if (balik.type === 'ok') expect(balik.nilai.bulat).toBe(n);
  });

  it('satu di atas batas ditolak, bukan dipangkas', () => {
    const hasil = format(10n ** 18n);
    expect(hasil.type).toBe('galat');
    if (hasil.type === 'galat') expect(hasil.galat.type).toBe('di-luar-jangkauan');
  });

  it('menolak `number` meski nilainya kecil dan aman', () => {
    // @ts-expect-error — pintu ditutup pada tipe, bukan pada besarnya nilai
    const hasil = format(12);
    expect(hasil.type).toBe('galat');
  });

  it('menolak string bukan bilangan bulat', () => {
    expect(format('1e3').type).toBe('galat');
    expect(format('1,5,5').type).toBe('galat');
    expect(format(' ').type).toBe('galat');
  });
});

describe('audit sumber lib/', () => {
  const berkas = readdirSync('lib')
    .filter((f) => f.endsWith('.ts'))
    .map((f) => [f, readFileSync(join('lib', f), 'utf8')] as const);

  it('tidak ada berkas lib yang hilang dari audit', () => {
    expect(berkas.length).toBeGreaterThan(5);
  });

  /** Baris komentar dibuang: yang diaudit adalah kode, bukan penjelasannya. */
  function kodeSaja(isi: string): string {
    return isi
      .split('\n')
      .filter((b) => {
        const t = b.trimStart();
        return !t.startsWith('*') && !t.startsWith('//') && !t.startsWith('/*');
      })
      .join('\n');
  }

  for (const [nama, isi] of berkas) {
    const kode = kodeSaja(isi);

    it(`${nama} tidak memakai jalur aritmetika \`number\``, () => {
      expect(kode).not.toMatch(/\bNumber\s*\(/);
      expect(kode).not.toMatch(/\bparseInt\b/);
      expect(kode).not.toMatch(/\bparseFloat\b/);
      expect(kode).not.toMatch(/\bMath\./);
    });

    it(`${nama} tidak terikat lingkungan`, () => {
      expect(kode).not.toMatch(/\bfrom ['"](?!\.)/); // hanya impor relatif di dalam lib/
      expect(kode).not.toMatch(/\bdocument\b|\bwindow\b|\bprocess\b/);
      expect(kode).not.toMatch(/\bnew Date\b|\bDate\.now\b|\bIntl\b/);
    });

    it(`${nama} tidak memakai penegasan non-null`, () => {
      expect(kode).not.toMatch(/[A-Za-z\]) ]!\./);
      expect(kode).not.toMatch(/\]!\s*[,;)]/);
    });
  }
});
