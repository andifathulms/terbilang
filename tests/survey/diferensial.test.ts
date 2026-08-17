/**
 * Survei sebagai uji diferensial.
 *
 * Skrip yang membuat tabel survei juga bertugas sebagai uji: setiap perbedaan
 * wajib punya klasifikasi tertulis. Selama belum ada rekaman, uji ini menjaga
 * bentuk datanya tetap benar dan menolak rekaman yang tidak dijelaskan.
 */

import { describe, expect, it } from 'vitest';
import { format } from '@/lib';
import rekamanJson from '../../data/survey/hasil.json';
import { BATERAI } from '../../data/survey/baterai';
import type { RekamanSurvei } from '../../data/survey/skema';
import { KLASIFIKASI, MODUS, kunci } from './klasifikasi';

const rekaman = rekamanJson as RekamanSurvei;

function kataKita(masukan: string): string | null {
  const hasil = format(masukan);
  return hasil.type === 'ok' ? hasil.nilai : null;
}

describe('rekaman survei', () => {
  it('setiap paket membawa versi dan tanggal pengukuran', () => {
    if (rekaman.paket.length === 0) {
      expect(rekaman.direkamPada).toBeNull();
      return;
    }

    expect(rekaman.direkamPada).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    for (const p of rekaman.paket) {
      expect(p.versi, p.nama).not.toBe('');
    }
  });

  it('setiap baris memakai masukan dari baterai', () => {
    for (const baris of rekaman.hasil) {
      expect(BATERAI, baris.masukan).toContain(baris.masukan);
    }
  });

  it('baterai kita sendiri seluruhnya dapat dibentuk atau ditolak secara terstruktur', () => {
    for (const masukan of BATERAI) {
      const hasil = format(masukan);
      if (hasil.type === 'galat') {
        expect(hasil.galat.type, masukan).toBe('di-luar-jangkauan');
      } else {
        expect(hasil.nilai.length, masukan).toBeGreaterThan(0);
      }
    }
  });

  it('setiap perbedaan punya klasifikasi tertulis', () => {
    const tercatat = new Set(KLASIFIKASI.map((k) => kunci(k.paket, k.masukan)));

    const tanpaPenjelasan = rekaman.hasil
      .filter((baris) => baris.keluaran !== null && baris.keluaran !== kataKita(baris.masukan))
      .filter((baris) => !tercatat.has(kunci(baris.paket, baris.masukan)))
      .map((baris) => `${baris.paket} @ ${baris.masukan}`);

    expect(tanpaPenjelasan).toEqual([]);
  });

  it('klasifikasi tidak menyimpan baris yang sudah tidak ada di rekaman', () => {
    const ada = new Set(rekaman.hasil.map((b) => kunci(b.paket, b.masukan)));
    const yatim = KLASIFIKASI.filter((k) => !ada.has(kunci(k.paket, k.masukan))).map(
      (k) => `${k.paket} @ ${k.masukan}`,
    );

    expect(yatim).toEqual([]);
  });

  it('setiap modus yang dipakai klasifikasi terdaftar di MODUS', () => {
    const tanpaEntri = KLASIFIKASI.filter((k) => MODUS[k.modus] === undefined).map(
      (k) => `${k.paket} @ ${k.masukan} -> ${k.modus}`,
    );

    expect(tanpaEntri).toEqual([]);
  });

  it('kelas setiap klasifikasi sama dengan kelas modusnya', () => {
    const tidakCocok = KLASIFIKASI.filter((k) => MODUS[k.modus]?.kelas !== k.kelas).map(
      (k) => `${k.paket} @ ${k.masukan}: ${k.kelas} != MODUS.${k.modus}.kelas`,
    );

    expect(tidakCocok).toEqual([]);
  });

  it('MODUS tidak menyimpan entri yang tidak dipakai klasifikasi mana pun', () => {
    const dipakai = new Set(KLASIFIKASI.map((k) => k.modus));
    const takTerpakai = Object.keys(MODUS).filter((m) => !dipakai.has(m));

    expect(takTerpakai).toEqual([]);
  });
});
