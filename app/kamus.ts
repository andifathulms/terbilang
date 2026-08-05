/**
 * Salinan teks situs. Bahasa Indonesia lebih dahulu, Inggris menyusul.
 *
 * Istilah tata bahasa tetap dalam bahasa Indonesia di kedua lokal — satuan,
 * belasan, puluhan, ratusan, kelompok — karena itu memang namanya.
 */

export const LOKAL = ['id', 'en'] as const;
export type Lokal = (typeof LOKAL)[number];

export function lokalSah(nilai: string): nilai is Lokal {
  return (LOKAL as readonly string[]).includes(nilai);
}

interface Teks {
  readonly judulSitus: string;
  readonly taglineSitus: string;
  readonly nav: { readonly ubah: string; readonly aturan: string; readonly survei: string };
  readonly beranda: {
    readonly sorot: string;
    readonly paragraf: readonly string[];
    readonly ajakan: string;
  };
  readonly ubah: {
    readonly judul: string;
    readonly labelAngka: string;
    readonly labelKata: string;
    readonly labelKataKeAngka: string;
    readonly petunjukAngka: string;
    readonly petunjukKata: string;
    readonly modeDokumen: string;
    readonly salin: string;
    readonly tersalin: string;
    readonly kelompok: string;
    readonly kosong: string;
    readonly opsi: string;
    readonly hasilAngka: string;
  };
  readonly aturan: { readonly judul: string; readonly ringkas: string };
  readonly survei: { readonly judul: string; readonly ringkas: string };
  readonly galat: Record<string, string>;
}

const id: Teks = {
  judulSitus: 'Terbilang',
  taglineSitus: 'Bilangan Indonesia dieja menjadi kata, dan dibaca kembali.',
  nav: { ubah: 'Ubah', aturan: 'Aturan', survei: 'Survei' },
  beranda: {
    sorot: 'satu juta satu',
    paragraf: [
      'Terbilang wajib ada di kuitansi, faktur, cek, dan akta. Hampir setiap sistem akuntansi Indonesia menuliskannya, dan sebagian besar salah di tempat yang sama: satu ribu alih-alih seribu, kelompok nol yang ikut terbaca, dan presisi yang runtuh di atas triliun.',
      'Pustaka ini dua arah, berbasis BigInt, tanpa dependensi, dan diverifikasi lengkap untuk sejuta nilai pertama — bukan disampel.',
    ],
    ajakan: 'Coba pengubahnya',
  },
  ubah: {
    judul: 'Pengubah',
    labelAngka: 'Angka',
    labelKata: 'Terbilang',
    labelKataKeAngka: 'Kata',
    petunjukAngka: 'Ketik angka. Koma untuk desimal, titik boleh sebagai pemisah ribuan.',
    petunjukKata: 'Ketik terbilang, misalnya dua ratus lima puluh ribu.',
    modeDokumen: 'Mode dokumen',
    salin: 'Salin',
    tersalin: 'Tersalin',
    kelompok: 'Kelompok tiga angka',
    kosong: 'kelompok kosong — tidak menghasilkan kata',
    opsi: 'Opsi',
    hasilAngka: 'Angka',
  },
  aturan: {
    judul: 'Aturan',
    ringkas:
      'Setiap aturan dengan sumbernya dan contoh yang berjalan, termasuk kasus yang paling sering gagal.',
  },
  survei: {
    judul: 'Survei implementasi',
    ringkas:
      'Paket yang beredar diuji dengan masukan yang sama. Faktual, berversi, bertanggal — peta masalah bersama, bukan papan skor.',
  },
  galat: {
    'masukan-kosong': 'Masukan kosong.',
    'tipe-tidak-didukung': 'Tipe masukan tidak didukung.',
    'bukan-bilangan': 'Bukan bilangan yang sah.',
    'di-luar-jangkauan': 'Di luar jangkauan yang dapat disitasi.',
    'pecahan-terlalu-panjang': 'Mode sen hanya menerima dua digit di belakang koma.',
    'opsi-bertentangan': 'Kombinasi opsi tidak bermakna.',
    'kata-tidak-dikenal': 'Ada kata yang tidak dikenal.',
    'skala-tanpa-kuantitas': 'Kata skala tanpa kuantitas.',
    'urutan-skala-salah': 'Urutan kata skala tidak menurun.',
    'susunan-tidak-sah': 'Susunan kata tidak sah.',
  },
};

const en: Teks = {
  judulSitus: 'Terbilang',
  taglineSitus: 'Indonesian numbers spelled out in words, and read back again.',
  nav: { ubah: 'Convert', aturan: 'Rules', survei: 'Survey' },
  beranda: {
    sorot: 'satu juta satu',
    paragraf: [
      'Terbilang is required on Indonesian receipts, invoices, cheques, and deeds. Nearly every accounting system writes it, and most break in the same places: satu ribu for seribu, empty groups read aloud, and precision collapsing above triliun.',
      'This library is bidirectional, BigInt-based, dependency-free, and verified completely for the first million values — not sampled.',
    ],
    ajakan: 'Try the converter',
  },
  ubah: {
    judul: 'Converter',
    labelAngka: 'Digits',
    labelKata: 'In words',
    labelKataKeAngka: 'Words',
    petunjukAngka: 'Type digits. Comma for decimals; dots may separate thousands.',
    petunjukKata: 'Type the words, e.g. dua ratus lima puluh ribu.',
    modeDokumen: 'Document mode',
    salin: 'Copy',
    tersalin: 'Copied',
    kelompok: 'Three-digit groups',
    kosong: 'empty group — emits nothing',
    opsi: 'Options',
    hasilAngka: 'Value',
  },
  aturan: {
    judul: 'Rules',
    ringkas:
      'Every rule with its citation and a worked example, including the cases implementations fail on.',
  },
  survei: {
    judul: 'Implementation survey',
    ringkas:
      'Published packages run against the same inputs. Factual, versioned, dated — a map of a shared problem, not a scoreboard.',
  },
  galat: {
    'masukan-kosong': 'Empty input.',
    'tipe-tidak-didukung': 'Unsupported input type.',
    'bukan-bilangan': 'Not a valid number.',
    'di-luar-jangkauan': 'Beyond the citable range.',
    'pecahan-terlalu-panjang': 'Sen mode accepts at most two decimal digits.',
    'opsi-bertentangan': 'Those options do not go together.',
    'kata-tidak-dikenal': 'Unrecognised word.',
    'skala-tanpa-kuantitas': 'Scale word without a quantity.',
    'urutan-skala-salah': 'Scale words are not in descending order.',
    'susunan-tidak-sah': 'Invalid word order.',
  },
};

export const KAMUS: Record<Lokal, Teks> = { id, en };

export type { Teks };
