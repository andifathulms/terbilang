'use client';

import { OPSI_BAWAAN, SITASI_OPSI, type Options } from '@/lib';

/**
 * Setiap varian tampil bersama dasar pemakaian kedua sisinya. Tidak ada pilihan
 * yang dinyatakan benar dan yang lain salah kecuali sumbernya memang berkata
 * begitu. Opsi yang digeser dari bawaan ditandai titik, supaya jelas keluaran
 * mana yang sedang tidak memakai bentuk baku.
 */
export function PanelOpsi({
  opsi,
  ubah,
  judul,
  bawaanLabel,
}: {
  opsi: Options;
  ubah: (opsi: Options) => void;
  judul: string;
  bawaanLabel: string;
}) {
  const bergeser = SITASI_OPSI.filter((o) => String(opsi[o.kunci]) !== String(OPSI_BAWAAN[o.kunci]));

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h2 className="label">{judul}</h2>
        {bergeser.length > 0 ? (
          <button
            type="button"
            onClick={() => ubah(OPSI_BAWAAN)}
            className="text-xs text-bank underline decoration-guilloche underline-offset-4 transition-colors hover:decoration-bank"
          >
            {bawaanLabel} ({bergeser.length})
          </button>
        ) : null}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {SITASI_OPSI.map((o) => {
          const terpilih = String(opsi[o.kunci]);
          const dariBawaan = terpilih !== String(OPSI_BAWAAN[o.kunci]);
          const dasar = o.pilihan.find((p) => p.nilai === terpilih);

          return (
            <fieldset
              key={o.kunci}
              className="rounded-lembar border border-guilloche/70 bg-kertas/50 p-3.5 transition-colors duration-200 ease-kertas hover:border-guilloche"
            >
              <legend className="flex items-center gap-1.5 px-1 text-xs font-medium">
                {o.judul}
                {dariBawaan ? (
                  <span
                    aria-hidden
                    title={o.bawaan}
                    className="inline-block h-1.5 w-1.5 rounded-full bg-bank"
                  />
                ) : null}
              </legend>

              <div className="flex flex-wrap gap-1.5">
                {o.pilihan.map((p) => {
                  const aktif = terpilih === p.nilai;
                  return (
                    <button
                      key={p.nilai}
                      type="button"
                      aria-pressed={aktif}
                      onClick={() => ubah({ ...opsi, [o.kunci]: nilaiOpsi(o.kunci, p.nilai) })}
                      className={`rounded-full border px-2.5 py-1 text-xs transition-all duration-200 ease-kertas ${
                        aktif
                          ? 'border-bank bg-bank text-kertas'
                          : 'border-guilloche text-ink/70 hover:border-bank hover:text-bank'
                      }`}
                    >
                      {p.contoh}
                    </button>
                  );
                })}
              </div>

              {dasar === undefined ? null : (
                <p
                  key={dasar.nilai}
                  className="animate-naik-masuk mt-2.5 text-[0.7rem] leading-relaxed text-ink/65"
                >
                  {dasar.dasar} <span className="text-ink/45">— {dasar.sumber}</span>
                </p>
              )}
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
