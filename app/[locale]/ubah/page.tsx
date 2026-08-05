import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Konverter } from '../../../components/Konverter';
import { KAMUS, LOKAL, lokalSah, type Lokal } from '../../kamus';

export function generateStaticParams() {
  return LOKAL.map((locale) => ({ locale }));
}

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const t = KAMUS[lokalSah(params.locale) ? params.locale : 'id'];
  return { title: t.ubah.judul, description: t.ubah.ringkas };
}

export default function Ubah({ params }: { params: { locale: string } }) {
  if (!lokalSah(params.locale)) notFound();
  const lokal: Lokal = params.locale;
  const t = KAMUS[lokal];

  return (
    <div className="space-y-8">
      <header className="max-w-2xl space-y-2">
        <h1 className="font-display text-3xl">{t.ubah.judul}</h1>
        <p className="text-sm leading-relaxed text-ink/70">{t.ubah.ringkas}</p>
      </header>

      <Konverter t={t.ubah} galat={t.galat} />
    </div>
  );
}
