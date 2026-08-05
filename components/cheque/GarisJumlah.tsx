'use client';

/**
 * Garis jumlah seperti pada cek: kata berjalan di atas garis bergaris, dengan
 * kurung `#` di kedua ujung pada mode dokumen — konvensi yang mencegah
 * penambahan kata setelah dokumen ditandatangani.
 */
export function GarisJumlah({
  kata,
  modeDokumen,
  label,
}: {
  kata: string;
  modeDokumen: boolean;
  label: string;
}) {
  return (
    <div className="guilloche rounded-sm border border-guilloche p-4">
      <span className="text-[0.65rem] uppercase tracking-widest text-ink/60">{label}</span>
      <p className="garis-jumlah flex flex-wrap items-baseline gap-x-2 pb-2 pt-1">
        {modeDokumen ? <span className="font-display text-jumlah text-bank">#</span> : null}
        <span className="font-display text-jumlah text-bank">{kata}</span>
        {modeDokumen ? <span className="font-display text-jumlah text-bank">#</span> : null}
      </p>
    </div>
  );
}
