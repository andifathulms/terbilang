/**
 * Garis jumlah seperti pada cek: kata berjalan di atas garis bergaris, dengan
 * kurung `#` di kedua ujung pada mode dokumen — konvensi yang mencegah
 * penambahan kata setelah dokumen ditandatangani.
 *
 * Kata dipecah per spasi hanya untuk memberi jeda gerak; teksnya sendiri utuh
 * apa adanya dari format(). Tidak ada yang disusun ulang di sini.
 */
export function GarisJumlah({
  kata,
  modeDokumen,
  label,
  bisu = false,
}: {
  kata: string;
  modeDokumen: boolean;
  label: string;
  /**
   * Tahan salinan sr-only-nya. Dipakai bila pemanggilnya sudah menyediakan
   * wilayah hidup yang menyebutkan kata yang sama — di pengubah — supaya
   * kalimatnya tidak dibacakan dua kali dalam satu penelusuran.
   */
  bisu?: boolean;
}) {
  const potongan = kata.split(' ');

  return (
    <div className="guilloche relative overflow-hidden rounded-lembar border border-garis bg-kertas/60 px-4 py-3 sm:px-5">
      <span className="label">{label}</span>

      <p
        key={`${kata}-${modeDokumen}`}
        aria-hidden
        lang="id"
        className="garis-jumlah mt-1 flex flex-wrap items-baseline gap-x-[0.3em] pb-2 font-display text-jumlah text-bank"
      >
        {modeDokumen ? <span className="animate-naik-masuk text-ink-lirih">#</span> : null}

        {potongan.map((p, i) => (
          <span
            key={`${i}-${p}`}
            className="animate-kelompok-masuk"
            style={{ animationDelay: `${Math.min(i, 12) * 35}ms` }}
          >
            {p}
          </span>
        ))}

        {modeDokumen ? <span className="animate-naik-masuk text-ink-lirih">#</span> : null}
      </p>

      {/* Pembacaan layar mendapat kalimat utuh, bukan potongan per kata. */}
      {bisu ? null : (
        <span lang="id" className="sr-only">
          {modeDokumen ? `# ${kata} #` : kata}
        </span>
      )}
    </div>
  );
}
