/**
 * Bantuan penyajian untuk kolom angka. Semata soal tampilan digit — titik
 * ribuan dan letak kursor. Tidak ada bilangan yang dihitung di sini; nilainya
 * diteruskan apa adanya ke pustaka.
 */

/**
 * Bentuk normal yang disimpan di keadaan dan dikirim ke format(): tanda minus
 * bila ada, digit bagian bulat, lalu paling banyak satu koma dengan digit di
 * belakangnya. Titik pemisah ribuan dibuang karena itu hiasan tampilan.
 */
export function normalkan(mentah: string): string {
  const negatif = mentah.trimStart().startsWith('-');
  const bersih = mentah.replace(/[^\d,]/g, '');
  const [bulat = '', ...ekor] = bersih.split(',');
  const berkoma = bersih.includes(',');
  const pecahan = ekor.join('');
  return `${negatif ? '-' : ''}${bulat}${berkoma ? `,${pecahan}` : ''}`;
}

/** Sisipkan titik sebagai pemisah ribuan pada bagian bulat. */
export function tampilkan(normal: string): string {
  const negatif = normal.startsWith('-');
  const tanpaTanda = negatif ? normal.slice(1) : normal;
  const [bulat = '', pecahan] = tanpaTanda.split(',');
  const berkelompok = bulat.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const ekor = pecahan === undefined ? '' : `,${pecahan}`;
  return `${negatif ? '-' : ''}${berkelompok}${ekor}`;
}

/** Karakter yang ikut dihitung saat kursor dikembalikan; titik tidak termasuk. */
function jumlahPenting(teks: string): number {
  return teks.replace(/[^\d,-]/g, '').length;
}

/**
 * Letak kursor pada teks tampilan yang menyisakan sejumlah karakter penting di
 * sebelah kirinya. Tanpa ini, menyisipkan satu digit di tengah akan melempar
 * kursor ke ujung setiap kali titik ribuan bergeser.
 */
export function letakKursor(tampilan: string, penting: number): number {
  if (penting <= 0) return 0;
  let hitung = 0;
  for (let i = 0; i < tampilan.length; i += 1) {
    if (jumlahPenting(tampilan[i] ?? '') === 1) hitung += 1;
    if (hitung === penting) return i + 1;
  }
  return tampilan.length;
}

/** Jumlah karakter penting di sebelah kiri kursor pada teks mentah. */
export function pentingSebelum(teks: string, posisi: number): number {
  return jumlahPenting(teks.slice(0, posisi));
}

/**
 * Panah atas dan bawah menggeser besaran satu tingkat: menambah atau mengurangi
 * satu nol. Nilai berpecahan dibiarkan, karena menggesernya akan mengubah arti
 * angka di belakang koma.
 */
export function geserSkala(normal: string, arah: 'naik' | 'turun'): string {
  if (normal.includes(',')) return normal;
  const negatif = normal.startsWith('-');
  const digit = (negatif ? normal.slice(1) : normal).replace(/^0+(?=\d)/, '');
  if (digit === '') return normal;

  const berikut =
    arah === 'naik' ? `${digit}0` : digit.length <= 1 ? '0' : digit.slice(0, -1);
  return `${negatif ? '-' : ''}${berikut}`;
}
