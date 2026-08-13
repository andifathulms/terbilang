import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { format, SITASI_OPSI } from '@/lib';
import { BandingVarian } from '../../../components/BandingVarian';
import { LewatNumber } from '../../../components/cheque/LewatNumber';
import { DaftarIsi } from '../../../components/kerangka/DaftarIsi';
import { ATURAN, type Contoh } from '../../../data/aturan';
import { KAMUS, LOKAL, lokalSah, type Lokal } from '../../kamus';

export function generateStaticParams() {
  return LOKAL.map((locale) => ({ locale }));
}

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const t = KAMUS[lokalSah(params.locale) ? params.locale : 'id'];
  return { title: t.aturan.judul, description: t.aturan.ringkas };
}

/**
 * Contoh dibentuk oleh pustaka saat halaman dibangun, termasuk contoh yang
 * memang ditolak — penolakannya ditampilkan sebagai penolakan, bukan
 * disembunyikan. Bentuk keliru berdampingan dengan bentuk benar supaya
 * bedanya terbaca dalam satu tarikan mata.
 */
function Baris({ contoh, kelirul }: { contoh: Contoh; kelirul: string }) {
  const hasil = format(contoh.masukan);
  const masukan =
    typeof contoh.masukan === 'bigint'
      ? contoh.masukan.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
      : contoh.masukan;

  return (
    <li className="grid gap-x-4 gap-y-1 px-4 py-3 sm:grid-cols-[10rem_1fr] sm:px-5">
      <span className="tabular font-mono text-dasar text-ink-sedang">{masukan}</span>

      <span className="min-w-0">
        {hasil.type === 'ok' ? (
          <span lang="id" className="block break-words font-display text-sedang text-bank">
            {hasil.nilai}
          </span>
        ) : (
          <span className="flex flex-wrap items-baseline gap-2">
            <span className="text-dasar text-void">{hasil.galat.pesan}</span>
            <span className="font-mono text-label uppercase tracking-widest text-void">
              {hasil.galat.type}
            </span>
          </span>
        )}

        {contoh.keliru ? (
          <span className="mt-1 block text-kecil text-ink-lirih">
            {kelirul}:{' '}
            <span className="line-through decoration-void/60">{contoh.keliru}</span>
          </span>
        ) : null}
      </span>
    </li>
  );
}

export default function Aturan({ params }: { params: { locale: string } }) {
  if (!lokalSah(params.locale)) notFound();
  const lokal: Lokal = params.locale;
  const t = KAMUS[lokal];

  const pokok = [
    ...ATURAN.map((a) => ({ kunci: a.kunci, judul: a.judul[lokal] })),
    { kunci: 'varian', judul: t.aturan.varian },
  ];

  return (
    <div className="space-y-10">
      <header className="max-w-2xl space-y-2">
        <h1 className="font-display text-judul">{t.aturan.judul}</h1>
        <p className="text-dasar text-ink-sedang">{t.aturan.ringkas}</p>
      </header>

      <div className="gap-10 lg:grid lg:grid-cols-[13rem_minmax(0,1fr)]">
        <aside className="mb-10 lg:mb-0">
          <DaftarIsi pokok={pokok} judul={t.aturan.daftarIsi} />
        </aside>

        <div className="min-w-0 space-y-8">
          {ATURAN.map((a) => (
            <section
              key={a.kunci}
              id={a.kunci}
              tabIndex={-1}
              className="lembar scroll-mt-24 overflow-hidden"
            >
              <div className="space-y-3 p-5 sm:p-6">
                <h2 className="font-display text-besar">{a.judul[lokal]}</h2>
                <p className="max-w-2xl text-dasar text-ink-sedang">{a.isi[lokal]}</p>
                <p className="inline-flex rounded-full border border-garis px-2.5 py-1 text-kecil text-ink-lirih">
                  {t.aturan.sumber}: {a.sumber}
                </p>
              </div>

              <ul className="divide-y divide-guilloche/50 border-t border-guilloche/60 bg-tint/40">
                {a.contoh.map((c) => (
                  <Baris key={String(c.masukan)} contoh={c} kelirul={t.aturan.keliru} />
                ))}
              </ul>

              {/* Peragaan diletakkan pada aturannya, bukan di halaman lain. */}
              {a.kunci === 'presisi' ? (
                <LewatNumber
                  nilai={9_007_199_254_740_993n}
                  labelUtuh={t.aturan.presisiUtuh}
                  labelNumber={t.aturan.presisiNumber}
                  catatan={t.aturan.presisiCatatan}
                />
              ) : null}
            </section>
          ))}

          <section id="varian" tabIndex={-1} className="lembar scroll-mt-24 overflow-hidden">
            <div className="space-y-2 p-5 sm:p-6">
              <h2 className="font-display text-besar">{t.aturan.varian}</h2>
              <p className="max-w-2xl text-dasar text-ink-sedang">
                {t.aturan.varianRingkas}
              </p>
            </div>

            <div className="divide-y divide-guilloche/50 border-t border-guilloche/60 bg-tint/40">
              {SITASI_OPSI.map((o) => (
                <BandingVarian
                  key={o.kunci}
                  opsi={o}
                  labelMasukan={t.aturan.masukanSama}
                  labelBerubah={t.aturan.kataBerubah}
                  labelBawaan={t.aturan.bawaan}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
