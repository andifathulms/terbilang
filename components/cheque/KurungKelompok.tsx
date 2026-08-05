'use client';

import type { Kelompok, Options } from '@/lib';

/**
 * Kurung kelompok tiga angka di atas digit. Pengelompokan inilah algoritmanya,
 * dan melihatnya sudah menjelaskan sebagian besar aturannya — termasuk
 * kelompok kosong yang runtuh menjadi tidak ada kata.
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
    <div className="flex flex-wrap items-end gap-3">
      {kelompok.map((k, i) => {
        const kosong = k.nilai === 0n && kelompok.length > 1;
        const digit = i === 0 ? k.nilai.toString() : k.nilai.toString().padStart(3, '0');
        const label = ejaan === 'baku' ? k.skala.baku : k.skala.varian;

        return (
          <div
            key={`${k.skala.nama}-${i}`}
            className={`animate-kelompok-masuk flex flex-col items-center ${kosong ? 'opacity-40' : ''}`}
          >
            <span className="h-4 text-[0.65rem] uppercase tracking-widest text-ink/60">
              {label}
            </span>
            <span
              className={`tabular border-x border-t border-guilloche px-2 pb-1 pt-0.5 font-mono text-lg ${
                kosong ? 'line-through decoration-guilloche' : ''
              }`}
            >
              {digit}
            </span>
            <span className="mt-0.5 h-3 text-[0.6rem] text-ink/50">
              {kosong ? labelKosong : ''}
            </span>
          </div>
        );
      })}
    </div>
  );
}
