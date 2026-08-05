import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Navigasi, PengalihBahasa } from '../../components/kerangka/Navigasi';
import { TombolTema } from '../../components/kerangka/TombolTema';
import { KAMUS, LOKAL, lokalSah, type Lokal } from '../kamus';

export function generateStaticParams() {
  return LOKAL.map((locale) => ({ locale }));
}

export const dynamicParams = false;

export default function TataLetakLokal({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!lokalSah(params.locale)) notFound();
  const lokal: Lokal = params.locale;
  const t = KAMUS[lokal];

  const tautan = [
    { href: `/${lokal}/ubah/`, label: t.nav.ubah },
    { href: `/${lokal}/aturan/`, label: t.nav.aturan },
    { href: `/${lokal}/survei/`, label: t.nav.survei },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#isi"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-bank focus:px-3 focus:py-2 focus:text-sm focus:text-kertas"
      >
        {t.umum.lewatiKe}
      </a>

      <header className="sticky top-0 z-30 border-b border-guilloche/60 bg-tint/85 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center gap-4 px-5 sm:px-6">
          <Link
            href={`/${lokal}/`}
            className="flex shrink-0 items-baseline gap-1.5 font-display text-lg tracking-tight"
          >
            <span aria-hidden className="text-bank/70">
              #
            </span>
            {t.judulSitus}
          </Link>

          <Navigasi tautan={tautan} lokal={lokal} label={t.umum.navigasi} />

          <div className="ml-auto flex shrink-0 items-center gap-2">
            <PengalihBahasa lokal={lokal} label={t.umum.bahasa} />
            <TombolTema label={t.umum.tema} siang={t.umum.siang} malam={t.umum.malam} />
          </div>
        </div>
        {/* Pita mikroteks: pembatas tipis, sama seperti di tepi cek. */}
        <div aria-hidden className="mikroteks h-px opacity-60" />
      </header>

      <main id="isi" className="mx-auto w-full max-w-5xl flex-1 px-5 py-10 sm:px-6 sm:py-14">
        {children}
      </main>

      <footer className="mt-6 border-t border-guilloche/60">
        <div className="mx-auto grid max-w-5xl gap-6 px-5 py-8 text-xs text-ink/60 sm:grid-cols-3 sm:px-6">
          <p className="leading-relaxed">
            <span className="font-display text-sm text-ink/80">{t.judulSitus}</span>
            <br />
            {t.taglineSitus}
          </p>
          <p className="leading-relaxed">
            KBBI &amp; PUEBI/EYD
            <br />
            Badan Pengembangan dan Pembinaan Bahasa
          </p>
          <p className="flex flex-wrap gap-x-4 gap-y-1 sm:justify-end">
            <a
              href="https://www.npmjs.com/package/terbilang"
              className="underline decoration-guilloche underline-offset-4 transition-colors hover:text-bank"
            >
              npm
            </a>
            <a
              href="https://github.com/andifathulms/terbilang"
              className="underline decoration-guilloche underline-offset-4 transition-colors hover:text-bank"
            >
              GitHub
            </a>
            <span>MIT</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
