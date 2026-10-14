import type { Options } from '@/lib';
import type { Teks } from '../../app/kamus';
import { uraikan } from '../urai';

/**
 * Langkah-langkah antara sebuah bilangan, di sebelah bilangan itu sendiri.
 *
 * Situs ini menyatakan bahwa pengelompokan tiga angkalah algoritmanya, lalu
 * selama ini menggambar kelompoknya di sebelah jawabannya tanpa menunjukkan
 * yang menyambung keduanya. Yang hilang persis satu langkah: tiap kelompok
 * dieja sendiri, lalu diberi kata skalanya. Di sinilah langkah itu.
 *
 * Sitasi diletakkan pada barisnya masing-masing, bukan di kaki halaman:
 * peleburan se- disebut di kelompok tempat ia benar-benar bekerja, dan
 * penyaringan kelompok kosong disebut di kelompok yang runtuh.
 *
 * Penyaji murni. Seluruh kata, termasuk nilai antaranya, datang dari
 * format() lewat modul urai.
 */
export function Uraian({
  bulat,
  opsi,
  t,
  tumpuk = false,
  lingkup = false,
  naif = true,
}: {
  bulat: bigint;
  opsi: Options;
  t: Teks['urai'];
  /** Susun menurun, untuk kolom sempit di beranda. */
  tumpuk?: boolean;
  /** Tampilkan bacaan aritmetikanya. Dipakai di arah membaca balik. */
  lingkup?: boolean;
  /**
   * Sertakan bentuk naifnya di bawah. Pengubah mematikannya karena bentuk
   * keliru punya tabnya sendiri di sana (lihat BentukKeliru).
   */
  naif?: boolean;
}) {
  const u = uraikan(bulat, opsi);
  const bertitik = (n: bigint) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const adaLingkup = u.kelompok.some((k) => k.lingkup !== null);

  return (
    <figure className="m-0 space-y-ruang4">
      <div className="space-y-1">
        <h3 className="label">{t.judul}</h3>
        <p className="max-w-2xl text-kecil text-ink-sedang">{t.ringkas}</p>
      </div>

      <ol className="space-y-ruang3">
        {u.kelompok.map((k) => (
          <li
            key={`${k.kelompok.skala.nama}-${k.digit}`}
            className={`grid items-baseline gap-x-ruang4 gap-y-1 rounded-lembar border p-3 ${
              k.kosong ? 'border-guilloche bg-tint/40' : 'border-garis bg-kertas/60'
            } ${tumpuk ? '' : 'sm:grid-cols-[7rem_1fr]'}`}
          >
            <div className="flex items-baseline gap-2">
              <span
                className={`tabular font-mono text-dasar ${
                  k.kosong ? 'text-ink-lirih line-through decoration-void/50' : 'text-ink'
                }`}
              >
                {k.digit}
              </span>
              {k.skalaKata === '' ? null : (
                <span lang="id" className="text-label uppercase text-bank">
                  {k.skalaKata}
                </span>
              )}
            </div>

            {k.kosong ? (
              <p className="text-kecil text-ink-sedang">
                {t.kosong}{' '}
                <span className="text-ink-lirih">— {t.kosongSumber}</span>
              </p>
            ) : (
              <div className="min-w-0 space-y-1">
                {/* Isi kelompok, dibelah menurut nilai tempat. */}
                {k.suku.length > 1 ? (
                  <p className="flex flex-wrap items-baseline gap-x-2 text-kecil text-ink-sedang">
                    {k.suku.map((s, i) => (
                      <span key={s.angka.toString()}>
                        {i > 0 ? <span className="text-ink-lirih">+ </span> : null}
                        <span className="tabular font-mono">{s.angka.toString()}</span>{' '}
                        <span lang="id" className="text-ink">
                          {s.kata}
                        </span>
                      </span>
                    ))}
                  </p>
                ) : null}

                <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  <span className="label">{t.kolomSendiri}</span>
                  <span lang="id" className="font-display text-dasar text-ink">
                    {k.kataSendiri}
                  </span>
                </p>

                <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  <span className="label">{t.kolomDiTempat}</span>
                  <span lang="id" className="font-display text-sedang text-bank">
                    {k.kataDiTempat}
                  </span>
                  {k.lebur ? (
                    <span className="text-kecil text-ink-sedang">
                      {t.lebur} <span className="text-ink-lirih">— {t.leburSumber}</span>
                    </span>
                  ) : null}
                </p>

                {/*
                  Bacaan aritmetikanya, di kelompok tempat lingkupnya benar-benar
                  bisa disalahpahami. Kurungnya menunjukkan sampai mana kata
                  skala menjangkau ke belakang.
                */}
                {lingkup && k.lingkup !== null ? (
                  <p className="tabular flex flex-wrap items-baseline gap-x-2 font-mono text-kecil text-ink-sedang">
                    ({k.lingkup.suku.join(' + ')}) × {bertitik(k.lingkup.pengali)} ={' '}
                    <span className="text-bank">{bertitik(k.lingkup.benar)}</span>
                  </p>
                ) : null}

                {/* Kenapa belasan tidak dibelah lagi, disebut di tempat ia berhenti. */}
                {k.suku.length === 1 && k.kelompok.nilai > 9n && k.kelompok.nilai < 20n ? (
                  <p className="text-kecil text-ink-lirih">{t.belasan}</p>
                ) : null}
              </div>
            )}
          </li>
        ))}
      </ol>

      {/*
        Lingkup pengali: bagian tersulit arah balik, dan selama ini tidak
        ditampilkan di mana pun. Bentuk kelirunya dihitung dari suku yang sama
        — pengali dikira hanya kena kata terdekatnya — bukan dikarang.
      */}
      {lingkup && adaLingkup ? (
        <div className="space-y-1 rounded-lembar border border-garis bg-tint/40 p-3">
          <p className="label">{t.lingkupJudul}</p>
          <p className="max-w-2xl text-kecil text-ink-sedang">{t.lingkupIsi}</p>
          {u.kelompok
            .filter((k) => k.lingkup !== null)
            .map((k) => (
              <p key={k.digit} className="text-kecil text-ink-sedang">
                {t.lingkupKeliru}{' '}
                <span className="tabular font-mono text-void line-through decoration-void/50">
                  {bertitik(k.lingkup?.keliru ?? 0n)}
                </span>
              </p>
            ))}
        </div>
      ) : null}

      <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1 border-t border-guilloche/60 pt-ruang3">
        <span className="label">{t.gabung}</span>
        <span lang="id" className="font-display text-sedang text-bank">
          {u.benar}
        </span>
      </p>

      {naif ? <BentukKeliru bulat={bulat} opsi={opsi} t={t} /> : null}

      {/* Jujur soal yang disederhanakan: uraian ini bilangannya saja. */}
      <figcaption className="text-kecil text-ink-lirih">{t.sederhana}</figcaption>
    </figure>
  );
}

/**
 * Bentuk keliru diperagakan dari uraian yang sama, bukan dikarang: rangkai
 * kolom "dieja sendiri" dan sebut juga kelompok yang nol. Hanya kalimatnya
 * yang merah void dan dicoret, karena kalimat itulah yang keliru; kotaknya
 * netral. Kotak bertint merah di bawah setiap hasil yang benar terbaca
 * seperti galat pada jawaban yang tidak salah.
 *
 * Mengembalikan null bila bilangannya tidak punya kelompok kosong maupun
 * peleburan se- — bentuk naifnya sama dengan jawabannya.
 */
export function BentukKeliru({
  bulat,
  opsi,
  t,
}: {
  bulat: bigint;
  opsi: Options;
  t: Teks['urai'];
}) {
  const u = uraikan(bulat, opsi);
  if (!u.adaKosong && !u.adaLebur) return null;

  return (
    <div className="rounded-lembar border border-garis bg-tint/40 p-4">
      <p className="label">{t.naifJudul}</p>
      <p lang="id" className="mt-1.5 font-display text-sedang text-void line-through decoration-void/60">
        {u.naif}
      </p>
      <p className="mt-2 max-w-2xl text-kecil text-ink-sedang">{t.naifIsi}</p>
    </div>
  );
}
