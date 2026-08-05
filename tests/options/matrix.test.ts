/**
 * Matriks opsi. Setiap kombinasi harus bolak-balik terhadap dirinya sendiri:
 * parse wajib menerima apa pun yang format hasilkan pada opsi yang sama.
 */

import { describe, expect, it } from 'vitest';
import { format, parse, type Options } from '@/lib';

const SEJUTA: Options['sejuta'][] = [false, true];
const EJAAN: Options['ejaanMiliar'][] = ['baku', 'varian'];
const MATA_UANG: Options['mataUang'][] = ['tidak', 'rupiah'];
const SEN: Options['sen'][] = ['koma', 'sen'];
const KAPITAL: Options['kapitalisasi'][] = ['tidak', 'kalimat', 'judul'];

const BULAT = [
  0n,
  1n,
  11n,
  1_500n,
  1_000_000n,
  1_000_000_001n,
  10n ** 12n + 345n,
  10n ** 15n + 1n,
];

const PECAHAN = ['1,25', '0,05', '1500,50'];

function kombinasi(): Options[] {
  const semua: Options[] = [];
  for (const sejuta of SEJUTA) {
    for (const ejaanMiliar of EJAAN) {
      for (const mataUang of MATA_UANG) {
        for (const sen of SEN) {
          for (const kapitalisasi of KAPITAL) {
            semua.push({ sejuta, ejaanMiliar, mataUang, sen, kapitalisasi });
          }
        }
      }
    }
  }
  return semua;
}

describe('matriks opsi', () => {
  it('mencakup seluruh kombinasi', () => {
    expect(kombinasi()).toHaveLength(48);
  });

  for (const opsi of kombinasi()) {
    const nama = `sejuta=${opsi.sejuta} ejaan=${opsi.ejaanMiliar} uang=${opsi.mataUang} sen=${opsi.sen} kapital=${opsi.kapitalisasi}`;

    it(`bilangan bulat bolak-balik — ${nama}`, () => {
      for (const n of BULAT) {
        const hasil = format(n, opsi);
        expect(hasil.type, `format(${n})`).toBe('ok');
        if (hasil.type !== 'ok') continue;

        const balik = parse(hasil.nilai, opsi);
        expect(balik.type, `parse("${hasil.nilai}")`).toBe('ok');
        if (balik.type === 'ok') expect(balik.nilai.bulat, hasil.nilai).toBe(n);
      }
    });

    it(`pecahan bolak-balik — ${nama}`, () => {
      const senTanpaMataUang = opsi.sen === 'sen' && opsi.mataUang !== 'rupiah';

      for (const p of PECAHAN) {
        const hasil = format(p, opsi);

        if (senTanpaMataUang) {
          // Menolak, bukan diam-diam jatuh ke mode koma.
          expect(hasil.type, `format("${p}")`).toBe('galat');
          if (hasil.type === 'galat') expect(hasil.galat.type).toBe('opsi-bertentangan');
          continue;
        }

        expect(hasil.type, `format("${p}")`).toBe('ok');
        if (hasil.type !== 'ok') continue;

        const balik = parse(hasil.nilai, opsi);
        expect(balik.type, `parse("${hasil.nilai}")`).toBe('ok');
        if (balik.type !== 'ok') continue;

        const [bulat = '', pecahan = ''] = p.split(',');
        expect(balik.nilai.bulat, hasil.nilai).toBe(BigInt(bulat));
        expect(balik.nilai.pecahan, hasil.nilai).toBe(pecahan);
      }
    });
  }
});

describe('varian terlihat pada keluaran', () => {
  it('sejuta hanya berlaku untuk satu juta, bukan untuk miliar', () => {
    const juta = format(1_000_000n, { sejuta: true });
    const miliar = format(1_000_000_000n, { sejuta: true });
    expect(juta.type === 'ok' && juta.nilai).toBe('sejuta');
    expect(miliar.type === 'ok' && miliar.nilai).toBe('satu miliar');
  });

  it('ejaan varian memakai milyar dan trilyun', () => {
    const a = format(2_000_000_000n, { ejaanMiliar: 'varian' });
    const b = format(2n * 10n ** 12n, { ejaanMiliar: 'varian' });
    expect(a.type === 'ok' && a.nilai).toBe('dua milyar');
    expect(b.type === 'ok' && b.nilai).toBe('dua trilyun');
  });

  it('mode sen membaca perseratusan sebagai sen', () => {
    const hasil = format('1500,25', { mataUang: 'rupiah', sen: 'sen' });
    expect(hasil.type === 'ok' && hasil.nilai).toBe(
      'seribu lima ratus rupiah dua puluh lima sen',
    );
  });

  it('mode sen menolak lebih dari dua digit, tidak membulatkan', () => {
    const hasil = format('1,255', { mataUang: 'rupiah', sen: 'sen' });
    expect(hasil.type).toBe('galat');
    if (hasil.type === 'galat') expect(hasil.galat.type).toBe('pecahan-terlalu-panjang');
  });

  it('kapitalisasi judul untuk akta', () => {
    const hasil = format(1_500n, { mataUang: 'rupiah', kapitalisasi: 'judul' });
    expect(hasil.type === 'ok' && hasil.nilai).toBe('Seribu Lima Ratus Rupiah');
  });

  it('kapitalisasi kalimat untuk kuitansi', () => {
    const hasil = format(1_500n, { mataUang: 'rupiah', kapitalisasi: 'kalimat' });
    expect(hasil.type === 'ok' && hasil.nilai).toBe('Seribu lima ratus rupiah');
  });
});
