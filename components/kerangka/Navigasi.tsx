'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Lokal } from '../../app/kamus';

export interface Tautan {
  readonly href: string;
  readonly label: string;
}

/**
 * Navigasi utama. Halaman yang sedang dibuka ditandai garis tinta di bawahnya —
 * penanda yang sama dengan garis jumlah pada cek, sehingga bahasa visualnya
 * satu. Di layar sempit deretan ini menggulir mendatar alih-alih terlipat.
 */
export function Navigasi({
  tautan,
  lokal,
  label,
}: {
  tautan: readonly Tautan[];
  lokal: Lokal;
  label: string;
}) {
  const jalur = usePathname() ?? '';

  return (
    <nav aria-label={label} className="-mx-1 flex min-w-0 gap-1 overflow-x-auto">
      {tautan.map((l) => {
        const aktif = jalur === l.href || jalur === l.href.replace(/\/$/, '');
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={aktif ? 'page' : undefined}
            className={`relative shrink-0 whitespace-nowrap px-1.5 py-1 text-kendali transition-colors duration-200 ease-kertas sm:px-2 ${
              aktif ? 'text-ink' : 'text-ink-sedang hover:text-bank'
            }`}
          >
            {l.label}
            <span
              aria-hidden
              className={`absolute inset-x-1.5 -bottom-0.5 h-px origin-left bg-bank transition-transform duration-300 ease-kertas sm:inset-x-2 ${
                aktif ? 'scale-x-100' : 'scale-x-0'
              }`}
            />
          </Link>
        );
      })}
      <span className="sr-only">{lokal}</span>
    </nav>
  );
}

/** Alamat halaman yang sama dalam lokal yang lain. */
export function jalurLokalLain(jalur: string, lain: Lokal): string {
  const potong = jalur.replace(/^\/(id|en)/, '');
  return `/${lain}${potong === '' ? '/' : potong}`;
}

/** Pengalih bahasa: dua huruf, keadaan terpilih ditandai. */
export function PengalihBahasa({ lokal, label }: { lokal: Lokal; label: string }) {
  const jalur = usePathname() ?? `/${lokal}/`;
  const lain: Lokal = lokal === 'id' ? 'en' : 'id';

  return (
    <Link
      href={jalurLokalLain(jalur, lain)}
      aria-label={`${label}: ${lain.toUpperCase()}`}
      className="flex h-8 items-center rounded-full border border-garis px-2.5 text-label text-ink-lirih transition-colors duration-200 ease-kertas hover:border-bank hover:text-bank"
    >
      <span className="text-ink">{lokal.toUpperCase()}</span>
      <span aria-hidden className="px-1 text-guilloche">
        /
      </span>
      <span>{lain.toUpperCase()}</span>
    </Link>
  );
}
