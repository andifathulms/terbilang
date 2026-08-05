'use client';

import { useEffect, useState } from 'react';

export interface Pokok {
  readonly kunci: string;
  readonly judul: string;
}

/**
 * Daftar isi yang menandai bagian yang sedang dibaca. Penandanya garis tinta
 * di sisi kiri — bahasa visual yang sama dengan penanda halaman di kepala.
 */
export function DaftarIsi({ pokok, judul }: { pokok: readonly Pokok[]; judul: string }) {
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

  return (
    <nav aria-label={judul} className="lg:sticky lg:top-24">
      <p className="label mb-3">{judul}</p>
      <ul className="space-y-0.5 border-l border-guilloche/70">
        {pokok.map((p) => (
          <li key={p.kunci}>
            <a
              href={`#${p.kunci}`}
              aria-current={aktif === p.kunci ? 'true' : undefined}
              className={`-ml-px block border-l py-1 pl-3 text-xs transition-colors duration-200 ease-kertas ${
                aktif === p.kunci
                  ? 'border-bank text-bank'
                  : 'border-transparent text-ink/60 hover:border-guilloche hover:text-ink'
              }`}
            >
              {p.judul}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
