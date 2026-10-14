'use client';

import { useEffect, useState } from 'react';

export interface Pokok {
  readonly kunci: string;
  readonly judul: string;
}

/**
 * Daftar isi yang menandai bagian yang sedang dibaca. Penandanya garis tinta
 * di sisi kiri — bahasa visual yang sama dengan penanda halaman di kepala.
 *
 * `bernomor` memberi nomor pada sekian pokok pertama — nomor yang sama yang
 * tertulis di kepala tiap aturan. Pokok sesudahnya (varian) tidak bernomor:
 * ia rujukan, bukan aturan berikutnya. Bilah di bawah menunjukkan sejauh mana
 * pembaca sudah sampai.
 */
export function DaftarIsi({
  pokok,
  judul,
  bernomor = 0,
}: {
  pokok: readonly Pokok[];
  judul: string;
  bernomor?: number;
}) {
  const [aktif, setAktif] = useState(pokok[0]?.kunci ?? '');

  useEffect(() => {
    const bagian = pokok
      .map((p) => document.getElementById(p.kunci))
      .filter((el): el is HTMLElement => el !== null);

    const pengamat = new IntersectionObserver(
      (masukan) => {
        const terlihat = masukan
          .filter((m) => m.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (terlihat !== undefined) setAktif(terlihat.target.id);
      },
      { rootMargin: '-88px 0px -65% 0px' },
    );

    bagian.forEach((el) => pengamat.observe(el));
    return () => pengamat.disconnect();
  }, [pokok]);

  const indeks = Math.max(0, pokok.findIndex((p) => p.kunci === aktif));
  const kemajuan = pokok.length === 0 ? 0 : (indeks + 1) / pokok.length;

  return (
    <nav aria-label={judul} className="lg:sticky lg:top-24">
      <p className="label mb-3">{judul}</p>
      <ul className="space-y-0.5 border-l border-guilloche/70">
        {pokok.map((p, i) => (
          <li key={p.kunci}>
            <a
              href={`#${p.kunci}`}
              aria-current={aktif === p.kunci ? 'location' : undefined}
              className={`-ml-px flex gap-2 border-l py-1.5 pl-3 text-kendali-kecil transition-colors duration-200 ease-kertas ${
                aktif === p.kunci
                  ? 'border-bank bg-bank/[0.06] text-bank'
                  : 'border-transparent text-ink-sedang hover:border-guilloche hover:text-ink'
              } ${i === bernomor && bernomor > 0 ? 'mt-2' : ''}`}
            >
              {i < bernomor ? (
                <span aria-hidden className="tabular w-3 shrink-0 font-mono text-ink-lirih">
                  {i + 1}
                </span>
              ) : null}
              {p.judul}
            </a>
          </li>
        ))}
      </ul>
      <div aria-hidden className="ml-3 mt-4 hidden h-0.5 overflow-hidden rounded-full bg-guilloche lg:block">
        <div
          className="h-full origin-left rounded-full bg-bank transition-transform duration-300 ease-kertas"
          style={{ transform: `scaleX(${kemajuan})` }}
        />
      </div>
    </nav>
  );
}
