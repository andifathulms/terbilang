<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset=".github/assets/lockup-dark.png">
  <img src=".github/assets/lockup-light.png" alt="Terbilang — dieja jadi kata, dibaca kembali" width="480">
</picture>

**Bilangan Indonesia dieja menjadi kata, dan dibaca kembali.**
Dua arah, berbasis `BigInt`, tanpa dependensi, dan diverifikasi lengkap untuk sejuta nilai pertama.

[![lisensi MIT](https://img.shields.io/badge/lisensi-MIT-1E3A5F?style=flat-square)](LICENSE)
[![dependensi runtime: 0](https://img.shields.io/badge/dependensi%20runtime-0-1E3A5F?style=flat-square)](#yang-dijamin)
[![BigInt](https://img.shields.io/badge/aritmetika-BigInt-1E3A5F?style=flat-square)](#yang-dijamin)
[![ESM + CJS](https://img.shields.io/badge/modul-ESM%20%2B%20CJS-1E3A5F?style=flat-square)](#pemasangan)
[![diuji 1.000.001 nilai](https://img.shields.io/badge/diuji-1.000.001%20nilai-B0894A?style=flat-square)](#pengujian)

[Situs](https://andifathulms.github.io/terbilang/) ·
[Pengubah](https://andifathulms.github.io/terbilang/id/ubah/) ·
[Aturan](https://andifathulms.github.io/terbilang/id/aturan/) ·
[Survei](https://andifathulms.github.io/terbilang/id/survei/)

</div>

---

## Kenapa ini ada

Hampir setiap implementasi *terbilang* di ekosistem JavaScript memakai `number`.
Presisi bilangan bulat JavaScript runtuh di atas 2⁵³ ≈ 9×10¹⁵ — **tepat di atas
triliun**. Artinya implementasi itu benar sepanjang pengujian santai, lalu salah
diam-diam pada nilai yang justru penting: nominal kontrak, faktur besar, saldo.

```ts
Number('9007199254740993');  // 9007199254740992  — satu rupiah lenyap
```

Terbilang memakai `BigInt` di seluruh jalur aritmetika, menolak alih-alih
menebak, dan membuktikan dirinya dengan sapuan menyeluruh, bukan sampel.

## Pemasangan

```bash
pnpm add terbilang     # npm i terbilang · yarn add terbilang
```

ESM dan CJS, dengan tipe. Node ≥ 18.

```ts
import { format, parse } from 'terbilang';

format(1_000_001n);
// { type: 'ok', nilai: 'satu juta satu' }

format(1_500n, { mataUang: 'rupiah', kapitalisasi: 'judul' });
// { type: 'ok', nilai: 'Seribu Lima Ratus Rupiah' }

parse('dua ratus lima puluh ribu');
// { type: 'ok', nilai: { negatif: false, bulat: 250000n, pecahan: '' } }
```

## Yang dijamin

| | |
|---|---|
| **`BigInt` di seluruh jalur aritmetika** | Menerima `bigint` atau string digit; `number` ditolak pada tipe maupun saat jalan. Tidak ada `parseInt`, tidak ada `Number()`, di mana pun dalam `lib/`. |
| **Menolak, bukan menebak** | Di luar jangkauan, bukan bilangan, atau kata yang tak terbaca menghasilkan galat terstruktur yang menyebutkan apa yang gagal. Tidak pernah string separuh benar, tidak pernah pemotongan diam-diam. |
| **Tidak mengarang kata skala** | Berhenti di *kuadriliun* karena itu batas yang masih dapat disitasi ke KBBI; di atasnya menolak. |
| **Aturan `se-` bersifat leksikal** | `sepuluh`, `sebelas`, `seratus`, `seribu` — tetapi *satu juta* pada bawaan. Asimetrinya nyata; `sejuta` tersedia sebagai opsi tersitasi. |
| **Kelompok `000` tidak menghasilkan kata** | `1.000.001` adalah *satu juta satu*. Ini kutu struktural paling umum di ekosistem, dan ia punya fixture permanen. |
| **Ruang lingkup pengali dibaca benar** | *dua ratus lima puluh ribu* adalah `(2×100 + 5×10) × 1000`, bukan `200 + 50000`. |
| **`format` dan `parse` saling membalik** | Pada opsi yang sama, untuk setiap nilai dalam sapuan menyeluruh. |
| **Nol dependensi runtime** | Tidak satu pun. Tanpa DOM, tanpa `Intl`, tanpa `Date` — perilaku identik di Node dan peramban. |

## Hasil dan galat

Kegagalan adalah nilai, bukan pengecualian. Keduanya union terdiskriminasi pada
`type`, jadi TypeScript memaksa kedua cabang ditangani:

```ts
const hasil = format(masukan);
if (hasil.type === 'ok') gunakan(hasil.nilai);
else tampilkan(hasil.galat.type, hasil.galat.pesan);
```

## Opsi

Setiap opsi membawa dasar pemakaian untuk **kedua** sisinya; tidak ada bawaan
diam-diam. `SITASI_OPSI` mengekspor sitasi itu sebagai data, dan
[halaman aturan](https://andifathulms.github.io/terbilang/id/aturan/) di situs
merendernya langsung dari sana.

| Opsi | Nilai | Bawaan |
|---|---|---|
| `sejuta` | `false` \| `true` | `false` — *satu juta* |
| `ejaanMiliar` | `'baku'` \| `'varian'` | `'baku'` — *miliar*, *triliun* |
| `mataUang` | `'tidak'` \| `'rupiah'` | `'tidak'` |
| `sen` | `'koma'` \| `'sen'` | `'koma'` |
| `kapitalisasi` | `'tidak'` \| `'kalimat'` \| `'judul'` | `'tidak'` |

Setiap kombinasi opsi bolak-balik di bawah dirinya sendiri dalam suite.

## Pengujian

```bash
pnpm test:run          # fixture, batas, matriks opsi
pnpm test:exhaustive   # bolak-balik 0..1.000.000 + invarian struktural
pnpm test:bigint       # perilaku di atas 2^53 dan audit sumber lib/
```

Domainnya terbatas dan fungsinya murni, jadi ia dapat diverifikasi **lengkap**.
Sapuan menyeluruh membentuk *setiap* nilai dari 0 sampai 1.000.000, memeriksa
strukturnya, lalu membacanya kembali — 1.000.001 nilai dalam beberapa detik.
Tidak disampel, tidak dilewati, tidak ditandai lambat. Ditambah bolak-balik acak
berbenih sampai batas magnitudo dan tetangga setiap pangkat sepuluh, serta
pernyataan eksplisit di atas 2⁵³.

## Situs

```bash
pnpm dev        # server pengembangan
pnpm build      # ekspor statis ke ./out
pnpm preview    # sajikan ./out di bawah basePath produksi
```

Pengubah dua arah dengan pengelompokan tiga angka digambar saat diketik, rujukan
aturan bersitasi, dan survei implementasi. Keadaan pengubah — arah, masukan,
mode dokumen, dan setiap opsi — dibawa di hash URL, jadi sebuah hasil dapat
ditautkan. Situs mengimpor pustaka; pustaka tidak tahu situs ada.

## Survei

`pnpm survey:record <paket>` memasang dan menjalankan paket pihak ketiga di
direktori sementara, lalu menulis hasilnya beserta versi dan tanggal pengukuran.
**Hanya untuk pengembangan** — tidak pernah di CI, tidak pernah ikut dalam
bundel. Nama paket diberikan lewat argumen supaya tidak ada klaim tentang paket
yang tidak benar-benar diukur, dan setiap perbedaan wajib punya klasifikasi
tertulis di `tests/survey/`.

Nadanya faktual: peta masalah bersama, bukan papan skor.

## Merek

Tanda "pagar" — `#` yang sama yang mengurung jawaban di lembar cek — diset dalam
serif yang sama dengan wordmark-nya, tidak pernah dari huruf kode. Aset yang
dipakai situs ada di [`public/`](public/); master ekspor lengkapnya tidak ikut
dilacak.

| | |
|---|---|
| Kertas `#E7EBE3` | Tinta `#1C2A22` |
| Kata/CTA `#1E3A5F` | Cap bukti `#B0894A` |

## Lisensi

MIT
