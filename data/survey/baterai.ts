/**
 * Baterai masukan untuk survei. Sama persis dengan tempat implementasi
 * biasanya patah, sehingga tabelnya menguji hal yang memang penting.
 *
 * Daftar ini stabil: menambah masukan berarti rekaman lama tidak lagi
 * sebanding, jadi tambahan ditaruh di akhir dan rekaman dijalankan ulang.
 */

export const BATERAI: readonly string[] = [
  '0',
  '1',
  '10',
  '11',
  '19',
  '20',
  '100',
  '101',
  '110',
  '1000',
  '1001',
  '1100',
  '10000',
  '100000',
  '101000',
  '1000000',
  '1000001',
  '1000000000',
  '1000000000001',
  '9007199254740993',
  '1000000000000000',
];
