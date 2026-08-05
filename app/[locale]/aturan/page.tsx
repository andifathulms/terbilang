import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { format, SITASI_OPSI } from '@/lib';
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
      <span className="tabular font-mono text-sm text-ink/65">{masukan}</span>

      <span className="min-w-0">
        {hasil.type === 'ok' ? (
          <span className="block break-words font-display text-lg leading-snug text-bank">
            {hasil.nilai}
          </span>
        ) : (
          <span className="flex flex-wrap items-baseline gap-2">
            <span className="text-sm text-void">{hasil.galat.pesan}</span>
            <span className="font-mono text-[0.6rem] uppercase tracking-widest text-void/60">
              {hasil.galat.type}
            </span>
          </span>
        )}

        {contoh.keliru ? (
          <span className="mt-1 block text-xs text-ink/45">
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
        <h1 className="font-display text-3xl">{t.aturan.judul}</h1>
        <p className="text-sm leading-relaxed text-ink/70">{t.aturan.ringkas}</p>
      </header>

      <div className="gap-10 lg:grid lg:grid-cols-[13rem_minmax(0,1fr)]">
        <aside className="mb-10 lg:mb-0">
          <DaftarIsi pokok={pokok} judul={t.aturan.daftarIsi} />
        </aside>

        <div className="min-w-0 space-y-8">
          {ATURAN.map((a) => (
            <section key={a.kunci} id={a.kunci} className="lembar scroll-mt-24 overflow-hidden">
              <div className="space-y-3 p-5 sm:p-6">
                <h2 className="font-display text-xl">{a.judul[lokal]}</h2>
                <p className="max-w-2xl text-sm leading-relaxed text-ink/80">{a.isi[lokal]}</p>
                <p className="inline-flex rounded-full border border-guilloche/70 px-2.5 py-1 text-[0.7rem] text-ink/55">
                  {t.aturan.sumber}: {a.sumber}
                </p>
              </div>

              <ul className="divide-y divide-guilloche/50 border-t border-guilloche/60 bg-tint/40">
                {a.contoh.map((c) => (
                  <Baris key={String(c.masukan)} contoh={c} kelirul={t.aturan.keliru} />
                ))}
              </ul>
            </section>
          ))}

          <section id="varian" className="lembar scroll-mt-24 overflow-hidden">
            <div className="space-y-2 p-5 sm:p-6">
              <h2 className="font-display text-xl">{t.aturan.varian}</h2>
              <p className="max-w-2xl text-sm leading-relaxed text-ink/80">
                {t.aturan.varianRingkas}
              </p>
            </div>

            <div className="divide-y divide-guilloche/50 border-t border-guilloche/60 bg-tint/40">
              {SITASI_OPSI.map((o) => (
                <div key={o.kunci} className="space-y-3 p-5 sm:p-6">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <code className="font-mono text-xs text-bank">{o.kunci}</code>
                    <h3 className="text-sm font-medium">{o.judul}</h3>
                    <span className="text-[0.7rem] text-ink/45">
                      {t.aturan.bawaan}: {o.bawaan}
                    </span>
                  </div>

                  <dl className="space-y-2.5">
                    {o.pilihan.map((p) => (
                      <div key={p.nilai} className="grid gap-1 sm:grid-cols-[12rem_1fr] sm:gap-4">
                        <dt className="font-display text-bank">{p.contoh}</dt>
                        <dd className="text-xs leading-relaxed text-ink/70">
                          {p.dasar} <span className="text-ink/45">— {p.sumber}</span>
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
