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
}: {
  bulat: bigint;
  opsi: Options;
  t: Teks['urai'];
  /** Susun menurun, untuk kolom sempit di beranda. */
  tumpuk?: boolean;
}) {
  const u = uraikan(bulat, opsi);

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

                {/* Kenapa belasan tidak dibelah lagi, disebut di tempat ia berhenti. */}
                {k.suku.length === 1 && k.kelompok.nilai > 9n && k.kelompok.nilai < 20n ? (
                  <p className="text-kecil text-ink-lirih">{t.belasan}</p>
                ) : null}
              </div>
            )}
          </li>
        ))}
      </ol>

      <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1 border-t border-guilloche/60 pt-ruang3">
        <span className="label">{t.gabung}</span>
        <span lang="id" className="font-display text-sedang text-bank">
          {u.benar}
        </span>
      </p>

      {/*
        Bentuk keliru diperagakan dari uraian yang sama, bukan dikarang:
        rangkai kolom "dieja sendiri" dan sebut juga kelompok yang nol.
        Ditandai merah void karena ia memang keliru, dan dicoret supaya tidak
        pernah tertukar dengan jawaban.
      */}
      {u.adaKosong || u.adaLebur ? (
        <div className="rounded-lembar border border-void/40 bg-void/[0.06] p-3">
          <p className="label text-void">{t.naifJudul}</p>
          <p lang="id" className="mt-1 font-display text-dasar text-void line-through decoration-void/50">
            {u.naif}
          </p>
          <p className="mt-1.5 text-kecil text-ink-sedang">{t.naifIsi}</p>
        </div>
      ) : null}

      {/* Jujur soal yang disederhanakan: uraian ini bilangannya saja. */}
      <figcaption className="text-kecil text-ink-lirih">{t.sederhana}</figcaption>
    </figure>
  );
}
