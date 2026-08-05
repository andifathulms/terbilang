/**
 * Varian dan bawaannya. Tidak ada bawaan diam-diam: setiap opsi menyertakan
 * dasar pemakaian untuk kedua sisinya di `SITASI_OPSI`, dan situs menampilkan
 * sitasi itu apa adanya.
 *
 * Kunci opsi ikut muncul di hash URL situs, jadi kunci tetap stabil.
 */

export interface Options {
  /** `sejuta` untuk 1.000.000, alih-alih bentuk baku `satu juta`. */
  readonly sejuta: boolean;
  /** Ejaan kata skala: KBBI (`miliar`, `triliun`) atau varian (`milyar`, `trilyun`). */
  readonly ejaanMiliar: 'baku' | 'varian';
  /** Imbuhan mata uang di akhir. */
  readonly mataUang: 'tidak' | 'rupiah';
  /** Perlakuan angka di belakang koma. */
  readonly sen: 'koma' | 'sen';
  /** Gaya kapitalisasi untuk keperluan dokumen. */
  readonly kapitalisasi: 'tidak' | 'kalimat' | 'judul';
}

export const OPSI_BAWAAN: Options = {
  sejuta: false,
  ejaanMiliar: 'baku',
  mataUang: 'tidak',
  sen: 'koma',
  kapitalisasi: 'tidak',
};

export function lengkapiOpsi(opsi?: Partial<Options>): Options {
  return { ...OPSI_BAWAAN, ...opsi };
}

export interface PilihanTersitasi {
  readonly nilai: string;
  readonly contoh: string;
  readonly dasar: string;
  readonly sumber: string;
}

export interface OpsiTersitasi {
  readonly kunci: keyof Options;
  readonly judul: string;
  readonly bawaan: string;
  readonly pilihan: readonly PilihanTersitasi[];
}

/**
 * Kedua sisi setiap varian, dengan pemakaian yang mendasarinya. Ini data, bukan
 * penilaian: bentuk non-baku dicatat sebagai pemakaian nyata, bukan kesalahan.
 */
export const SITASI_OPSI: readonly OpsiTersitasi[] = [
  {
    kunci: 'sejuta',
    judul: 'satu juta atau sejuta',
    bawaan: 'false — satu juta',
    pilihan: [
      {
        nilai: 'false',
        contoh: 'satu juta',
        dasar:
          'Peleburan se- berlaku pada puluh, belas, ratus, dan ribu. Juta tidak ' +
          'ikut dalam pola itu pada pemakaian baku, sehingga bentuk hitungnya satu juta.',
        sumber: 'KBBI, lema juta; PUEBI/EYD, penulisan bilangan.',
      },
      {
        nilai: 'true',
        contoh: 'sejuta',
        dasar:
          'sejuta terdaftar di KBBI dan lazim dalam ragam sastra dan percakapan ' +
          '("sejuta rasa"), meski jarang dipakai untuk jumlah pada dokumen.',
        sumber: 'KBBI, lema sejuta.',
      },
    ],
  },
  {
    kunci: 'ejaanMiliar',
    judul: 'miliar/triliun atau milyar/trilyun',
    bawaan: 'baku — miliar, triliun',
    pilihan: [
      {
        nilai: 'baku',
        contoh: 'satu miliar, satu triliun',
        dasar: 'Bentuk yang dibakukan KBBI adalah miliar dan triliun.',
        sumber: 'KBBI, lema miliar dan triliun.',
      },
      {
        nilai: 'varian',
        contoh: 'satu milyar, satu trilyun',
        dasar:
          'milyar dan trilyun sangat lazim pada dokumen keuangan dan sistem lama. ' +
          'Disediakan agar keluaran bisa disamakan dengan sistem yang sudah berjalan.',
        sumber: 'Pemakaian umum; bukan bentuk KBBI.',
      },
    ],
  },
  {
    kunci: 'mataUang',
    judul: 'imbuhan mata uang',
    bawaan: 'tidak',
    pilihan: [
      {
        nilai: 'tidak',
        contoh: 'seribu lima ratus',
        dasar: 'Bilangan murni, tanpa konteks mata uang.',
        sumber: '—',
      },
      {
        nilai: 'rupiah',
        contoh: 'seribu lima ratus rupiah',
        dasar:
          'Pada kuitansi, faktur, dan cek, jumlah terbilang ditutup dengan satuan ' +
          'mata uang.',
        sumber: 'Konvensi dokumen keuangan Indonesia.',
      },
    ],
  },
  {
    kunci: 'sen',
    judul: 'angka di belakang koma',
    bawaan: 'koma',
    pilihan: [
      {
        nilai: 'koma',
        contoh: '1,25 → satu koma dua lima',
        dasar:
          'Koma adalah pemisah desimal, dibaca koma, dan digit di belakangnya ' +
          'dibaca satu per satu — bukan sebagai bilangan puluhan.',
        sumber: 'PUEBI/EYD, tanda koma pada angka desimal.',
      },
      {
        nilai: 'sen',
        contoh: '1,25 → satu rupiah dua puluh lima sen',
        dasar:
          'Dalam konteks akuntansi, perseratusan rupiah dibaca sebagai sen. ' +
          'Hanya berlaku sampai dua digit; lebih dari itu ditolak, tidak dibulatkan.',
        sumber: 'KBBI, lema sen; konvensi pembukuan.',
      },
    ],
  },
  {
    kunci: 'kapitalisasi',
    judul: 'kapitalisasi',
    bawaan: 'tidak',
    pilihan: [
      {
        nilai: 'tidak',
        contoh: 'seribu lima ratus rupiah',
        dasar: 'Keluaran apa adanya untuk disisipkan ke dalam kalimat.',
        sumber: '—',
      },
      {
        nilai: 'kalimat',
        contoh: 'Seribu lima ratus rupiah',
        dasar: 'Huruf kapital pada awal, seperti jumlah terbilang pada kuitansi.',
        sumber: 'Konvensi dokumen keuangan Indonesia.',
      },
      {
        nilai: 'judul',
        contoh: 'Seribu Lima Ratus Rupiah',
        dasar:
          'Kapital pada setiap kata, dipakai pada akta dan sebagian format cek.',
        sumber: 'Konvensi dokumen notaris.',
      },
    ],
  },
];
