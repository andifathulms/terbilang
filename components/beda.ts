/**
 * Beda kata antara dua keluaran pustaka, untuk menandai apa yang sebenarnya
 * berubah ketika sebuah varian dipindah.
 *
 * Ini murni penyaji: tidak ada aturan terbilang yang dihitung ulang di sini.
 * Masukannya sudah berupa dua hasil format(), dan yang dikerjakan hanya
 * menyejajarkan keduanya kata demi kata — pekerjaan yang sama seperti
 * memberi warna pada teks, bukan seperti mengeja bilangan.
 *
 * Penyejajarannya memakai suburutan bersama terpanjang, bukan perbandingan
 * per indeks: `sen` menggeser seluruh ekor kalimat, dan perbandingan indeks
 * akan melaporkan setiap kata sesudahnya sebagai berubah padahal yang berubah
 * hanya susunannya.
 */

export type Tanda = { readonly kata: string; readonly berubah: boolean };

/**
 * Panjang suburutan bersama terpanjang, sebagai tabel. Domainnya sependek
 * satu jumlah terbilang, jadi tabel penuh lebih jelas daripada yang hemat.
 */
function tabel(a: readonly string[], b: readonly string[]): number[][] {
  const t: number[][] = Array.from({ length: a.length + 1 }, () =>
    new Array<number>(b.length + 1).fill(0),
  );

  for (let i = a.length - 1; i >= 0; i -= 1) {
    for (let j = b.length - 1; j >= 0; j -= 1) {
      const baris = t[i];
      const berikut = t[i + 1];
      if (baris === undefined || berikut === undefined) continue;
      baris[j] = a[i] === b[j] ? (berikut[j + 1] ?? 0) + 1 : Math.max(berikut[j] ?? 0, baris[j + 1] ?? 0);
    }
  }

  return t;
}

/**
 * Tandai setiap kata di `sisi` menurut apakah ia ada di `dasar` pada posisi
 * yang bersesuaian. Kata yang bersama kedua keluaran ditandai tidak berubah;
 * sisanya berubah.
 */
export function tandaiBeda(dasar: string, sisi: string): readonly Tanda[] {
  const a = dasar.split(' ').filter((k) => k !== '');
  const b = sisi.split(' ').filter((k) => k !== '');
  const t = tabel(a, b);

  const hasil: Tanda[] = [];
  let i = 0;
  let j = 0;

  while (j < b.length) {
    const kata = b[j];
    if (kata === undefined) break;

    if (i < a.length && a[i] === kata) {
      hasil.push({ kata, berubah: false });
      i += 1;
      j += 1;
      continue;
    }

    // Buang kata `dasar` yang tidak terpakai selama itu memperpanjang
    // kesamaan; kalau tidak, kata di `sisi` inilah yang berubah.
    const lewatiDasar = i < a.length ? (t[i + 1]?.[j] ?? 0) : -1;
    const lewatiSisi = t[i]?.[j + 1] ?? 0;

    if (lewatiDasar >= lewatiSisi) {
      i += 1;
    } else {
      hasil.push({ kata, berubah: true });
      j += 1;
    }
  }

  return hasil;
}

/** Berapa kata yang berubah — dipakai untuk menyebut besar kecilnya varian. */
export function jumlahBerubah(tanda: readonly Tanda[]): number {
  return tanda.filter((t) => t.berubah).length;
}
