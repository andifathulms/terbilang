import Link from 'next/link';
import { format } from '@/lib';
import { KAMUS, lokalSah } from '../kamus';
import { notFound } from 'next/navigation';

/** Contoh dihitung di pustaka, bukan di komponen. */
const CONTOH: ReadonlyArray<readonly [bigint, string]> = [
  [1_000n, 'seribu, bukan satu ribu'],
  [1_000_001n, 'kelompok 000 tidak menghasilkan kata'],
  [10n ** 15n + 1n, 'di atas 2^53 masih utuh'],
];

export default function Beranda({ params }: { params: { locale: string } }) {
  if (!lokalSah(params.locale)) notFound();
  const t = KAMUS[params.locale];

  return (
    <div className="space-y-10">
      <section className="space-y-6">
        <p className="font-display text-jumlah text-bank">{t.beranda.sorot}</p>
        <div className="max-w-2xl space-y-4 text-[0.95rem] leading-relaxed">
          {t.beranda.paragraf.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </div>
        <Link
          href={`/${params.locale}/ubah/`}
          className="inline-block border border-bank px-4 py-2 text-sm text-bank hover:bg-bank hover:text-tint"
        >
          {t.beranda.ajakan} →
        </Link>
      </section>

      <section className="guilloche rounded border border-guilloche p-5">
        <ul className="space-y-3">
          {CONTOH.map(([nilai, catatan]) => {
            const hasil = format(nilai);
            return (
              <li key={nilai.toString()} className="flex flex-wrap items-baseline gap-x-3">
                <span className="tabular font-mono text-sm text-ink/70">
                  {nilai.toLocaleString('id-ID')}
                </span>
                <span className="font-display text-lg text-bank">
                  {hasil.type === 'ok' ? hasil.nilai : hasil.galat.pesan}
                </span>
                <span className="text-xs text-ink/60">{catatan}</span>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
