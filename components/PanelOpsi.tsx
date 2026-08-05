'use client';

import { SITASI_OPSI, type Options } from '@/lib';

/**
 * Setiap varian tampil bersama dasar pemakaian kedua sisinya. Tidak ada pilihan
 * yang dinyatakan benar dan yang lain salah kecuali sumbernya memang berkata begitu.
 */
export function PanelOpsi({
  opsi,
  ubah,
  judul,
}: {
  opsi: Options;
  ubah: (opsi: Options) => void;
  judul: string;
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-[0.65rem] uppercase tracking-widest text-ink/60">{judul}</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        {SITASI_OPSI.map((o) => {
          const terpilih = String(opsi[o.kunci]);

          return (
            <fieldset key={o.kunci} className="border border-guilloche p-3">
              <legend className="px-1 text-xs font-medium">{o.judul}</legend>

              <div className="flex flex-wrap gap-1">
                {o.pilihan.map((p) => (
                  <button
                    key={p.nilai}
                    type="button"
                    aria-pressed={terpilih === p.nilai}
                    onClick={() => ubah({ ...opsi, [o.kunci]: nilaiOpsi(o.kunci, p.nilai) })}
                    className={`border px-2 py-1 text-xs ${
                      terpilih === p.nilai
                        ? 'border-bank bg-bank text-tint'
                        : 'border-guilloche hover:border-bank'
                    }`}
                  >
                    {p.contoh}
                  </button>
                ))}
              </div>

              {o.pilihan
                .filter((p) => p.nilai === terpilih)
                .map((p) => (
                  <p key={p.nilai} className="mt-2 text-[0.7rem] leading-snug text-ink/70">
                    {p.dasar} <span className="text-ink/50">— {p.sumber}</span>
                  </p>
                ))}
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
