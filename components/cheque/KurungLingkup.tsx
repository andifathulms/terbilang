import type { Options } from '@/lib';
import { uraikan } from '../urai';

/**
 * Lingkup pengali sebagai kurung di atas kata, simetris dengan KurungKelompok
 * yang menggambar kurung di atas digit. Forward menggambar digit lebih dulu
 * lalu memberi kata skala sebagai label; arah balik ini membalik urutannya —
 * kata yang di dalam kurung, angka yang jadi label — karena arah baliklah
 * yang justru sulit dipahami tanpa gambar: kata skala mengali seluruh frasa
 * di depannya, bukan kata terdekatnya saja.
 *
 * Hanya kelompok yang lingkupnya benar-benar bisa disalahpahami yang digambar
 * di sini (lingkup !== null dari uraikan()) — persis kelompok yang sama yang
 * mendapat baris "Lingkup pengali" di Uraian. Kelompok lain sudah cukup jelas
 * dari kurung kelompok atas digit dan daftar langkah di bawahnya.
 *
 * Murni penyaji: seluruh suku, pengali, dan bentuk keliru datang dari
 * uraikan(), yang sendirinya hanya bertanya kata ke format(). Tidak ada
 * aritmetika terbilang yang ditulis ulang di sini.
 *
 * aria-hidden dengan figcaption sr-only, mengikuti pola KurungKelompok:
 * daftar langkah Uraian di bawahnya tetap jadi jalur pembaca layar, dan
 * kurung ini murni tambahan visual di atasnya.
 */
export function KurungLingkup({
  bulat,
  opsi,
  ringkas,
}: {
  bulat: bigint;
  opsi: Options;
  /** Kalimat yang menggantikan gambarnya bagi pembaca layar. */
  ringkas: string;
}) {
  const u = uraikan(bulat, opsi);
  const kelompokLingkup = u.kelompok.filter((k) => k.lingkup !== null);

  if (kelompokLingkup.length === 0) return null;

  return (
    <figure aria-hidden className="m-0 space-y-ruang4">
      <figcaption className="sr-only">{ringkas}</figcaption>

      {kelompokLingkup.map((k) => {
        const lingkup = k.lingkup;
        if (lingkup === null) return null;

        return (
          <div key={`${k.kelompok.skala.nama}-${k.digit}`} className="flex flex-col items-center">
            {/* Hasil akhir kelompok ini: label di puncak, sama seperti kata skala di KurungKelompok. */}
            <span className="tabular font-mono text-label text-bank">{bertitik(lingkup.benar)}</span>

            {/* Kurung terluar: suku-suku yang sejajar, lalu kata skalanya. */}
            <div className="mt-1 flex items-end gap-2 rounded-t-sm border-x border-t border-bank/60 px-2.5 pb-1.5 pt-2">
              {/* Kurung tengah: jumlah suku, hanya bila lebih dari satu suku. */}
              {k.suku.length > 1 ? (
                <div className="flex flex-col items-center">
                  <span className="tabular font-mono text-label text-ink-sedang">
                    {bertitik(k.suku.reduce((a, s) => a + s.angka, 0n))}
                  </span>
                  <div className="mt-1 flex items-end gap-1.5 rounded-t-sm border-x border-t border-garis px-2 pb-1 pt-1.5">
                    {k.suku.map((s) => (
                      <div key={s.angka.toString()} className="flex flex-col items-center">
                        <span className="tabular font-mono text-label text-ink-lirih">
                          {s.faktor === 1n ? s.cacah.toString() : `${s.cacah} × ${bertitik(s.faktor)}`}
                        </span>
                        <span lang="id" className="mt-0.5 rounded-t-sm border-x border-t border-garis bg-tint/50 px-2 py-1 text-kecil text-ink">
                          {s.kata}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <span lang="id" className="rounded-t-sm border-x border-t border-garis bg-tint/50 px-2 py-1 text-kecil text-ink">
                  {k.suku[0]?.kata ?? ''}
                </span>
              )}

              {/* Kata skala membawa pengalinya sendiri. */}
              <div className="flex flex-col items-center">
                <span className="tabular font-mono text-label text-bank">× {bertitik(lingkup.pengali)}</span>
                <span lang="id" className="mt-0.5 rounded-t-sm border-x border-t border-bank/60 bg-bank/[0.06] px-2 py-1 text-kecil text-bank">
                  {k.skalaKata}
                </span>
              </div>
            </div>

            {/*
              Bentuk keliru: pengali dikira hanya kena suku terdekatnya.
              Dicoret dan void, sama seperti bentuk naif di Uraian — merah di
              sini menandai jawaban yang salah, bukan penolakan, tetapi
              justru itulah tepatnya arti void untuk baris ini.
            */}
            <p className="tabular mt-2 font-mono text-kecil text-void line-through decoration-void/50">
              {bertitik(lingkup.keliru)}
            </p>
          </div>
        );
      })}
    </figure>
  );
}

function bertitik(n: bigint): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
