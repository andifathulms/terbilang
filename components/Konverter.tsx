'use client';

import { useEffect, useMemo, useState } from 'react';
import { format, kelompokkan, OPSI_BAWAAN, parse, type Kelompok, type Options } from '@/lib';
import type { Teks } from '../app/kamus';
import { GarisJumlah } from './cheque/GarisJumlah';
import { KurungKelompok } from './cheque/KurungKelompok';
import { Penolakan } from './cheque/Penolakan';
import { PanelOpsi } from './PanelOpsi';

type Arah = 'angka' | 'kata';

/**
 * Tidak ada yang dihitung di komponen ini: seluruh nilai berasal dari pustaka.
 * Yang dikerjakan di sini hanya keadaan masukan, hash URL, dan tata letak.
 */
export function Konverter({ t, galat }: { t: Teks['ubah']; galat: Teks['galat'] }) {
  const [arah, setArah] = useState<Arah>('angka');
  const [angka, setAngka] = useState('1000001');
  const [kata, setKata] = useState('dua ratus lima puluh ribu');
  const [opsi, setOpsi] = useState<Options>(OPSI_BAWAAN);
  const [modeDokumen, setModeDokumen] = useState(false);
  const [tersalin, setTersalin] = useState(false);

  // Opsi tinggal di hash supaya konfigurasi bisa ditautkan apa adanya.
  useEffect(() => {
    const dariHash = bacaHash(window.location.hash);
    if (dariHash) setOpsi(dariHash);
  }, []);

  useEffect(() => {
    const hash = tulisHash(opsi);
    window.history.replaceState(null, '', hash === '' ? window.location.pathname : `#${hash}`);
  }, [opsi]);

  const hasilKata = useMemo(() => format(angka, opsi), [angka, opsi]);
  const hasilAngka = useMemo(() => parse(kata, opsi), [kata, opsi]);

  const kelompok: Kelompok[] = useMemo(() => {
    const bulat = bagianBulat(angka);
    return bulat === undefined ? [] : kelompokkan(bulat);
  }, [angka]);

  async function salin(teks: string) {
    await navigator.clipboard.writeText(teks);
    setTersalin(true);
    window.setTimeout(() => setTersalin(false), 1500);
  }

  return (
    <div className="space-y-8">
      <div className="flex gap-2">
        {(['angka', 'kata'] as const).map((a) => (
          <button
            key={a}
            type="button"
            onClick={() => setArah(a)}
            aria-pressed={arah === a}
            className={`border px-3 py-1.5 text-sm ${
              arah === a ? 'border-bank bg-bank text-tint' : 'border-guilloche hover:border-bank'
            }`}
          >
            {a === 'angka' ? `${t.labelAngka} → ${t.labelKata}` : `${t.labelKataKeAngka} → ${t.labelAngka}`}
          </button>
        ))}
      </div>

      {arah === 'angka' ? (
        <section className="space-y-5">
          <label className="block">
            <span className="text-[0.65rem] uppercase tracking-widest text-ink/60">
              {t.labelAngka}
            </span>
            <input
              value={angka}
              onChange={(e) => setAngka(e.target.value)}
              inputMode="decimal"
              spellCheck={false}
              aria-label={t.labelAngka}
              className="tabular mt-1 w-full border border-guilloche bg-transparent px-3 py-2 font-mono text-xl outline-none focus:border-bank"
            />
            <span className="mt-1 block text-xs text-ink/60">{t.petunjukAngka}</span>
          </label>

          {kelompok.length > 0 ? (
            <div className="space-y-1">
              <span className="text-[0.65rem] uppercase tracking-widest text-ink/60">
                {t.kelompok}
              </span>
              <KurungKelompok
                kelompok={kelompok}
                labelKosong={t.kosong}
                ejaan={opsi.ejaanMiliar}
              />
            </div>
          ) : null}

          {hasilKata.type === 'ok' ? (
            <div className="space-y-3">
              <GarisJumlah
                kata={hasilKata.nilai}
                modeDokumen={modeDokumen}
                label={t.labelKata}
              />
              <div className="flex flex-wrap items-center gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={modeDokumen}
                    onChange={(e) => setModeDokumen(e.target.checked)}
                    className="accent-bank"
                  />
                  {t.modeDokumen}
                </label>
                <button
                  type="button"
                  onClick={() =>
                    salin(modeDokumen ? `# ${hasilKata.nilai} #` : hasilKata.nilai)
                  }
                  className="border border-guilloche px-3 py-1 text-xs hover:border-bank"
                >
                  {tersalin ? t.tersalin : t.salin}
                </button>
              </div>
            </div>
          ) : (
            <Penolakan galat={hasilKata.galat} judul={galat[hasilKata.galat.type] ?? ''} />
          )}
        </section>
      ) : (
        <section className="space-y-5">
          <label className="block">
            <span className="text-[0.65rem] uppercase tracking-widest text-ink/60">
              {t.labelKataKeAngka}
            </span>
            <input
              value={kata}
              onChange={(e) => setKata(e.target.value)}
              spellCheck={false}
              aria-label={t.labelKataKeAngka}
              className="mt-1 w-full border border-guilloche bg-transparent px-3 py-2 font-display text-xl outline-none focus:border-bank"
            />
            <span className="mt-1 block text-xs text-ink/60">{t.petunjukKata}</span>
          </label>

          {hasilAngka.type === 'ok' ? (
            <div className="guilloche rounded-sm border border-guilloche p-4">
              <span className="text-[0.65rem] uppercase tracking-widest text-ink/60">
                {t.hasilAngka}
              </span>
              <p className="tabular font-mono text-jumlah text-bank">
                {tampilkanNilai(hasilAngka.nilai)}
              </p>
            </div>
          ) : (
            <Penolakan galat={hasilAngka.galat} judul={galat[hasilAngka.galat.type] ?? ''} />
          )}
        </section>
      )}

      <PanelOpsi opsi={opsi} ubah={setOpsi} judul={t.opsi} />
    </div>
  );
}

/** Bagian bulat masukan sebagai bigint, atau undefined bila belum sah. */
function bagianBulat(masukan: string): bigint | undefined {
  const teks = masukan.trim().split('.').join('').split(',')[0] ?? '';
  const tanpaTanda = teks.startsWith('-') ? teks.slice(1) : teks;
  if (tanpaTanda === '' || !/^\d+$/.test(tanpaTanda)) return undefined;
  try {
    return BigInt(tanpaTanda);
  } catch {
    return undefined;
  }
}

function tampilkanNilai(nilai: { negatif: boolean; bulat: bigint; pecahan: string }): string {
  const digit = nilai.bulat.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const pecahan = nilai.pecahan === '' ? '' : `,${nilai.pecahan}`;
  return `${nilai.negatif ? '-' : ''}${digit}${pecahan}`;
}

function bacaHash(hash: string): Options | undefined {
  if (!hash.startsWith('#')) return undefined;
  const p = new URLSearchParams(hash.slice(1));
  if ([...p.keys()].length === 0) return undefined;

  return {
    sejuta: p.get('sejuta') === 'true',
    ejaanMiliar: p.get('ejaanMiliar') === 'varian' ? 'varian' : 'baku',
    mataUang: p.get('mataUang') === 'rupiah' ? 'rupiah' : 'tidak',
    sen: p.get('sen') === 'sen' ? 'sen' : 'koma',
    kapitalisasi:
      p.get('kapitalisasi') === 'judul'
        ? 'judul'
        : p.get('kapitalisasi') === 'kalimat'
          ? 'kalimat'
          : 'tidak',
  };
}

function tulisHash(opsi: Options): string {
  const p = new URLSearchParams();
  for (const [kunci, nilai] of Object.entries(opsi)) {
    if (String(nilai) !== String(OPSI_BAWAAN[kunci as keyof Options])) {
      p.set(kunci, String(nilai));
    }
  }
  return p.toString();
}
