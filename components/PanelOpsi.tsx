'use client';

import { useState } from 'react';
import { OPSI_BAWAAN, SITASI_OPSI, type Options } from '@/lib';

/**
 * Setiap varian tampil bersama dasar pemakaian kedua sisinya. Tidak ada pilihan
 * yang dinyatakan benar dan yang lain salah kecuali sumbernya memang berkata
 * begitu.
 *
 * Satu baris per opsi: nama di kiri, pilihan di kanan, dan sitasi pilihan
 * terpilih di balik tombol ⓘ. Dahulu tiap opsi sekotak penuh dengan sitasinya
 * terbuka, dan kelima kotak itu memakan tempat lebih banyak daripada hasil
 * yang mereka ubah. Sitasinya tidak hilang — satu ketukan jauhnya, dan
 * halaman Aturan menampilkan semuanya sekaligus.
 *
 * Opsi yang digeser dari bawaan diberi lencana "diubah" berwarna segel, dan
 * jumlahnya tampil di kepala panel bersama tombol pemulihnya.
 */
export function PanelOpsi({
  opsi,
  ubah,
  judul,
  bawaanLabel,
  diubahLabel,
  sitasiLabel,
}: {
  opsi: Options;
  ubah: (opsi: Options) => void;
  judul: string;
  bawaanLabel: string;
  diubahLabel: string;
  sitasiLabel: string;
}) {
  const [terbuka, setTerbuka] = useState<ReadonlySet<string>>(new Set());
  const bergeser = SITASI_OPSI.filter((o) => String(opsi[o.kunci]) !== String(OPSI_BAWAAN[o.kunci]));

  function tukarSitasi(kunci: string) {
    setTerbuka((lama) => {
      const baru = new Set(lama);
      if (baru.has(kunci)) baru.delete(kunci);
      else baru.add(kunci);
      return baru;
    });
  }

  return (
    <section className="space-y-ruang3">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h2 className="label">
          {judul}
          {bergeser.length > 0 ? (
            <span className="text-segel">
              {' '}
              · {bergeser.length} {diubahLabel}
            </span>
          ) : null}
        </h2>
        {bergeser.length > 0 ? (
          <button
            type="button"
            onClick={() => ubah(OPSI_BAWAAN)}
            className="min-h-sasaran text-kendali-kecil text-bank underline decoration-garis underline-offset-4 transition-colors hover:decoration-bank"
          >
            {bawaanLabel}
          </button>
        ) : null}
      </div>

      <div className="divide-y divide-guilloche border-y border-guilloche">
        {SITASI_OPSI.map((o) => {
          const terpilih = String(opsi[o.kunci]);
          const dariBawaan = terpilih !== String(OPSI_BAWAAN[o.kunci]);
          const dasar = o.pilihan.find((p) => p.nilai === terpilih);
          const buka = terbuka.has(o.kunci);
          const idSitasi = `sitasi-${o.kunci}`;

          return (
            <fieldset key={o.kunci} className="py-3">
              {/*
                Legend harus anak pertama fieldset supaya dikenali sebagai
                namanya; yang terlihat adalah salinannya di dalam baris tata
                letak, disembunyikan dari pembacaan.
              */}
              <legend className="sr-only">{o.judul}</legend>
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
                <div className="flex items-center gap-1.5">
                  <span aria-hidden className="text-kecil font-medium text-ink">
                    {o.judul}
                  </span>
                  <button
                    type="button"
                    onClick={() => tukarSitasi(o.kunci)}
                    aria-expanded={buka}
                    aria-controls={idSitasi}
                    aria-label={`${sitasiLabel}: ${o.judul}`}
                    className={`flex h-sasaran w-sasaran shrink-0 items-center justify-center rounded-full font-display text-kecil transition-colors duration-200 ease-kertas ${
                      buka ? 'text-bank' : 'text-ink-lirih hover:text-bank'
                    }`}
                  >
                    <span
                      aria-hidden
                      className={`flex h-4 w-4 items-center justify-center rounded-full border text-label ${
                        buka ? 'border-bank' : 'border-garis'
                      }`}
                    >
                      i
                    </span>
                  </button>
                  {dariBawaan ? (
                    <span className="rounded-sm border border-segel px-1 text-label text-segel">
                      {diubahLabel}
                    </span>
                  ) : null}
                </div>

                {/*
                  Radio, bukan tombol beraria-pressed: posisinya disebut,
                  panah menelusurinya, dan seluruh kelompok satu perhentian
                  Tab. Kolomnya disembunyikan; yang tampak span di sebelahnya.
                  Keping terpisah, bukan satu kendali bersegmen: contoh pilihan
                  kapitalisasi dan desimal cukup panjang untuk terlipat, dan
                  bingkai pil yang terlipat dua baris terbaca seperti salah gambar.
                */}
                <div className="flex flex-wrap gap-1">
                  {o.pilihan.map((p) => (
                    <label key={p.nilai} className="cursor-pointer">
                      <input
                        type="radio"
                        name={o.kunci}
                        value={p.nilai}
                        checked={terpilih === p.nilai}
                        onChange={() => ubah({ ...opsi, [o.kunci]: nilaiOpsi(o.kunci, p.nilai) })}
                        className="peer sr-only"
                      />
                      <span className="flex min-h-sasaran items-center rounded-full border border-garis px-2.5 py-1 text-kendali-kecil text-ink-sedang transition-colors duration-200 ease-kertas hover:border-bank hover:text-bank peer-checked:border-bank peer-checked:bg-bank peer-checked:text-kertas peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-bank">
                        {p.contoh}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div id={idSitasi} hidden={!buka}>
                {dasar === undefined ? null : (
                  <p
                    key={dasar.nilai}
                    className="animate-naik-masuk mt-2.5 rounded-lembar bg-tint/70 px-3 py-2 text-kecil text-ink-sedang"
                  >
                    {dasar.dasar} <span className="text-ink-lirih">— {dasar.sumber}</span>
                  </p>
                )}
              </div>
            </fieldset>
          );
        })}
      </div>
    </section>
  );
}

/** Kunci opsi bertipe; `sejuta` boolean, sisanya string literal. */
function nilaiOpsi(kunci: keyof Options, nilai: string): Options[keyof Options] {
  if (kunci === 'sejuta') return nilai === 'true';
  return nilai as Options[keyof Options];
}
