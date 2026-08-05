/**
 * Tanda merek: pagar berserif di dalam ubin bersudut tumpul — pagar yang sama
 * yang mengurung jawaban di lembar cek. Digambar dengan token, bukan berkas
 * gambar, supaya ikut berbalik sendiri di tema malam tanpa versi kedua.
 *
 * Aturan merek: pagar selalu diset dalam serif yang sama dengan "Terbilang",
 * tidak pernah pagar mono dari huruf kode.
 */
export function TandaPagar({ kelas = '' }: { kelas?: string }) {
  return (
    <span
      aria-hidden
      className={`grid shrink-0 place-items-center rounded-[0.4em] bg-ink font-display font-bold leading-none text-tint ${kelas}`}
    >
      <span className="translate-y-[0.02em]">#</span>
    </span>
  );
}
