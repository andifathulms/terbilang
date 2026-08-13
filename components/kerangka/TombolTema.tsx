'use client';

import { useEffect, useState } from 'react';

export type Tema = 'siang' | 'malam';

export const KUNCI_TEMA = 'terbilang:tema';

/**
 * Siang adalah lembar cek yang baru dicetak; malam adalah salinan karbonnya.
 * Pilihan disimpan di localStorage dan dipasang lebih dulu oleh skrip kecil di
 * <head> supaya tidak ada kedipan tema salah sebelum React menyala.
 */
export function TombolTema({ label, siang, malam }: { label: string; siang: string; malam: string }) {
  const [tema, setTema] = useState<Tema>('siang');
  const [siap, setSiap] = useState(false);

  useEffect(() => {
    const dipasang = document.documentElement.dataset.tema;
    setTema(dipasang === 'malam' ? 'malam' : 'siang');
    setSiap(true);
  }, []);

  function tukar() {
    const berikut: Tema = tema === 'siang' ? 'malam' : 'siang';
    setTema(berikut);
    document.documentElement.dataset.tema = berikut;
    try {
      window.localStorage.setItem(KUNCI_TEMA, berikut);
    } catch {
      // Mode privat menolak menulis; tema tetap berlaku untuk sesi ini.
    }
  }

  return (
    <button
      type="button"
      onClick={tukar}
      aria-label={`${label}: ${tema === 'siang' ? siang : malam}`}
      title={`${label}: ${tema === 'siang' ? siang : malam}`}
      className="group flex h-8 w-8 items-center justify-center rounded-full border border-garis text-ink-lirih transition-colors duration-200 ease-kertas hover:border-bank hover:text-bank"
    >
      <span aria-hidden className={siap ? '' : 'opacity-0'}>
        {tema === 'siang' ? <Matahari /> : <Bulan />}
      </span>
    </button>
  );
}

function Matahari() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="12" r="4.2" />
      <path
        strokeLinecap="round"
        d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.2 5.2l1.4 1.4M17.4 17.4l1.4 1.4M18.8 5.2l-1.4 1.4M6.6 17.4l-1.4 1.4"
      />
    </svg>
  );
}

function Bulan() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20 14.5A8.2 8.2 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z"
      />
    </svg>
  );
}

/**
 * Skrip yang berjalan sebelum cat pertama. Ditulis sebagai string karena harus
 * masuk ke <head> apa adanya, dan sengaja sekecil mungkin.
 */
export const SKRIP_TEMA = `try{var t=localStorage.getItem('${KUNCI_TEMA}');if(!t){t=matchMedia('(prefers-color-scheme: dark)').matches?'malam':'siang'}document.documentElement.dataset.tema=t}catch(e){}`;
