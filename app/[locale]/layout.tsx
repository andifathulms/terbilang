import Link from 'next/link';
import { notFound } from 'next/navigation';
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
  const lain: Lokal = lokal === 'id' ? 'en' : 'id';

  const tautan = [
    { href: `/${lokal}/ubah/`, label: t.nav.ubah },
    { href: `/${lokal}/aturan/`, label: t.nav.aturan },
    { href: `/${lokal}/survei/`, label: t.nav.survei },
  ];

  return (
    <div className="min-h-screen">
      <header className="border-b border-guilloche">
        <div className="mx-auto flex max-w-4xl flex-wrap items-baseline gap-x-6 gap-y-2 px-6 py-5">
          <Link href={`/${lokal}/`} className="font-display text-xl tracking-tight">
            {t.judulSitus}
          </Link>
          <nav className="flex gap-5 text-sm">
            {tautan.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-bank">
                {l.label}
              </Link>
            ))}
          </nav>
          <Link
            href={`/${lain}/`}
            className="ml-auto text-xs uppercase tracking-widest text-ink/60 hover:text-bank"
          >
            {lain}
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">{children}</main>

      <footer className="mx-auto max-w-4xl px-6 pb-12 pt-6 text-xs text-ink/60">
        <p>
          {t.taglineSitus} · KBBI &amp; PUEBI/EYD ·{' '}
          <a
            href="https://www.npmjs.com/package/terbilang"
            className="underline underline-offset-2 hover:text-bank"
          >
            npm
          </a>
        </p>
      </footer>
    </div>
  );
}
