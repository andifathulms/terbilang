import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Konverter } from '../../../components/Konverter';
import { KAMUS, LOKAL, lokalSah, type Lokal } from '../../kamus';
import { metaHalaman } from '../../meta';

export function generateStaticParams() {
  return LOKAL.map((locale) => ({ locale }));
}

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const lokal: Lokal = lokalSah(params.locale) ? params.locale : 'id';
  const t = KAMUS[lokal];
  return metaHalaman({ lokal, jalur: 'ubah', judul: t.ubah.judul, ringkas: t.ubah.ringkas });
}

export default function Ubah({ params }: { params: { locale: string } }) {
  if (!lokalSah(params.locale)) notFound();
  const lokal: Lokal = params.locale;
  const t = KAMUS[lokal];

  return (
    <div className="space-y-8">
      <header className="max-w-2xl space-y-2">
        <h1 className="font-display text-judul">{t.ubah.judul}</h1>
        <p className="text-dasar text-ink-sedang">{t.ubah.ringkas}</p>
      </header>

      <Konverter t={t.ubah} urai={t.urai} galat={t.galat} />
    </div>
  );
}
