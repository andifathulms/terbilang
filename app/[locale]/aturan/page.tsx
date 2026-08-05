import { notFound } from 'next/navigation';
import { format, SITASI_OPSI } from '@/lib';
import { ATURAN, type Contoh } from '../../../data/aturan';
import { KAMUS, LOKAL, lokalSah } from '../../kamus';

export function generateStaticParams() {
  return LOKAL.map((locale) => ({ locale }));
}

/**
 * Contoh dibentuk oleh pustaka saat halaman dibangun, termasuk contoh yang
 * memang ditolak — penolakannya ditampilkan sebagai penolakan, bukan
 * disembunyikan.
 */
function Baris({ contoh, kelirul }: { contoh: Contoh; kelirul: string }) {
  const hasil = format(contoh.masukan);
  const masukan =
    typeof contoh.masukan === 'bigint'
      ? contoh.masukan.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
      : contoh.masukan;

  return (
    <li className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-t border-guilloche/60 py-2">
      <span className="tabular w-40 font-mono text-sm text-ink/70">{masukan}</span>
      {hasil.type === 'ok' ? (
        <span className="font-display text-lg text-bank">{hasil.nilai}</span>
      ) : (
        <span className="text-sm text-void">{hasil.galat.pesan}</span>
      )}
      {contoh.keliru ? (
        <span className="text-xs text-ink/55">
          {kelirul}: <span className="line-through">{contoh.keliru}</span>
        </span>
      ) : null}
    </li>
  );
}

export default function Aturan({ params }: { params: { locale: string } }) {
  if (!lokalSah(params.locale)) notFound();
  const lokal = params.locale;
  const t = KAMUS[lokal];
  const kelirul = lokal === 'id' ? 'sering keliru' : 'common error';

  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <h1 className="font-display text-2xl">{t.aturan.judul}</h1>
        <p className="max-w-2xl text-sm text-ink/70">{t.aturan.ringkas}</p>
      </header>

      {ATURAN.map((a) => (
        <section key={a.kunci} id={a.kunci} className="space-y-3">
          <h2 className="font-display text-xl">{a.judul[lokal]}</h2>
          <p className="max-w-2xl text-sm leading-relaxed">{a.isi[lokal]}</p>
          <p className="text-xs text-ink/55">{a.sumber}</p>
          <ul>
            {a.contoh.map((c) => (
              <Baris key={String(c.masukan)} contoh={c} kelirul={kelirul} />
            ))}
          </ul>
        </section>
      ))}

      <section id="varian" className="space-y-4">
        <h2 className="font-display text-xl">
          {lokal === 'id' ? 'Varian tersitasi' : 'Cited variants'}
        </h2>
        <p className="max-w-2xl text-sm">
          {lokal === 'id'
            ? 'Setiap opsi menyebut pemakaian yang mendasari kedua sisinya. Tidak ada bawaan diam-diam.'
            : 'Every option names the usage behind both of its sides. There is no silent default.'}
        </p>

        <div className="space-y-5">
          {SITASI_OPSI.map((o) => (
            <div key={o.kunci} className="border-t border-guilloche/60 pt-3">
              <h3 className="text-sm font-medium">
                <code className="font-mono text-xs text-ink/70">{o.kunci}</code> — {o.judul}
              </h3>
              <p className="mt-1 text-xs text-ink/55">
                {lokal === 'id' ? 'bawaan' : 'default'}: {o.bawaan}
              </p>
              <dl className="mt-2 space-y-2">
                {o.pilihan.map((p) => (
                  <div key={p.nilai} className="grid gap-1 sm:grid-cols-[10rem_1fr]">
                    <dt className="font-display text-bank">{p.contoh}</dt>
                    <dd className="text-xs leading-snug text-ink/75">
                      {p.dasar} <span className="text-ink/50">— {p.sumber}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
