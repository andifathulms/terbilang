import { format, kelompokkan, type Kelompok, type Options } from '@/lib';

/**
 * Penguraian sebuah bilangan menjadi langkah-langkah yang bisa dilihat.
 *
 * Situs ini mengaku bahwa pengelompokan tiga angka itulah algoritmanya, lalu
 * selama ini hanya menggambar kelompoknya di sebelah jawabannya — tanpa
 * pernah menunjukkan yang menyambung keduanya. Modul ini menyediakan nilai
 * antaranya.
 *
 * Tidak ada satu pun aturan terbilang yang ditulis ulang di sini. Setiap kata
 * datang dari format() di pustaka; yang dikerjakan modul ini hanya membelah
 * bilangan menurut nilai tempat — bagi seribu, bagi seratus, bagi sepuluh —
 * lalu menanyakan kata setiap potongannya kepada pustaka. Kalau suatu hari
 * pustaka berubah, uraian ini ikut berubah dan tidak bisa berbohong.
 *
 * Dua kolom yang penting:
 *
 *   kataSendiri   format(nilai kelompok)             1   -> "satu"
 *   kataDiTempat  format(nilai kelompok x skalanya)  1000 -> "seribu"
 *
 * Bedanya persis tempat aturan se- bekerja, dan menggabungkan kolom kedua
 * untuk seluruh kelompok tak-nol menghasilkan keluaran yang sama benar dengan
 * format() atas bilangan utuhnya — sudah dicocokkan untuk tiap kasus batas.
 *
 * Menggabungkan kolom pertama, dengan kelompok nol tetap disebut, justru
 * menghasilkan bentuk keliru yang paling lazim di ekosistem: "satu ribu",
 * "satu juta nol ribu satu". Bukan tiruan yang dikarang — itu yang keluar
 * kalau kedua koreksinya memang tidak ada.
 */

/** Satu suku di dalam kelompok: ratusan, puluhan, satuan, atau belasan utuh. */
export interface Suku {
  /** Nilai suku ini, misalnya 200. */
  readonly angka: bigint;
  /** Pengalinya, misalnya 100. Bernilai 1 untuk satuan dan belasan. */
  readonly faktor: bigint;
  /** Cacahnya, misalnya 2 pada "dua ratus". */
  readonly cacah: bigint;
  /** Katanya, dari pustaka. */
  readonly kata: string;
}

export interface UraiKelompok {
  readonly kelompok: Kelompok;
  /** Digit kelompok ini seperti tampil di kotak. */
  readonly digit: string;
  /** Kelompok bernilai nol pada bilangan yang punya lebih dari satu kelompok. */
  readonly kosong: boolean;
  /** Kata skala kelompok ini; kosong untuk satuan. */
  readonly skalaKata: string;
  /** format(nilai) — kata kelompok ini berdiri sendiri. */
  readonly kataSendiri: string;
  /** format(nilai x skala) — kata kelompok ini pada tempatnya. */
  readonly kataDiTempat: string;
  /** Benar bila kedua kolom berbeda, yakni tempat aturan se- bekerja. */
  readonly lebur: boolean;
  /** Isi kelompok dibelah menurut nilai tempat. */
  readonly suku: readonly Suku[];
  /** Bacaan aritmetikanya, hanya bila kelompok ini punya pengali dan lebih dari satu suku. */
  readonly lingkup: Lingkup | null;
}

/**
 * Bacaan aritmetika sebuah kelompok, untuk arah membaca balik.
 *
 * "dua ratus lima puluh ribu" adalah (2 x 100 + 5 x 10) x 1.000, bukan
 * 200 + 50.000. Kata skala mengali seluruh frasa di depannya, dan menyelesaikan
 * lingkup itu adalah bagian tersulit arah balik — juga bagian yang selama ini
 * tidak pernah ditampilkan di mana pun.
 *
 * Keduanya dihitung dari suku yang sudah ada, jadi tidak ada aturan penguraian
 * yang ditulis ulang: yang benar mengalikan jumlah seluruh sukunya, yang
 * keliru hanya mengalikan suku terakhir.
 */
export interface Lingkup {
  /** Suku di dalam kurung, misalnya ["2 x 100", "5 x 10"]. */
  readonly suku: readonly string[];
  /** Pengalinya, misalnya 1000. */
  readonly pengali: bigint;
  /** Hasil yang benar: jumlah suku dikali pengali. */
  readonly benar: bigint;
  /** Hasil bila pengalinya hanya kena suku terakhir. */
  readonly keliru: bigint;
}

export interface Uraian {
  readonly kelompok: readonly UraiKelompok[];
  /** Gabungan kolom kataDiTempat: sama dengan keluaran pustaka. */
  readonly benar: string;
  /** Gabungan kolom kataSendiri dengan kelompok nol ikut disebut. */
  readonly naif: string;
  /** Benar bila ada kelompok nol yang runtuh. */
  readonly adaKosong: boolean;
  /** Benar bila aturan se- bekerja di salah satu kelompok. */
  readonly adaLebur: boolean;
}

/**
 * Opsi untuk nilai antara. Imbuhan mata uang, sen, dan kapitalisasi dipasang
 * pada jumlah yang sudah jadi, bukan pada tiap potongan, jadi ketiganya
 * ditahan di sini — kalau tidak, setiap suku akan berakhiran "rupiah". Ejaan
 * skala dan bentuk sejuta tetap ikut karena keduanya memang mengubah kata
 * yang sedang diperagakan.
 */
function opsiAntara(opsi: Options): Partial<Options> {
  return { ejaanMiliar: opsi.ejaanMiliar, sejuta: opsi.sejuta };
}

function kata(nilai: bigint, opsi: Partial<Options>): string {
  const hasil = format(nilai, opsi);
  return hasil.type === 'ok' ? hasil.nilai : '';
}

/**
 * Belah 0..999 menurut nilai tempat.
 *
 * Pembelahan berhenti di bawah dua puluh, dan berhentinya itu sendiri yang
 * jadi pelajaran: sebelas sampai sembilan belas punya bentuknya sendiri dan
 * tidak tersusun dari puluhan ditambah satuan, sedangkan sepuluh adalah satu
 * kata utuh. Membelahnya lebih jauh akan memperagakan "satu puluh satu",
 * yakni justru bentuk yang salah. Yang diputuskan di sini hanya sampai di
 * mana membelah; setiap katanya tetap ditanyakan ke pustaka.
 */
function belahKelompok(nilai: bigint, opsi: Partial<Options>): Suku[] {
  const suku: Suku[] = [];
  const ratusan = nilai / 100n;
  const sisa = nilai % 100n;

  if (ratusan > 0n) {
    suku.push({
      angka: ratusan * 100n,
      faktor: 100n,
      cacah: ratusan,
      kata: kata(ratusan * 100n, opsi),
    });
  }

  if (sisa === 0n) return suku;

  if (sisa < 20n) {
    suku.push({ angka: sisa, faktor: 1n, cacah: sisa, kata: kata(sisa, opsi) });
    return suku;
  }

  const puluhan = sisa / 10n;
  const satuan = sisa % 10n;

  suku.push({
    angka: puluhan * 10n,
    faktor: 10n,
    cacah: puluhan,
    kata: kata(puluhan * 10n, opsi),
  });

  if (satuan > 0n) {
    suku.push({ angka: satuan, faktor: 1n, cacah: satuan, kata: kata(satuan, opsi) });
  }

  return suku;
}

/**
 * Bacaan aritmetika satu kelompok yang punya pengali dan lebih dari satu suku.
 * Hanya di situ lingkupnya bisa disalahpahami; "satu ribu" tidak mendua.
 */
function bacaLingkup(nilai: bigint, pengali: bigint, suku: readonly Suku[]): Lingkup | null {
  if (pengali === 1n || nilai === 0n || suku.length < 2) return null;

  const jumlah = suku.reduce((a, s) => a + s.angka, 0n);
  const terakhir = suku[suku.length - 1]?.angka ?? 0n;

  return {
    suku: suku.map((s) => (s.faktor === 1n ? s.cacah.toString() : `${s.cacah} × ${s.faktor}`)),
    pengali,
    benar: jumlah * pengali,
    /* Salah paham yang lazim: pengalinya dikira hanya kena kata terdekatnya,
       sehingga "dua ratus lima puluh ribu" terbaca 200 + 50.000. */
    keliru: jumlah - terakhir + terakhir * pengali,
  };
}

export function uraikan(bulat: bigint, opsi: Options): Uraian {
  const antara = opsiAntara(opsi);
  const kelompok = kelompokkan(bulat);
  const banyak = kelompok.length > 1;

  const terurai: UraiKelompok[] = kelompok.map((k, i) => {
    const skalaKata = antara.ejaanMiliar === 'varian' ? k.skala.varian : k.skala.baku;
    const kataSendiri = kata(k.nilai, antara);
    const kataDiTempat = kata(k.nilai * k.skala.nilai, antara);
    const suku = belahKelompok(k.nilai, antara);

    return {
      kelompok: k,
      digit: i === 0 ? k.nilai.toString() : k.nilai.toString().padStart(3, '0'),
      kosong: k.nilai === 0n && banyak,
      skalaKata,
      kataSendiri,
      kataDiTempat,
      /* Peleburan dikenali dengan membandingkan dua keluaran pustaka, bukan
         dengan menuliskan ulang syarat aturannya di sini. */
      lebur: k.nilai !== 0n && kataDiTempat !== `${kataSendiri} ${skalaKata}`.trim(),
      suku,
      lingkup: bacaLingkup(k.nilai, k.skala.nilai, suku),
    };
  });

  return {
    kelompok: terurai,
    benar: terurai
      .filter((u) => u.kelompok.nilai !== 0n)
      .map((u) => u.kataDiTempat)
      .join(' '),
    /* Kelompok nol tetap disebut selama ia punya kata skala — itulah bentuk
       keliru yang lazim. Nol pada satuan tidak pernah ikut terucap. */
    naif: terurai
      .filter((u) => u.kelompok.nilai !== 0n || u.skalaKata !== '')
      .map((u) => `${u.kataSendiri} ${u.skalaKata}`.trim())
      .join(' '),
    adaKosong: terurai.some((u) => u.kosong),
    adaLebur: terurai.some((u) => u.lebur),
  };
}
