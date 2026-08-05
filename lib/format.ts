/**
 * BigInt → kata.
 *
 * Tidak dioptimalkan dengan sengaja. Domainnya terbatas dan fungsinya berjalan
 * dalam mikrodetik; kejelasan lebih berharga daripada kepintaran, dan trik
 * pengelompokan yang pintar justru cara bug kelompok kosong kembali masuk.
 */

import {
  bukanBilangan,
  diLuarJangkauan,
  masukanKosong,
  opsiBertentangan,
  pecahanTerlaluPanjang,
  tipeTidakDidukung,
} from './errors';
import { kelompokkan, kelompokTerpakai } from './groups';
import { lengkapiOpsi, type Options } from './options';
import { galat, ok, type Hasil, type InfoSkala, type Kelompok, type Terurai } from './types';
import {
  BATAS_ATAS,
  BATAS_ATAS_TERBACA,
  BELAS,
  KOMA,
  kataSatuan,
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
} from './words';

/**
 * Digit dengan pemisah ribuan opsional dan satu koma desimal opsional.
 * Pemisah ribuan hanya diterima bila pengelompokannya benar — diterima, bukan
 * ditebak.
 */
const DIGIT_POLOS = /^-?\d+(,\d+)?$/;
const DIGIT_BERTITIK = /^-?\d{1,3}(\.\d{3})+(,\d+)?$/;

/**
 * Bentuk bilangan menjadi kata.
 *
 * Menerima `bigint` atau string digit. `number` ditolak pada tipe maupun pada
 * saat jalan: presisinya hilang di atas 2^53, tepat di atas triliun, dan
 * kegagalan itu tidak terlihat sampai muncul di faktur yang tercetak.
 */
export function format(nilai: bigint | string, opsi?: Partial<Options>): Hasil<string> {
  const o = lengkapiOpsi(opsi);

  const terurai = uraiMasukan(nilai);
  if (terurai.type !== 'ok') return galat(terurai.galat);

  const { negatif, bulat, pecahan } = terurai.nilai;

  if (bulat >= BATAS_ATAS) return galat(diLuarJangkauan(BATAS_ATAS_TERBACA));

  const bagian: string[] = [];
  if (negatif) bagian.push(MINUS);
  bagian.push(kataBulat(bulat, o));

  if (pecahan === '') {
    if (o.mataUang === 'rupiah') bagian.push(RUPIAH);
    return ok(kapitalkan(bagian.join(' '), o));
  }

  if (o.sen === 'sen') {
    if (o.mataUang !== 'rupiah') {
      return galat(
        opsiBertentangan(
          'sen',
          'Mode sen memerlukan mataUang: "rupiah"; sen adalah perseratusan rupiah.',
        ),
      );
    }
    if (pecahan.length > 2) return galat(pecahanTerlaluPanjang(pecahan));

    bagian.push(RUPIAH);
    bagian.push(kataBulat(BigInt(pecahan.padEnd(2, '0')), o));
    bagian.push(SEN);
    return ok(kapitalkan(bagian.join(' '), o));
  }

  // Koma dibaca "koma", digitnya dibaca satu per satu: 1,25 adalah
  // "satu koma dua lima", bukan "satu koma dua puluh lima" (PUEBI/EYD).
  bagian.push(KOMA);
  for (const digit of pecahan) bagian.push(kataSatuan(BigInt(digit)));
  if (o.mataUang === 'rupiah') bagian.push(RUPIAH);

  return ok(kapitalkan(bagian.join(' '), o));
}

/** Normalisasi masukan menjadi tanda, bagian bulat, dan digit pecahan. */
function uraiMasukan(nilai: bigint | string): Hasil<Terurai> {
  if (typeof nilai === 'bigint') {
    const negatif = nilai < 0n;
    return ok({ negatif, bulat: negatif ? -nilai : nilai, pecahan: '' });
  }

  if (typeof nilai !== 'string') {
    return galat(tipeTidakDidukung(typeof nilai));
  }

  const teks = nilai.trim();
  if (teks === '') return galat(masukanKosong());

  if (!DIGIT_POLOS.test(teks) && !DIGIT_BERTITIK.test(teks)) {
    return galat(bukanBilangan(nilai));
  }

  const negatif = teks.startsWith('-');
  const tanpaTanda = negatif ? teks.slice(1) : teks;
  const [bagianBulat = '', bagianPecahan = ''] = tanpaTanda.split(',');

  return ok({
    negatif,
    bulat: BigInt(bagianBulat.split('.').join('')),
    pecahan: bagianPecahan,
  });
}

function kataBulat(bulat: bigint, o: Options): string {
  if (bulat === 0n) return SATUAN[0];

  // Kelompok bernilai nol tidak menghasilkan kata sama sekali: 1.000.001
  // adalah "satu juta satu", bukan "satu juta nol ribu satu".
  return kelompokTerpakai(kelompokkan(bulat))
    .map((k) => kataKelompokBerskala(k, o))
    .join(' ');
}

function kataKelompokBerskala(kelompok: Kelompok, o: Options): string {
  const { nilai, skala } = kelompok;
  if (skala.nama === 'satuan') return kataKelompok(nilai);

  const kata = kataSkala(skala, o);

  if (nilai === 1n) {
    // Peleburan se- bersifat leksikal, bukan aritmetis: seribu, tetapi
    // satu juta — kecuali opsi sejuta dipilih, dan itu hanya berlaku pada juta.
    if (skala.nama === 'ribu') return SERIBU;
    if (skala.nama === 'juta' && o.sejuta) return SEJUTA;
    return `${SATUAN[1]} ${kata}`;
  }

  return `${kataKelompok(nilai)} ${kata}`;
}

function kataSkala(skala: InfoSkala, o: Options): string {
  return o.ejaanMiliar === 'baku' ? skala.baku : skala.varian;
}

/** Satu kelompok 1..999 menjadi kata. Kelompok bernilai 0 tidak sampai ke sini. */
function kataKelompok(nilai: bigint): string {
  const bagian: string[] = [];

  const ratusan = nilai / 100n;
  const sisa = nilai % 100n;

  if (ratusan === 1n) bagian.push(SERATUS);
  else if (ratusan > 1n) bagian.push(kataSatuan(ratusan), RATUS);

  if (sisa === 0n) return bagian.join(' ');

  if (sisa < 10n) {
    bagian.push(kataSatuan(sisa));
  } else if (sisa === 10n) {
    bagian.push(SEPULUH);
  } else if (sisa === 11n) {
    bagian.push(SEBELAS);
  } else if (sisa < 20n) {
    bagian.push(kataSatuan(sisa - 10n), BELAS);
  } else {
    bagian.push(kataSatuan(sisa / 10n), PULUH);
    const satuan = sisa % 10n;
    if (satuan > 0n) bagian.push(kataSatuan(satuan));
  }

  return bagian.join(' ');
}

function kapitalkan(kata: string, o: Options): string {
  switch (o.kapitalisasi) {
    case 'tidak':
      return kata;
    case 'kalimat':
      return kata.charAt(0).toUpperCase() + kata.slice(1);
    case 'judul':
      return kata
        .split(' ')
        .map((k) => k.charAt(0).toUpperCase() + k.slice(1))
        .join(' ');
    default: {
      const tak: never = o.kapitalisasi;
      return tak;
    }
  }
}
