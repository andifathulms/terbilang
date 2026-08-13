/**
 * Cap verifikasi, seperti stempel yang dibubuhkan di sudut dokumen setelah
 * diperiksa. Ochre segel dipakai di sini dan tidak di tempat lain; merah void
 * tetap khusus untuk penolakan.
 *
 * Segel dipakai penuh, tanpa alfa. Pada tema siang segel/85 hanya mencapai
 * 3,59:1 di atas kertas dan garisnya 2,33:1 — pola gagal yang sama seperti
 * ink/xx dahulu, dan cap ini lolos dari sapuan itu justru karena warnanya
 * bukan tinta. Segel penuh 4,77:1 di siang, 7,48:1 di malam.
 */
export function Cap({ judul, isi }: { judul: string; isi: string }) {
  return (
    <div
      aria-hidden
      className="animate-cap-turun pointer-events-none select-none rounded-sm border-[1.5px] border-segel px-3 py-1.5 text-center text-segel"
    >
      <p className="text-label font-semibold">{judul}</p>
      <p className="tabular mt-0.5 font-mono text-kecil tracking-tight">{isi}</p>
    </div>
  );
}
