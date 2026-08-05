/**
 * Penolakan terstruktur. Setiap galat menyebutkan apa yang gagal; tidak ada
 * hasil sebagian, tidak ada pembulatan diam-diam, tidak ada tebakan.
 */

export type Galat =
  | {
      readonly type: 'masukan-kosong';
      readonly pesan: string;
    }
  | {
      /** Masukan bukan bigint dan bukan string digit (misalnya `number`). */
      readonly type: 'tipe-tidak-didukung';
      readonly diterima: string;
      readonly pesan: string;
    }
  | {
      readonly type: 'bukan-bilangan';
      readonly masukan: string;
      readonly pesan: string;
    }
  | {
      /** Melebihi skala yang dapat disitasi. Lihat words.ts. */
      readonly type: 'di-luar-jangkauan';
      readonly batas: string;
      readonly pesan: string;
    }
  | {
      /** Mode sen menuntut paling banyak dua digit di belakang koma. */
      readonly type: 'pecahan-terlalu-panjang';
      readonly pecahan: string;
      readonly pesan: string;
    }
  | {
      /** Kombinasi opsi yang tidak bermakna, misalnya sen tanpa mata uang. */
      readonly type: 'opsi-bertentangan';
      readonly opsi: string;
      readonly pesan: string;
    }
  | {
      readonly type: 'kata-tidak-dikenal';
      readonly kata: string;
      readonly posisi: number;
      readonly pesan: string;
    }
  | {
      /** "ribu" tanpa kuantitas di depannya. */
      readonly type: 'skala-tanpa-kuantitas';
      readonly skala: string;
      readonly posisi: number;
      readonly pesan: string;
    }
  | {
      /** "seribu juta", atau skala yang sama dua kali. */
      readonly type: 'urutan-skala-salah';
      readonly skala: string;
      readonly posisi: number;
      readonly pesan: string;
    }
  | {
      /** "dua puluh puluh", "ratus" langsung setelah "ratus". */
      readonly type: 'susunan-tidak-sah';
      readonly kata: string;
      readonly posisi: number;
      readonly pesan: string;
    };

export type KodeGalat = Galat['type'];

export function masukanKosong(): Galat {
  return {
    type: 'masukan-kosong',
    pesan: 'Masukan kosong.',
  };
}

export function tipeTidakDidukung(diterima: string): Galat {
  return {
    type: 'tipe-tidak-didukung',
    diterima,
    pesan:
      `Tipe ${diterima} tidak didukung. Gunakan bigint atau string digit; ` +
      '`number` ditolak karena kehilangan presisi di atas 2^53.',
  };
}

export function bukanBilangan(masukan: string): Galat {
  return {
    type: 'bukan-bilangan',
    masukan,
    pesan: `"${masukan}" bukan bilangan yang sah.`,
  };
}

export function diLuarJangkauan(batas: string): Galat {
  return {
    type: 'di-luar-jangkauan',
    batas,
    pesan:
      `Nilai melampaui ${batas}. Pemakaian kata skala di atas itu belum mapan ` +
      'dalam bahasa Indonesia, jadi pustaka ini menolak alih-alih mengarang.',
  };
}

export function pecahanTerlaluPanjang(pecahan: string): Galat {
  return {
    type: 'pecahan-terlalu-panjang',
    pecahan,
    pesan: `Mode sen hanya menerima dua digit di belakang koma; diterima "${pecahan}".`,
  };
}

export function opsiBertentangan(opsi: string, pesan: string): Galat {
  return { type: 'opsi-bertentangan', opsi, pesan };
}

export function kataTidakDikenal(kata: string, posisi: number): Galat {
  return {
    type: 'kata-tidak-dikenal',
    kata,
    posisi,
    pesan: `Kata "${kata}" tidak dikenal pada posisi ${posisi}.`,
  };
}

export function skalaTanpaKuantitas(skala: string, posisi: number): Galat {
  return {
    type: 'skala-tanpa-kuantitas',
    skala,
    posisi,
    pesan: `Kata skala "${skala}" pada posisi ${posisi} tidak didahului kuantitas.`,
  };
}

export function urutanSkalaSalah(skala: string, posisi: number): Galat {
  return {
    type: 'urutan-skala-salah',
    skala,
    posisi,
    pesan: `Kata skala "${skala}" pada posisi ${posisi} muncul di luar urutan menurun.`,
  };
}

export function susunanTidakSah(kata: string, posisi: number): Galat {
  return {
    type: 'susunan-tidak-sah',
    kata,
    posisi,
    pesan: `Susunan tidak sah pada "${kata}" di posisi ${posisi}.`,
  };
}
