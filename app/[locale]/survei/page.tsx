import { notFound } from 'next/navigation';
import { format } from '@/lib';
import { BATERAI } from '../../../data/survey/baterai';
import rekamanJson from '../../../data/survey/hasil.json';
import type { RekamanSurvei } from '../../../data/survey/skema';
import { KAMUS, LOKAL, lokalSah } from '../../kamus';

export function generateStaticParams() {
  return LOKAL.map((locale) => ({ locale }));
}

const rekaman = rekamanJson as RekamanSurvei;

function kataKita(masukan: string): string {
  const hasil = format(masukan);
  return hasil.type === 'ok' ? hasil.nilai : `— ${hasil.galat.type}`;
}

export default function Survei({ params }: { params: { locale: string } }) {
  if (!lokalSah(params.locale)) notFound();
  const lokal = params.locale;
  const t = KAMUS[lokal];

  const belumDirekam = rekaman.paket.length === 0;

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="font-display text-2xl">{t.survei.judul}</h1>
        <p className="max-w-2xl text-sm text-ink/70">{t.survei.ringkas}</p>
        {rekaman.direkamPada ? (
          <p className="text-xs text-ink/55">
            {lokal === 'id' ? 'Direkam' : 'Recorded'} {rekaman.direkamPada} · {rekaman.runtime}
          </p>
        ) : null}
      </header>

      {belumDirekam ? (
        <section className="border border-guilloche p-5 text-sm leading-relaxed">
          <p className="font-medium">
            {lokal === 'id' ? 'Belum ada rekaman.' : 'Nothing recorded yet.'}
          </p>
          <p className="mt-2 max-w-2xl text-ink/75">
            {lokal === 'id'
              ? 'Tabel ini hanya menampilkan hasil yang benar-benar diukur. Jalankan skrip pengembangan dengan nama paket yang ingin disurvei; setiap klaim akan membawa versi paket dan tanggal pengukurannya.'
              : 'This table only shows results that were actually measured. Run the development script with the package names to survey; every claim then carries the package version and the date it was measured.'}
          </p>
          <pre className="mt-3 overflow-x-auto border border-guilloche/70 bg-tint p-3 font-mono text-xs">
            pnpm survey:record &lt;paket&gt; [paket...]
          </pre>
        </section>
      ) : null}

      <section className="space-y-3">
        <h2 className="text-[0.65rem] uppercase tracking-widest text-ink/60">
          {lokal === 'id' ? 'Baterai masukan' : 'Input battery'}
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-guilloche text-left">
                <th className="py-2 pr-4 font-medium">{lokal === 'id' ? 'Masukan' : 'Input'}</th>
                <th className="py-2 pr-4 font-medium">terbilang</th>
                {rekaman.paket.map((p) => (
                  <th key={p.nama} className="py-2 pr-4 font-medium">
                    {p.nama}
                    <span className="block font-mono text-[0.65rem] font-normal text-ink/55">
                      {p.versi}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {BATERAI.map((masukan) => {
                const kami = kataKita(masukan);
                return (
                  <tr key={masukan} className="border-b border-guilloche/50 align-top">
                    <td className="tabular py-2 pr-4 font-mono text-xs text-ink/70">
                      {masukan.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                    </td>
                    <td className="py-2 pr-4 font-display text-bank">{kami}</td>
                    {rekaman.paket.map((p) => {
                      const baris = rekaman.hasil.find(
                        (b) => b.paket === p.nama && b.masukan === masukan,
                      );
                      const beda = baris?.keluaran != null && baris.keluaran !== kami;
                      return (
                        <td
                          key={p.nama}
                          className={`py-2 pr-4 ${beda ? 'text-void' : 'text-ink/75'}`}
                        >
                          {baris?.galat ?? baris?.keluaran ?? '—'}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="max-w-2xl text-xs leading-relaxed text-ink/60">
          {lokal === 'id'
            ? 'Perbedaan ditandai, lalu diklasifikasikan tertulis sebagai bug kami, bug mereka, atau varian yang sah — catatannya ada di tests/survey/.'
            : 'Differences are marked, then classified in writing as our bug, their bug, or a legitimate variant — the record lives in tests/survey/.'}
        </p>
      </section>
    </div>
  );
}
