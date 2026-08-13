import { format, type Options, type OpsiTersitasi } from '@/lib';
import { MASUKAN_VARIAN } from '../data/aturan';
import { jumlahBerubah, tandaiBeda } from './beda';

/**
 * Kedua — kadang ketiga — sisi sebuah varian, dijalankan atas masukan yang
 * sama dan ditampilkan berdampingan.
 *
 * Sebelumnya tiap sisi membawa contohnya sendiri sebagai teks yang ditulis
 * tangan, dan tiap sisi memakai bilangan yang berbeda pula, sehingga tidak ada
 * yang benar-benar bisa dibandingkan: pembaca harus memindah sakelar bolak
 * balik dan menyimpan bentuk yang satu di kepala sambil membaca yang lain.
 * Sakelar, secara bentuk, selalu menyembunyikan sisi yang tidak sedang dipilih
 * — padahal janjinya adalah kedua sisi disebutkan.
 *
 * Keluarannya kini dihitung pustaka saat halaman dibangun, seperti contoh di
 * bagian aturan. Itu menutup satu-satunya tempat di situs ini yang contohnya
 * masih dinyatakan alih-alih dijalankan, dan berarti contoh yang basi akan
 * ketahuan lewat rangkaian ujinya, bukan lewat mata pembaca.
 *
 * Kata yang berubah ditandai dengan biru bank; sisanya mundur ke tinta yang
 * lebih redup. Merah void tidak dipakai di sini — ia tetap khusus penolakan,
 * dan berpindah varian bukan kesalahan. Hitungan katanya menunjukkan besar
 * kecilnya masing-masing pilihan: `ejaanMiliar` menggeser dua kata, `sen`
 * menyusun ulang seluruh ekor kalimat, dan keduanya tampak setara selama
 * hanya berupa dua sakelar yang bersebelahan.
 */

/** Nilai opsi ditulis sebagai teks di data sitasi; kembalikan ke tipe aslinya. */
function nilaiOpsi(teks: string): Options[keyof Options] {
  if (teks === 'true') return true;
  if (teks === 'false') return false;
  return teks as Options[keyof Options];
}

function angkaBertitik(masukan: bigint | string): string {
  return typeof masukan === 'bigint'
    ? masukan.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    : masukan;
}

export function BandingVarian({
  opsi,
  labelMasukan,
  labelBerubah,
  labelBawaan,
}: {
  opsi: OpsiTersitasi;
  labelMasukan: string;
  labelBerubah: string;
  labelBawaan: string;
}) {
  const uji = MASUKAN_VARIAN[opsi.kunci];

  /* Semua sisi dihitung lebih dulu supaya yang pertama bisa jadi pembanding. */
  const sisi = opsi.pilihan.map((p) => ({
    pilihan: p,
    hasil: format(uji.masukan, { ...uji.dasar, [opsi.kunci]: nilaiOpsi(p.nilai) }),
  }));

  const pertama = sisi[0]?.hasil;
  const dasar = pertama !== undefined && pertama.type === 'ok' ? pertama.nilai : '';

  return (
    <div className="space-y-ruang4 p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <code className="font-mono text-kecil text-bank">{opsi.kunci}</code>
        <h3 className="text-dasar font-medium">{opsi.judul}</h3>
        <span className="text-kecil text-ink-lirih">
          {labelBawaan}: {opsi.bawaan}
        </span>
      </div>

      {/* Masukan disebut sekali, di atas semua sisi — itulah yang membuat
          deretan di bawahnya jadi perbandingan dan bukan daftar contoh. */}
      <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className="label">{labelMasukan}</span>
        <span className="tabular font-mono text-dasar text-ink">
          {angkaBertitik(uji.masukan)}
        </span>
      </p>

      <dl className="space-y-ruang4">
        {sisi.map(({ pilihan, hasil }, i) => {
          const tanda = hasil.type === 'ok' ? tandaiBeda(dasar, hasil.nilai) : [];
          const berubah = jumlahBerubah(tanda);

          return (
            <div key={pilihan.nilai} className="grid gap-1 sm:grid-cols-[8rem_1fr] sm:gap-4">
              <dt className="flex items-baseline gap-2 sm:flex-col sm:gap-0.5">
                <code className="font-mono text-kecil text-ink-sedang">{pilihan.nilai}</code>
                {/* Sisi pertama adalah pembandingnya, jadi tidak punya hitungan. */}
                {i === 0 ? null : (
                  <span className="text-kecil text-ink-lirih">
                    {berubah} {labelBerubah}
                  </span>
                )}
              </dt>

              <dd className="min-w-0 space-y-1">
                {hasil.type === 'ok' ? (
                  <p className="flex flex-wrap gap-x-[0.3em] break-words font-display text-sedang">
                    {tanda.map((t, k) => (
                      <span
                        key={`${k}-${t.kata}`}
                        className={t.berubah ? 'text-bank' : 'text-ink-sedang'}
                      >
                        {t.kata}
                      </span>
                    ))}
                  </p>
                ) : (
                  /* Penolakan ditampilkan sebagai penolakan, dengan merah void
                     yang memang hanya untuk itu. */
                  <p className="flex flex-wrap items-baseline gap-2">
                    <span className="text-dasar text-void">{hasil.galat.pesan}</span>
                    <span className="font-mono text-label uppercase text-void">
                      {hasil.galat.type}
                    </span>
                  </p>
                )}

                <p className="text-kecil text-ink-sedang">
                  {pilihan.dasar} <span className="text-ink-lirih">— {pilihan.sumber}</span>
                </p>
              </dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}
