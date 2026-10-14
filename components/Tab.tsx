'use client';

import { useId, useRef, useState, type ReactNode } from 'react';

export interface IsiTab {
  readonly kunci: string;
  readonly label: string;
  readonly isi: ReactNode;
}

/**
 * Tab dengan pola ARIA yang utuh: tablist, tab, tabpanel; panah kiri/kanan,
 * Home dan End berpindah tab sekaligus memilihnya; hanya tab terpilih yang
 * ada di urutan Tab. Penandanya garis bank di bawah, sama dengan navigasi.
 *
 * Panel yang tidak terpilih tidak dirender sama sekali — isinya uraian yang
 * dihitung ulang setiap masukan berubah, dan tidak ada gunanya menghitung
 * yang tidak dilihat.
 */
export function Tab({ daftar, label }: { daftar: readonly IsiTab[]; label: string }) {
  const [pilih, setPilih] = useState(0);
  const awalan = useId();
  const tombol = useRef<(HTMLButtonElement | null)[]>([]);
  const aktif = Math.min(pilih, daftar.length - 1);
  const kini = daftar[aktif];

  function pindah(ke: number) {
    const i = (ke + daftar.length) % daftar.length;
    setPilih(i);
    tombol.current[i]?.focus();
  }

  return (
    <div>
      <div
        role="tablist"
        aria-label={label}
        className="flex gap-1 overflow-x-auto border-b border-guilloche"
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') pindah(aktif + 1);
          else if (e.key === 'ArrowLeft') pindah(aktif - 1);
          else if (e.key === 'Home') pindah(0);
          else if (e.key === 'End') pindah(daftar.length - 1);
          else return;
          e.preventDefault();
        }}
      >
        {daftar.map((d, i) => (
          <button
            key={d.kunci}
            ref={(el) => {
              tombol.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${awalan}-tab-${d.kunci}`}
            aria-selected={i === aktif}
            aria-controls={`${awalan}-panel-${d.kunci}`}
            tabIndex={i === aktif ? 0 : -1}
            onClick={() => setPilih(i)}
            className={`relative -mb-px shrink-0 whitespace-nowrap px-3 py-2.5 text-kendali-kecil transition-colors duration-200 ease-kertas ${
              i === aktif ? 'text-ink' : 'text-ink-sedang hover:text-bank'
            }`}
          >
            {d.label}
            <span
              aria-hidden
              className={`absolute inset-x-2 bottom-0 h-0.5 origin-left rounded-full bg-bank transition-transform duration-300 ease-kertas ${
                i === aktif ? 'scale-x-100' : 'scale-x-0'
              }`}
            />
          </button>
        ))}
      </div>

      {kini === undefined ? null : (
        <div
          role="tabpanel"
          id={`${awalan}-panel-${kini.kunci}`}
          aria-labelledby={`${awalan}-tab-${kini.kunci}`}
          tabIndex={0}
          className="pt-ruang5 focus-visible:outline-offset-4"
        >
          {kini.isi}
        </div>
      )}
    </div>
  );
}
