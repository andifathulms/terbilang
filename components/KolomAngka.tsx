'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import { geserSkala, letakKursor, normalkan, pentingSebelum, tampilkan } from './masukan';

/**
 * Kolom angka. Titik ribuan dipasang saat mengetik dan kursor dikembalikan ke
 * tempatnya, supaya menyisipkan digit di tengah tidak melempar kursor ke ujung.
 * Panah atas dan bawah menggeser besaran satu tingkat — cara tercepat melihat
 * kata skala berganti.
 */
export function KolomAngka({
  nilai,
  ubah,
  label,
  petunjuk,
  kosongkan,
  pintas,
}: {
  nilai: string;
  ubah: (nilai: string) => void;
  label: string;
  petunjuk: string;
  kosongkan: string;
  pintas: string;
}) {
  const kolom = useRef<HTMLInputElement>(null);
  const penting = useRef<number | null>(null);
  const tampilan = tampilkan(nilai);

  // Kursor dikembalikan setelah teks tampilan berubah, bukan sebelumnya.
  useLayoutEffect(() => {
    const el = kolom.current;
    if (el === null || penting.current === null) return;
    const posisi = letakKursor(tampilan, penting.current);
    penting.current = null;
    el.setSelectionRange(posisi, posisi);
  }, [tampilan]);

  /*
   * Garis miring melompat ke kolom masukan, seperti pada kotak pencarian.
   *
   * Pintas beraksara tunggal tidak boleh menyalip pengetikan di tempat lain,
   * jadi ia mundur dari setiap kolom teks — termasuk yang bukan input atau
   * textarea: contenteditable dan apa pun yang menyatakan dirinya kotak teks
   * lewat role. Pembaca layar memakai aksara tunggal untuk melompat antar
   * unsur, dan tanpa penjagaan ini pintasnya ikut merebut penekanan itu.
   */
  useEffect(() => {
    function tekan(e: KeyboardEvent) {
      if (e.key !== '/' || e.metaKey || e.ctrlKey || e.altKey) return;
      const fokus = document.activeElement;
      if (fokus instanceof HTMLInputElement || fokus instanceof HTMLTextAreaElement) return;
      if (fokus instanceof HTMLElement && fokus.isContentEditable) return;
      const peran = fokus?.getAttribute('role');
      if (peran === 'textbox' || peran === 'searchbox' || peran === 'combobox') return;
      e.preventDefault();
      kolom.current?.focus();
      kolom.current?.select();
    }
    window.addEventListener('keydown', tekan);
    return () => window.removeEventListener('keydown', tekan);
  }, []);

  return (
    <div>
      <label className="block">
        <span className="label">{label}</span>

        <span className="relative mt-1.5 block">
          <input
            ref={kolom}
            value={tampilan}
            onChange={(e) => {
              penting.current = pentingSebelum(e.target.value, e.target.selectionStart ?? 0);
              ubah(normalkan(e.target.value));
            }}
            onKeyDown={(e) => {
              if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
              e.preventDefault();
              penting.current = null;
              ubah(geserSkala(nilai, e.key === 'ArrowUp' ? 'naik' : 'turun'));
            }}
            inputMode="decimal"
            autoComplete="off"
            spellCheck={false}
            aria-label={label}
            className="tabular w-full rounded-lembar border border-garis bg-kertas px-4 py-3 pr-11 font-mono text-sedang outline-none transition-colors duration-200 ease-kertas focus:border-bank"
          />

          {nilai === '' ? null : (
            <button
              type="button"
              onClick={() => {
                penting.current = null;
                ubah('');
                kolom.current?.focus();
              }}
              aria-label={kosongkan}
              title={kosongkan}
              className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-ink-lirih transition-colors duration-200 ease-kertas hover:bg-tint hover:text-void"
            >
              <span aria-hidden>×</span>
            </button>
          )}
        </span>
      </label>

      <p className="mt-2 text-kecil text-ink-lirih">
        {petunjuk} <span className="hidden sm:inline">{pintas}.</span>
      </p>
    </div>
  );
}
