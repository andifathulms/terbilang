import type { Galat } from '@/lib';

/**
 * Merah void hanya di sini: kegagalan validasi dan penolakan. Pesan pustaka
 * ditampilkan apa adanya karena pesan itu memang menyebutkan apa yang gagal,
 * dan kode galatnya ikut tampil supaya bisa dicari di kode sumber.
 */
export function Penolakan({ galat, judul }: { galat: Galat; judul: string }) {
  return (
    <div
      role="status"
      key={galat.type}
      className="animate-naik-masuk flex gap-3 rounded-lembar border border-void/40 bg-void/[0.06] p-4 sm:p-5"
    >
      <span
        aria-hidden
        className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-void/50 text-xs text-void"
      >
        !
      </span>

      <div className="min-w-0 space-y-1">
        <p className="font-display text-lg text-void">{judul}</p>
        <p className="text-sm leading-relaxed text-void/90">{galat.pesan}</p>
        <p className="pt-1 font-mono text-[0.65rem] uppercase tracking-widest text-void/60">
          {galat.type}
        </p>
      </div>
    </div>
  );
}
