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

/**
 * Skrip pra-cat yang memasang lang pada <html> sesuai lokal di alamat.
 *
 * Akar situs merender <html>, tetapi lokalnya baru diketahui satu tingkat di
 * bawahnya, sehingga seluruh halaman /en/ menyatakan dirinya berbahasa
 * Indonesia dan dibacakan dengan lafal Indonesia. Ekspor statis tidak punya
 * peladen yang bisa membetulkannya per alamat.
 *
 * Pencocokannya persis dua lokal yang memang ada — bukan terkaan — dan
 * berjalan sebelum cat pertama, sama seperti skrip tema. Untuk pembaca tanpa
 * JavaScript, isi halaman tetap dibungkus lang oleh tata letak lokal.
 */
export const SKRIP_LOKAL =
  "try{var m=location.pathname.match(/\\/(id|en)(\\/|$)/);if(m)document.documentElement.lang=m[1]}catch(e){}";

interface Sifat {
  readonly nilai: string;
  readonly label: string;
}

interface Kartu {
  readonly judul: string;
  readonly isi: string;
  readonly tautan: string;
  readonly ke: 'ubah' | 'aturan' | 'survei';
}

interface Teks {
  readonly judulSitus: string;
  readonly taglineSitus: string;
  readonly nav: { readonly ubah: string; readonly aturan: string; readonly survei: string };
  readonly umum: {
    readonly lewatiKe: string;
    readonly tema: string;
    readonly siang: string;
    readonly malam: string;
    readonly bahasa: string;
    readonly navigasi: string;
  };
  readonly beranda: {
    readonly angkaSorot: string;
    readonly mata: string;
    readonly panah: string;
    readonly kepala: string;
    readonly paragraf: readonly string[];
    readonly ajakan: string;
    readonly ajakanDua: string;
    readonly ketik: string;
    readonly caraKerja: string;
    readonly judulSifat: string;
    readonly sifat: readonly Sifat[];
    readonly cap: { readonly judul: string; readonly isi: string };
    readonly judulContoh: string;
    readonly ringkasContoh: string;
    readonly kartu: readonly Kartu[];
  };
  readonly ubah: {
    readonly judul: string;
    readonly ringkas: string;
    readonly labelAngka: string;
    readonly labelKata: string;
    readonly labelKataKeAngka: string;
    readonly petunjukAngka: string;
    readonly petunjukKata: string;
    readonly modeDokumen: string;
    readonly salin: string;
    readonly tersalin: string;
    readonly salinDokumen: string;
    readonly bagikan: string;
    readonly tertaut: string;
    readonly kelompok: string;
    readonly kosong: string;
    readonly kelompokRingkas: string;
    readonly opsi: string;
    readonly hasilAngka: string;
    readonly contoh: string;
    readonly pintas: string;
    readonly kosongkan: string;
    readonly tukar: string;
    readonly pulihkan: string;
  };
  readonly aturan: {
    readonly judul: string;
    readonly ringkas: string;
    readonly daftarIsi: string;
    readonly keliru: string;
    readonly sumber: string;
    readonly varian: string;
    readonly varianRingkas: string;
    readonly bawaan: string;
    readonly masukanSama: string;
    readonly kataBerubah: string;
  };
  readonly survei: {
    readonly judul: string;
    readonly ringkas: string;
    readonly masukan: string;
    readonly sama: string;
    readonly beda: string;
    readonly menolak: string;
    readonly keterangan: string;
    readonly catatan: string;
    readonly belum: string;
    readonly belumIsi: string;
    readonly baterai: string;
    readonly bateraiRingkas: string;
  };
  readonly takDitemukan: {
    readonly judul: string;
    readonly isi: string;
    readonly kembali: string;
  };
  readonly galat: Record<string, string>;
}

const id: Teks = {
  judulSitus: 'Terbilang',
  taglineSitus: 'Bilangan Indonesia dieja menjadi kata, dan dibaca kembali.',
  nav: { ubah: 'Ubah', aturan: 'Aturan', survei: 'Survei' },
  umum: {
    lewatiKe: 'Lewati ke isi',
    tema: 'Tema',
    siang: 'Siang',
    malam: 'Malam',
    bahasa: 'Bahasa',
    navigasi: 'Navigasi utama',
  },
  beranda: {
    angkaSorot: '1.000.001',
    /*
     * Kening halaman menyebut tempat pemakaiannya, bukan standar yang
     * dirujuk. Pengunjung baru mengenali "kuitansi" jauh lebih cepat daripada
     * "PUEBI/EYD"; sitasinya tetap ada, di halaman Aturan.
     */
    mata: 'Untuk kuitansi, faktur, cek, dan akta',
    /** Dibaca pembaca layar sebagai ganti panah di judul. */
    panah: 'menjadi',
    kepala: 'Ketik angka, dapatkan terbilangnya — atau sebaliknya.',
    paragraf: [
      'Hampir setiap sistem akuntansi Indonesia harus menuliskan terbilang, dan sebagian besar salah di tempat yang sama: satu ribu alih-alih seribu, kelompok nol yang ikut terbaca, dan presisi yang runtuh di atas triliun.',
    ],
    ajakan: 'Coba pengubahnya',
    ajakanDua: 'Baca aturannya',
    ketik: 'Ketik angka mana pun di pengubah',
    caraKerja: 'Cara kerjanya: bilangan dipecah per tiga angka',
    judulSifat: 'Pustaka di baliknya',
    sifat: [
      { nilai: '1.000.001', label: 'nilai diuji satu per satu, bukan disampel' },
      { nilai: '2', label: 'arah: angka → kata, dan kata → angka' },
      { nilai: '0', label: 'dependensi runtime di dalam pustaka' },
      { nilai: 'BigInt', label: 'presisi tetap utuh di atas batas 2⁵³ JavaScript' },
    ],
    cap: { judul: 'Diuji tuntas', isi: '0 … 1.000.000' },
    judulContoh: 'Tempat implementasi lain patah',
    ringkasContoh: 'Kolom kanan dihitung pustaka ini; yang dicoret adalah bentuk keliru yang lazim.',
    kartu: [
      {
        judul: 'Pengubah',
        isi: 'Angka masuk, kata keluar — dan sebaliknya. Kelompok tiga angka digambar saat Anda mengetik, karena pengelompokan itulah algoritmanya.',
        tautan: 'Buka pengubah',
        ke: 'ubah',
      },
      {
        judul: 'Aturan',
        isi: 'Setiap aturan dengan sitasinya dan contoh yang dihitung pustaka saat halaman dibangun, termasuk penolakan yang ditampilkan sebagai penolakan.',
        tautan: 'Baca aturan',
        ke: 'aturan',
      },
      {
        judul: 'Survei',
        isi: 'Paket yang beredar dijalankan dengan masukan yang sama, berversi dan bertanggal. Peta masalah bersama, bukan papan skor.',
        tautan: 'Lihat survei',
        ke: 'survei',
      },
    ],
  },
  ubah: {
    judul: 'Pengubah',
    ringkas:
      'Ketik di satu sisi, lihat sisi lainnya. Semua nilai berasal dari pustaka; tidak ada yang dihitung di halaman ini.',
    labelAngka: 'Angka',
    labelKata: 'Terbilang',
    labelKataKeAngka: 'Kata',
    petunjukAngka:
      'Titik dipasang sendiri sebagai pemisah ribuan; koma untuk desimal. Panah atas dan bawah mengubah nilai sepuluh kali lipat.',
    petunjukKata: 'Ketik terbilang, misalnya dua ratus lima puluh ribu.',
    modeDokumen: 'Mode dokumen',
    salin: 'Salin',
    tersalin: 'Tersalin',
    salinDokumen: 'Salin bentuk dokumen',
    bagikan: 'Salin tautan',
    tertaut: 'Tautan tersalin',
    kelompok: 'Kelompok tiga angka',
    kosong: 'kelompok kosong — tidak menghasilkan kata',
    kelompokRingkas:
      'Gambar: bilangan dipecah per tiga angka dari kanan, tiap kelompok diberi kata skalanya. Kelompok yang bernilai nol dicoret dan tidak menghasilkan kata sama sekali.',
    opsi: 'Opsi tersitasi',
    hasilAngka: 'Angka',
    contoh: 'Coba nilai ini',
    pintas: 'Tekan / untuk menuju kolom masukan',
    kosongkan: 'Kosongkan',
    tukar: 'Tukar arah',
    pulihkan: 'Kembalikan ke bawaan',
  },
  aturan: {
    judul: 'Aturan',
    ringkas:
      'Setiap aturan dengan sumbernya dan contoh yang berjalan, termasuk kasus yang paling sering gagal.',
    daftarIsi: 'Daftar isi',
    keliru: 'sering keliru',
    sumber: 'Sumber',
    varian: 'Varian tersitasi',
    varianRingkas:
      'Setiap opsi menyebut pemakaian yang mendasari kedua sisinya, dan setiap sisi dijalankan atas masukan yang sama saat halaman dibangun. Kata yang berubah ditandai, sehingga terlihat opsi mana yang menggeser satu kata dan mana yang menyusun ulang seluruh kalimat. Tidak ada bawaan diam-diam.',
    bawaan: 'bawaan',
    masukanSama: 'Masukan yang sama',
    kataBerubah: 'kata berubah',
  },
  survei: {
    judul: 'Survei implementasi',
    ringkas:
      'Paket yang beredar diuji dengan masukan yang sama. Faktual, berversi, bertanggal — peta masalah bersama, bukan papan skor.',
    masukan: 'Masukan',
    sama: 'sama',
    beda: 'berbeda',
    menolak: 'menolak',
    keterangan: 'Keterangan',
    catatan:
      'Perbedaan ditandai, lalu diklasifikasikan tertulis sebagai bug kami, bug mereka, atau varian yang sah — catatannya ada di tests/survey/.',
    belum: 'Belum ada paket yang direkam',
    belumIsi:
      'Tabel di atas hanya menampilkan hasil yang benar-benar diukur, jadi untuk sekarang ia berisi keluaran pustaka ini saja. Jalankan skrip pengembangan dengan nama paket yang ingin disurvei; setiap klaim akan membawa versi paket dan tanggal pengukurannya.',
    baterai: 'Baterai masukan',
    bateraiRingkas:
      'Kolom terbilang adalah keluaran pustaka ini sendiri. Ia berlaku sebagai rujukan meski belum ada satu pun paket pembanding di sebelahnya.',
  },
  takDitemukan: {
    judul: 'Halaman tidak ditemukan',
    isi: 'Alamat ini tidak ada di situs. Seperti pustakanya: menolak, bukan menebak.',
    kembali: 'Kembali ke beranda',
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
  umum: {
    lewatiKe: 'Skip to content',
    tema: 'Theme',
    siang: 'Day',
    malam: 'Night',
    bahasa: 'Language',
    navigasi: 'Main navigation',
  },
  beranda: {
    angkaSorot: '1,000,001',
    mata: 'For receipts, invoices, cheques, and deeds',
    panah: 'becomes',
    kepala: 'Type a number, get it in Indonesian words — or the other way round.',
    paragraf: [
      'Nearly every Indonesian accounting system has to write terbilang, and most break in the same places: satu ribu for seribu, empty groups read aloud, and precision collapsing above triliun.',
    ],
    ajakan: 'Try the converter',
    ajakanDua: 'Read the rules',
    ketik: 'Type any number in the converter',
    caraKerja: 'How it works: the number is split every three digits',
    judulSifat: 'The library behind it',
    sifat: [
      { nilai: '1,000,001', label: 'values verified one by one, not sampled' },
      { nilai: '2', label: 'directions: digits → words, and words → digits' },
      { nilai: '0', label: 'runtime dependencies inside the library' },
      { nilai: 'BigInt', label: "precision stays exact past JavaScript's 2⁵³ limit" },
    ],
    cap: { judul: 'Verified whole', isi: '0 … 1,000,000' },
    judulContoh: 'Where other implementations break',
    ringkasContoh: 'The right column is computed by this library; the struck-through text is the common wrong form.',
    kartu: [
      {
        judul: 'Converter',
        isi: 'Digits in, words out — and back again. The three-digit groups are drawn as you type, because that grouping is the algorithm.',
        tautan: 'Open the converter',
        ke: 'ubah',
      },
      {
        judul: 'Rules',
        isi: 'Every rule with its citation and examples computed by the library at build time, including the refusals shown as refusals.',
        tautan: 'Read the rules',
        ke: 'aturan',
      },
      {
        judul: 'Survey',
        isi: 'Published packages run against the same inputs, versioned and dated. A map of a shared problem, not a scoreboard.',
        tautan: 'See the survey',
        ke: 'survei',
      },
    ],
  },
  ubah: {
    judul: 'Converter',
    ringkas:
      'Type on one side, watch the other. Every value comes from the library; nothing is computed on this page.',
    labelAngka: 'Digits',
    labelKata: 'In words',
    labelKataKeAngka: 'Words',
    petunjukAngka:
      'Thousands separators are inserted for you; comma for decimals. Arrow up and down scale the value by ten.',
    petunjukKata: 'Type the words, e.g. dua ratus lima puluh ribu.',
    modeDokumen: 'Document mode',
    salin: 'Copy',
    tersalin: 'Copied',
    salinDokumen: 'Copy document form',
    bagikan: 'Copy link',
    tertaut: 'Link copied',
    kelompok: 'Three-digit groups',
    kosong: 'empty group — emits nothing',
    kelompokRingkas:
      'Figure: the number is split every three digits from the right, and each group takes its scale word. A group worth zero is struck through and emits no words at all.',
    opsi: 'Cited options',
    hasilAngka: 'Value',
    contoh: 'Try these',
    pintas: 'Press / to jump to the input',
    kosongkan: 'Clear',
    tukar: 'Swap direction',
    pulihkan: 'Reset to defaults',
  },
  aturan: {
    judul: 'Rules',
    ringkas:
      'Every rule with its citation and a worked example, including the cases implementations fail on.',
    daftarIsi: 'Contents',
    keliru: 'common error',
    sumber: 'Source',
    varian: 'Cited variants',
    varianRingkas:
      'Every option names the usage behind both of its sides, and every side is run against the same input at build time. The words that change are marked, so you can see which options move a single word and which rebuild the whole sentence. There is no silent default.',
    bawaan: 'default',
    masukanSama: 'The same input',
    kataBerubah: 'changed',
  },
  survei: {
    judul: 'Implementation survey',
    ringkas:
      'Published packages run against the same inputs. Factual, versioned, dated — a map of a shared problem, not a scoreboard.',
    masukan: 'Input',
    sama: 'agrees',
    beda: 'differs',
    menolak: 'refuses',
    keterangan: 'Legend',
    catatan:
      'Differences are marked, then classified in writing as our bug, their bug, or a legitimate variant — the record lives in tests/survey/.',
    belum: 'No packages recorded yet',
    belumIsi:
      'The table above only shows results that were actually measured, so for now it holds this library\u2019s output alone. Run the development script with the package names to survey; every claim then carries the package version and the date it was measured.',
    baterai: 'Input battery',
    bateraiRingkas:
      'The terbilang column is this library\u2019s own output. It stands as the reference even with no package beside it to compare against.',
  },
  takDitemukan: {
    judul: 'Page not found',
    isi: 'That address does not exist on this site. Like the library: it refuses rather than guesses.',
    kembali: 'Back to the start',
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

export type { Teks, Sifat, Kartu };
