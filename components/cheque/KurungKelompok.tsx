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
export function KurungKelompok({
  kelompok,
  labelKosong,
  ejaan,
}: {
  kelompok: readonly Kelompok[];
  labelKosong: string;
  ejaan: Options['ejaanMiliar'];
}) {
  return (
    <div className="flex flex-wrap items-end gap-x-1.5 gap-y-8 pb-7">
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
            <span
              className={`h-4 text-label ${kosong ? 'text-ink/25' : 'text-bank/75'}`}
              aria-hidden={label === ''}
            >
              {label}
            </span>

            <span
              className={`tabular relative mt-1 min-w-[3.4rem] rounded-t-sm border-x border-t px-2.5 pb-1.5 pt-1 text-center font-mono text-lg transition-colors duration-300 ease-kertas ${
                kosong
                  ? 'border-guilloche/50 text-ink/30 line-through decoration-guilloche'
                  : 'border-guilloche bg-tint/50 text-ink'
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
              <span className="absolute left-1/2 top-full w-28 -translate-x-1/2 pt-1 text-center text-[0.6rem] leading-tight text-ink/45">
                {labelKosong}
              </span>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
