import type { Kelompok, Options } from '@/lib';

/**
 * Kurung kelompok tiga angka di atas digit. Pengelompokan inilah algoritmanya,
 * dan melihatnya sudah menjelaskan sebagian besar aturannya — termasuk
 * kelompok kosong yang runtuh menjadi tidak ada kata.
 *
 * Kunci setiap kotak memuat nilainya, sehingga hanya kelompok yang benar-benar
 * berubah yang dipasang ulang dan ikut beranimasi. Itulah satu-satunya gerak
 * yang membawa makna di halaman ini: bilangan terurai kelompok demi kelompok,
 * bukan huruf demi huruf.
 *
 * Murni penyaji: seluruh dekomposisi datang dari kelompokkan() di pustaka.
 *
 * Sebagai gambar ia bermakna secara ruang dan tidak bermakna sebagai deretan:
 * dibacakan berurutan, isinya jadi "juta 1 ribu 000 kelompok kosong 001".
 * Karena itu kotaknya disembunyikan dari pembacaan dan digantikan satu kalimat
 * yang menerangkan gambarnya — kata terbilangnya sendiri sudah disebutkan utuh
 * di garis jumlah, jadi menguraikannya lagi hanya menambah bising.
 *
 * `padat` mengecilkan kurungnya untuk tempat yang hanya menerangkan cara
 * kerja, bukan menampilkan hasil. Ia memilih token yang lebih kecil, bukan
 * menyusutkan seluruh blok dengan transform: transform akan merender teks pada
 * 0,9 kali nilai token, yakni ukuran yang tidak ada di tangga mana pun.
 */
export function KurungKelompok({
  kelompok,
  labelKosong,
  ringkas,
  ejaan,
  padat = false,
}: {
  kelompok: readonly Kelompok[];
  labelKosong: string;
  /** Kalimat yang menggantikan gambarnya bagi pembaca layar. */
  ringkas: string;
  ejaan: Options['ejaanMiliar'];
  padat?: boolean;
}) {
  const adaKosong = kelompok.some((k) => k.nilai === 0n) && kelompok.length > 1;

  return (
    <figure className="m-0">
      <figcaption className="sr-only">{ringkas}</figcaption>

      <div aria-hidden className={`flex flex-wrap items-end gap-x-1.5 ${padat ? 'gap-y-3' : 'gap-y-4'}`}>
        {kelompok.map((k, i) => {
          const kosong = k.nilai === 0n && kelompok.length > 1;
          const digit = i === 0 ? k.nilai.toString() : k.nilai.toString().padStart(3, '0');
          const label = ejaan === 'baku' ? k.skala.baku : k.skala.varian;

          return (
            <div
              key={`${k.skala.nama}-${digit}`}
              className="animate-kelompok-masuk flex flex-col items-center"
              style={{ animationDelay: `${i * 45}ms` }}
            >
              {/*
                Kelompok kosong dibedakan oleh coretan dan batas yang lebih
                pucat, bukan oleh teks yang diredupkan sampai tak terbaca — yang
                runtuh tetap harus bisa dibaca untuk dimengerti bahwa ia runtuh.
                Tingginya minimum, bukan tetap, supaya labelnya tidak terpotong
                pada perbesaran 200% atau saat jarak huruf dinaikkan.
              */}
              <span
                className={`min-h-4 text-label ${kosong ? 'text-ink-lirih' : 'text-bank'}`}
              >
                {label}
              </span>

              <span
                className={`tabular mt-1 rounded-t-sm border-x border-t px-2.5 pb-1.5 pt-1 text-center font-mono transition-colors duration-300 ease-kertas ${
                  padat ? 'min-w-[2.9rem] text-dasar' : 'min-w-[3.4rem] text-sedang'
                } ${
                  kosong
                    ? 'border-guilloche text-ink-lirih line-through decoration-void/50'
                    : 'border-garis bg-tint/50 text-ink'
                }`}
              >
                {digit}
              </span>
            </div>
          );
        })}
      </div>

      {/*
        Satu keterangan untuk seluruh deret, bukan satu yang melayang di bawah
        tiap kelompok kosong. Yang melayang itu selebar 8rem di bawah kotak
        selebar 3rem, jadi begitu ada lebih dari satu kelompok kosong — atau
        begitu teksnya diperbesar — keterangannya saling menabrak kolom
        sebelahnya.
      */}
      {adaKosong ? (
        <p aria-hidden className="mt-2 text-kecil leading-tight text-ink-lirih">
          {labelKosong}
        </p>
      ) : null}
    </figure>
  );
}
