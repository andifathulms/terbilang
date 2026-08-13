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
 */
/**
 * `padat` mengecilkan kurungnya untuk tempat yang hanya menerangkan cara
 * kerja, bukan menampilkan hasil — di beranda, misalnya, di bawah garis
 * jumlah. Ia memilih token yang lebih kecil, bukan menyusutkan seluruh blok
 * dengan transform: transform akan merender teks pada 0,9 kali nilai token,
 * yakni ukuran yang tidak ada di tangga mana pun, sekaligus menyusutkan tebal
 * garis dan menggeser keterangan kelompok kosong dari tempatnya.
 */
export function KurungKelompok({
  kelompok,
  labelKosong,
  ejaan,
  padat = false,
}: {
  kelompok: readonly Kelompok[];
  labelKosong: string;
  ejaan: Options['ejaanMiliar'];
  padat?: boolean;
}) {
  return (
    <div
      className={`flex flex-wrap items-end gap-x-1.5 ${padat ? 'gap-y-7 pb-6' : 'gap-y-8 pb-7'}`}
    >
      {kelompok.map((k, i) => {
        const kosong = k.nilai === 0n && kelompok.length > 1;
        const digit = i === 0 ? k.nilai.toString() : k.nilai.toString().padStart(3, '0');
        const label = ejaan === 'baku' ? k.skala.baku : k.skala.varian;

        return (
          <div
            key={`${k.skala.nama}-${digit}`}
            className="animate-kelompok-masuk relative flex flex-col items-center"
            style={{ animationDelay: `${i * 45}ms` }}
          >
            {/*
              Kelompok kosong dibedakan oleh coretan dan batas yang lebih
              pucat, bukan oleh teks yang diredupkan sampai tak terbaca — yang
              runtuh tetap harus bisa dibaca untuk dimengerti bahwa ia runtuh.
            */}
            <span className={`h-4 text-label ${kosong ? 'text-ink-lirih' : 'text-bank'}`}>
              {label}
            </span>

            <span
              className={`tabular relative mt-1 rounded-t-sm border-x border-t px-2.5 pb-1.5 pt-1 text-center font-mono transition-colors duration-300 ease-kertas ${
                padat ? 'min-w-[2.9rem] text-dasar' : 'min-w-[3.4rem] text-sedang'
              } ${
                kosong
                  ? 'border-guilloche text-ink-lirih line-through decoration-void/50'
                  : 'border-garis bg-tint/50 text-ink'
              }`}
            >
              {digit}
            </span>

            {/*
              Keterangan kelompok kosong diletakkan di luar aliran supaya
              kolomnya tidak ikut melebar — kelompok yang runtuh harus terlihat
              menyempit, bukan menuntut ruang.
            */}
            {kosong ? (
              <span className="absolute left-1/2 top-full w-32 -translate-x-1/2 pt-1 text-center text-kecil leading-tight text-ink-lirih">
                {labelKosong}
              </span>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
