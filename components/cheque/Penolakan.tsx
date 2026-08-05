'use client';

import type { Galat } from '@/lib';

/**
 * Merah void hanya di sini: kegagalan validasi dan penolakan. Pesan pustaka
 * ditampilkan apa adanya karena pesan itu memang menyebutkan apa yang gagal.
 */
export function Penolakan({ galat, judul }: { galat: Galat; judul: string }) {
  return (
    <div role="status" className="rounded-sm border border-void/50 bg-void/5 p-4">
      <p className="text-sm font-medium text-void">{judul}</p>
      <p className="mt-1 text-sm text-void/90">{galat.pesan}</p>
      <p className="mt-2 font-mono text-[0.65rem] uppercase tracking-widest text-void/70">
        {galat.type}
      </p>
    </div>
  );
}
