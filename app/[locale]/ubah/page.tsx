import { notFound } from 'next/navigation';
import { Konverter } from '../../../components/Konverter';
import { KAMUS, LOKAL, lokalSah } from '../../kamus';

export function generateStaticParams() {
  return LOKAL.map((locale) => ({ locale }));
}

export default function Ubah({ params }: { params: { locale: string } }) {
  if (!lokalSah(params.locale)) notFound();
  const t = KAMUS[params.locale];

  return (
    <div className="space-y-8">
      <h1 className="font-display text-2xl">{t.ubah.judul}</h1>
      <Konverter t={t.ubah} galat={t.galat} />
    </div>
  );
}
