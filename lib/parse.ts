/**
 * Kata → BigInt.
 *
 * Bagian yang sulit adalah lingkup pengali: "dua ratus lima puluh ribu" adalah
 * (2×100 + 5×10) × 1000, bukan 200 + 50.000. Karena itu setiap kelompok tiga
 * angka dibaca ke dalam slot ratusan/puluhan/satuan yang eksplisit, lalu
 * seluruh kelompok dikalikan skalanya sekaligus.
 *
 * Tata bahasa yang diterima adalah gabungan keluaran seluruh opsi: pembaca
 * manusia menulis "milyar" walau format menghasilkan "miliar", dan menerima
 * ejaan varian tidak pernah mengubah nilai. `opsi` tetap diterima agar
 * pemanggil dapat meneruskan objek yang sama ke kedua arah.
 */

import {
  kataTidakDikenal,
  masukanKosong,
  skalaTanpaKuantitas,
  susunanTidakSah,
  urutanSkalaSalah,
} from './errors';
import type { Options } from './options';
import { galat, ok, type Hasil, type InfoSkala, type Terurai } from './types';
import {
  BELAS,
  KOMA,
  MINUS,
  PULUH,
  RATUS,
  RUPIAH,
  SATUAN,
  SEBELAS,
  SEJUTA,
  SEN,
  SEPULUH,
  SERATUS,
  SERIBU,
  SKALA,
} from './words';

const NILAI_SATUAN = new Map<string, bigint>(
  SATUAN.map((kata, i) => [kata, BigInt(i)] as const),
);

/** Kata skala → indeks di SKALA, mencakup ejaan baku dan varian. */
const PERINGKAT_SKALA = new Map<string, number>();
SKALA.forEach((s, i) => {
  if (s.baku) PERINGKAT_SKALA.set(s.baku, i);
  if (s.varian) PERINGKAT_SKALA.set(s.varian, i);
});

function skalaKe(peringkat: number): InfoSkala | undefined {
  return SKALA[peringkat];
}

export function parse(kata: string, opsi?: Partial<Options>): Hasil<Terurai> {
  void opsi;

  const bersih = kata.trim().toLowerCase().split(/\s+/).join(' ');
  if (bersih === '') return galat(masukanKosong());

  let token = bersih.split(' ');
  let awal = 0;

  const negatif = token[0] === MINUS;
  if (negatif) {
    token = token.slice(1);
    awal = 1;
    if (token.length === 0) return galat(masukanKosong());
  }

  const terakhir = token[token.length - 1];

  // Bentuk sen: <bulat> rupiah <sen> sen
  if (terakhir === SEN) {
    const iRupiah = token.indexOf(RUPIAH);
    if (iRupiah === -1) {
      return galat(susunanTidakSah(SEN, awal + token.length - 1));
    }

    const bulat = bacaBilangan(token.slice(0, iRupiah), awal);
    if (bulat.type !== 'ok') return galat(bulat.galat);

    const nilaiSen = bacaBilangan(token.slice(iRupiah + 1, token.length - 1), awal + iRupiah + 1);
    if (nilaiSen.type !== 'ok') return galat(nilaiSen.galat);
    if (nilaiSen.nilai >= 100n) {
      return galat(susunanTidakSah(SEN, awal + token.length - 1));
    }

    return ok({
      negatif,
      bulat: bulat.nilai,
      pecahan: nilaiSen.nilai.toString().padStart(2, '0'),
    });
  }

  // Bentuk koma: digit di belakang koma dibaca satu per satu.
  const iKoma = token.indexOf(KOMA);
  if (iKoma !== -1) {
    const bulat = bacaBilangan(token.slice(0, iKoma), awal);
    if (bulat.type !== 'ok') return galat(bulat.galat);

    let digit = token.slice(iKoma + 1);
    if (digit[digit.length - 1] === RUPIAH) digit = digit.slice(0, -1);
    if (digit.length === 0) return galat(susunanTidakSah(KOMA, awal + iKoma));

    let pecahan = '';
    for (let i = 0; i < digit.length; i += 1) {
      const d = digit[i];
      const nilai = d === undefined ? undefined : NILAI_SATUAN.get(d);
      if (d === undefined || nilai === undefined) {
        return galat(kataTidakDikenal(d ?? '', awal + iKoma + 1 + i));
      }
      pecahan += nilai.toString();
    }

    return ok({ negatif, bulat: bulat.nilai, pecahan });
  }

  const tanpaMataUang = terakhir === RUPIAH ? token.slice(0, -1) : token;
  const bulat = bacaBilangan(tanpaMataUang, awal);
  if (bulat.type !== 'ok') return galat(bulat.galat);

  return ok({ negatif, bulat: bulat.nilai, pecahan: '' });
}

/** Slot satu kelompok tiga angka. `null` berarti belum terisi. */
interface Slot {
  ratusan: bigint | null;
  puluhan: bigint | null;
  satuan: bigint | null;
  /** Satuan yang sudah dibaca tetapi belum diketahui perannya. */
  tertunda: bigint | null;
}

function slotKosong(): Slot {
  return { ratusan: null, puluhan: null, satuan: null, tertunda: null };
}

function slotBersih(s: Slot): boolean {
  return s.ratusan === null && s.puluhan === null && s.satuan === null && s.tertunda === null;
}

function nilaiSlot(s: Slot): bigint {
  return (s.ratusan ?? 0n) + (s.puluhan ?? 0n) + (s.satuan ?? s.tertunda ?? 0n);
}

function bacaBilangan(token: readonly string[], awal: number): Hasil<bigint> {
  if (token.length === 0) return galat(masukanKosong());

  if (token.length === 1 && token[0] === SATUAN[0]) return ok(0n);

  let total = 0n;
  let slot = slotKosong();
  let peringkatTerakhir = SKALA.length;

  for (let i = 0; i < token.length; i += 1) {
    const t = token[i];
    if (t === undefined) continue;
    const pos = awal + i;

    // Bentuk lebur yang sekaligus membawa skalanya sendiri.
    if (t === SERIBU || t === SEJUTA) {
      if (!slotBersih(slot)) return galat(susunanTidakSah(t, pos));
      const peringkat = t === SERIBU ? 1 : 2;
      if (peringkat >= peringkatTerakhir) return galat(urutanSkalaSalah(t, pos));
      const skala = skalaKe(peringkat);
      if (skala === undefined) return galat(kataTidakDikenal(t, pos));
      total += skala.nilai;
      peringkatTerakhir = peringkat;
      slot = slotKosong();
      continue;
    }

    const peringkat = PERINGKAT_SKALA.get(t);
    if (peringkat !== undefined) {
      const nilai = nilaiSlot(slot);
      if (nilai === 0n) return galat(skalaTanpaKuantitas(t, pos));
      if (peringkat >= peringkatTerakhir) return galat(urutanSkalaSalah(t, pos));
      const skala = skalaKe(peringkat);
      if (skala === undefined) return galat(kataTidakDikenal(t, pos));
      total += nilai * skala.nilai;
      peringkatTerakhir = peringkat;
      slot = slotKosong();
      continue;
    }

    switch (t) {
      case SERATUS: {
        if (slot.ratusan !== null || slot.tertunda !== null || slot.puluhan !== null) {
          return galat(susunanTidakSah(t, pos));
        }
        slot.ratusan = 100n;
        continue;
      }
      case RATUS: {
        // Pengali mengikat satuan di depannya: "dua ratus" = 2×100.
        if (slot.tertunda === null || slot.ratusan !== null || slot.puluhan !== null) {
          return galat(susunanTidakSah(t, pos));
        }
        if (slot.tertunda === 1n) return galat(susunanTidakSah(t, pos)); // seratus, bukan satu ratus
        slot.ratusan = slot.tertunda * 100n;
        slot.tertunda = null;
        continue;
      }
      case SEPULUH: {
        if (slot.tertunda !== null || slot.puluhan !== null || slot.satuan !== null) {
          return galat(susunanTidakSah(t, pos));
        }
        slot.puluhan = 10n;
        slot.satuan = 0n; // sepuluh tidak menerima satuan di belakangnya
        continue;
      }
      case SEBELAS: {
        if (slot.tertunda !== null || slot.puluhan !== null || slot.satuan !== null) {
          return galat(susunanTidakSah(t, pos));
        }
        slot.puluhan = 10n;
        slot.satuan = 1n;
        continue;
      }
      case PULUH: {
        if (slot.tertunda === null || slot.puluhan !== null || slot.satuan !== null) {
          return galat(susunanTidakSah(t, pos));
        }
        if (slot.tertunda === 1n) return galat(susunanTidakSah(t, pos)); // sepuluh, bukan satu puluh
        slot.puluhan = slot.tertunda * 10n;
        slot.tertunda = null;
        continue;
      }
      case BELAS: {
        if (slot.tertunda === null || slot.puluhan !== null || slot.satuan !== null) {
          return galat(susunanTidakSah(t, pos));
        }
        if (slot.tertunda === 1n) return galat(susunanTidakSah(t, pos)); // sebelas, bukan satu belas
        slot.puluhan = 10n;
        slot.satuan = slot.tertunda;
        slot.tertunda = null;
        continue;
      }
      default:
        break;
    }

    const satuan = NILAI_SATUAN.get(t);
    if (satuan === undefined) return galat(kataTidakDikenal(t, pos));
    if (satuan === 0n) return galat(susunanTidakSah(t, pos)); // "nol" hanya berdiri sendiri
    if (slot.tertunda !== null || slot.satuan !== null) return galat(susunanTidakSah(t, pos));
    slot.tertunda = satuan;
  }

  return ok(total + nilaiSlot(slot));
}
