'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import type { Lokal } from '../../app/kamus';

export interface Tautan {
  readonly href: string;
  readonly label: string;
}

function aktifDi(jalur: string, href: string): boolean {
  return jalur === href || jalur === href.replace(/\/$/, '');
}

/**
 * Navigasi bacaan di layar lebar. Halaman yang sedang dibuka ditandai garis
 * tinta di bawahnya — penanda yang sama dengan garis jumlah pada cek. Di
 * layar sempit deretan ini tidak tampil sama sekali; Menu yang mengambil
 * alih, supaya tidak ada tautan yang terpotong di bawah pengalih bahasa.
 */
export function Navigasi({
  tautan,
  label,
}: {
  tautan: readonly Tautan[];
  label: string;
}) {
  const jalur = usePathname() ?? '';

  return (
    <nav aria-label={label} className="hidden min-w-0 gap-1 md:flex">
      {tautan.map((l) => {
        const aktif = aktifDi(jalur, l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={aktif ? 'page' : undefined}
            className={`relative shrink-0 whitespace-nowrap px-2 py-1 text-kendali transition-colors duration-200 ease-kertas ${
              aktif ? 'text-ink' : 'text-ink-sedang hover:text-bank'
            }`}
          >
            {l.label}
            <span
              aria-hidden
              className={`absolute inset-x-2 -bottom-0.5 h-px origin-left bg-bank transition-transform duration-300 ease-kertas ${
                aktif ? 'scale-x-100' : 'scale-x-0'
              }`}
            />
          </Link>
        );
      })}
    </nav>
  );
}

/**
 * Pintu ke pengubah, tampil sebagai tombol di kepala halaman: alat utamanya
 * selalu satu ketukan jauhnya, dari halaman mana pun.
 */
export function TautanPengubah({ tautan }: { tautan: Tautan }) {
  const jalur = usePathname() ?? '';
  const aktif = aktifDi(jalur, tautan.href);

  return (
    <Link
      href={tautan.href}
      aria-current={aktif ? 'page' : undefined}
      className={`group hidden min-h-sasaran items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-1.5 text-kendali-kecil transition-colors duration-200 ease-kertas sm:inline-flex ${
        aktif
          ? 'border border-bank text-bank'
          : 'bg-bank text-kertas hover:bg-ink'
      }`}
    >
      {tautan.label}
      {aktif ? null : (
        <span
          aria-hidden
          className="transition-transform duration-200 ease-kertas group-hover:translate-x-0.5"
        >
          →
        </span>
      )}
    </Link>
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
      className="flex min-h-sasaran items-center rounded-full border border-garis px-2.5 py-1 text-label text-ink-lirih transition-colors duration-200 ease-kertas hover:border-bank hover:text-bank"
    >
      <span className="text-ink">{lokal.toUpperCase()}</span>
      <span aria-hidden className="px-1 text-guilloche">
        /
      </span>
      <span>{lain.toUpperCase()}</span>
    </Link>
  );
}

/**
 * Menu di layar sempit: lembar yang naik dari bawah, dalam jangkauan ibu
 * jari. Ia dipasang lewat portal ke <body> karena kepala halaman memakai
 * backdrop-blur, dan elemen fixed di dalam induk yang ber-backdrop-filter
 * diposisikan terhadap induk itu, bukan terhadap layar.
 *
 * Perilaku dialog modal ditulis tangan dan sengaja sedikit: fokus pindah ke
 * tautan pertama saat dibuka, Tab berputar di dalam lembar, Escape dan
 * ketukan di luar menutupnya, fokus kembali ke tombol Menu, dan gulir halaman
 * di belakangnya ditahan. Pindah halaman menutupnya juga.
 */
export function MenuPonsel({
  tautan,
  label,
  tutup,
  navigasi,
  children,
}: {
  tautan: readonly Tautan[];
  label: string;
  tutup: string;
  navigasi: string;
  /** Kendali tambahan di dasar lembar — pengalih bahasa dan tema. */
  children: ReactNode;
}) {
  const jalur = usePathname() ?? '';
  const [buka, setBuka] = useState(false);
  const [terpasang, setTerpasang] = useState(false);
  const tombol = useRef<HTMLButtonElement>(null);
  const lembar = useRef<HTMLDivElement>(null);

  useEffect(() => setTerpasang(true), []);
  useEffect(() => setBuka(false), [jalur]);

  useEffect(() => {
    if (!buka) return;
    const el = lembar.current;
    const sebelumnya = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    el?.querySelector<HTMLElement>('a, button')?.focus();

    function tekan(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setBuka(false);
        tombol.current?.focus();
        return;
      }
      if (e.key !== 'Tab' || el === null) return;
      const bisaFokus = [...el.querySelectorAll<HTMLElement>('a, button')];
      const pertama = bisaFokus[0];
      const terakhir = bisaFokus[bisaFokus.length - 1];
      if (pertama === undefined || terakhir === undefined) return;
      if (e.shiftKey && document.activeElement === pertama) {
        e.preventDefault();
        terakhir.focus();
      } else if (!e.shiftKey && document.activeElement === terakhir) {
        e.preventDefault();
        pertama.focus();
      }
    }

    window.addEventListener('keydown', tekan);
    return () => {
      document.body.style.overflow = sebelumnya;
      window.removeEventListener('keydown', tekan);
    };
  }, [buka]);

  function tutupMenu() {
    setBuka(false);
    tombol.current?.focus();
  }

  return (
    <>
      <button
        ref={tombol}
        type="button"
        aria-expanded={buka}
        aria-haspopup="dialog"
        onClick={() => setBuka(true)}
        className="flex min-h-sasaran items-center gap-2 rounded-full border border-garis px-3 py-1 text-kendali-kecil text-ink-sedang transition-colors duration-200 ease-kertas hover:border-bank hover:text-bank md:hidden"
      >
        {label}
        <svg aria-hidden width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>

      {terpasang && buka
        ? createPortal(
            <div className="fixed inset-0 z-50 md:hidden">
              <div
                aria-hidden
                onClick={tutupMenu}
                className="animate-redup-masuk absolute inset-0 bg-hutan/60"
              />
              <div
                ref={lembar}
                role="dialog"
                aria-modal="true"
                aria-label={navigasi}
                className="animate-lembar-naik absolute inset-x-0 bottom-0 rounded-t-[1.25rem] border-t border-guilloche bg-kertas px-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-3 shadow-angkat"
              >
                <div aria-hidden className="mx-auto mb-3 h-1 w-10 rounded-full bg-guilloche" />
                <nav aria-label={navigasi}>
                  <ul className="divide-y divide-guilloche/70">
                    {tautan.map((l) => {
                      const aktif = aktifDi(jalur, l.href);
                      return (
                        <li key={l.href}>
                          <Link
                            href={l.href}
                            aria-current={aktif ? 'page' : undefined}
                            onClick={() => setBuka(false)}
                            className={`flex min-h-12 items-center justify-between py-3 font-display text-sedang ${
                              aktif ? 'text-bank' : 'text-ink'
                            }`}
                          >
                            {l.label}
                            <span aria-hidden className="text-kecil text-ink-lirih">
                              {aktif ? '●' : '→'}
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </nav>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">{children}</div>
                  <button
                    type="button"
                    onClick={tutupMenu}
                    className="min-h-sasaran rounded-full px-3 py-1 text-kendali-kecil text-ink-sedang underline decoration-garis underline-offset-4 hover:text-bank"
                  >
                    {tutup}
                  </button>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
