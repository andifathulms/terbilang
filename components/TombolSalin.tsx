'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Menyalin ke papan klip dengan umpan balik yang lekas hilang. Peramban lama
 * tanpa clipboard API cukup diam saja; tidak ada gunanya memarahi pengguna
 * untuk sesuatu yang bisa mereka pilih dan salin sendiri.
 */
export function TombolSalin({
  teks,
  label,
  labelTersalin,
  utama = false,
}: {
  teks: string;
  label: string;
  labelTersalin: string;
  utama?: boolean;
}) {
  const [tersalin, setTersalin] = useState(false);
  const jam = useRef<number>();

  useEffect(() => () => window.clearTimeout(jam.current), []);

  async function salin() {
    try {
      await navigator.clipboard.writeText(teks);
    } catch {
      return;
    }
    setTersalin(true);
    window.clearTimeout(jam.current);
    jam.current = window.setTimeout(() => setTersalin(false), 1600);
  }

  return (
    <button
      type="button"
      onClick={salin}
      className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-kecil transition-all duration-200 ease-kertas ${
        utama
          ? 'bg-bank text-kertas hover:-translate-y-0.5'
          : 'border border-garis text-ink-sedang hover:border-bank hover:text-bank'
      }`}
    >
      <span
        aria-hidden
        className={`transition-transform duration-200 ease-kertas ${tersalin ? 'scale-110' : ''}`}
      >
        {tersalin ? '✓' : '⧉'}
      </span>
      <span aria-live="polite">{tersalin ? labelTersalin : label}</span>
    </button>
  );
}
