/**
 * Cap verifikasi, seperti stempel yang dibubuhkan di sudut dokumen setelah
 * diperiksa. Ochre segel dipakai di sini dan tidak di tempat lain; merah void
 * tetap khusus untuk penolakan.
 */
export function Cap({ judul, isi }: { judul: string; isi: string }) {
  return (
    <div
      aria-hidden
      className="animate-cap-turun pointer-events-none select-none rounded-sm border-[1.5px] border-segel/60 px-3 py-1.5 text-center text-segel/85"
    >
      <p className="text-label font-semibold">{judul}</p>
      <p className="tabular mt-0.5 font-mono text-kecil tracking-tight">{isi}</p>
    </div>
  );
}
