import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { format } from '@/lib';
import { BATERAI } from '../../../data/survey/baterai';
import rekamanJson from '../../../data/survey/hasil.json';
import type { RekamanSurvei } from '../../../data/survey/skema';
import { KAMUS, LOKAL, lokalSah, type Lokal } from '../../kamus';

export function generateStaticParams() {
  return LOKAL.map((locale) => ({ locale }));
}

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const t = KAMUS[lokalSah(params.locale) ? params.locale : 'id'];
  return { title: t.survei.judul, description: t.survei.ringkas };
}

const rekaman = rekamanJson as RekamanSurvei;

function kataKita(masukan: string): string {
  const hasil = format(masukan);
  return hasil.type === 'ok' ? hasil.nilai : `— ${hasil.galat.type}`;
}

function bertitik(digit: string): string {
  return digit.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export default function Survei({ params }: { params: { locale: string } }) {
  if (!lokalSah(params.locale)) notFound();
  const lokal: Lokal = params.locale;
  const t = KAMUS[lokal];

  const belumDirekam = rekaman.paket.length === 0;

  return (
    <div className="space-y-8">
      <header className="max-w-2xl space-y-3">
        <h1 className="font-display text-judul">{t.survei.judul}</h1>
        <p className="text-dasar text-ink-sedang">{t.survei.ringkas}</p>

        {rekaman.direkamPada === null ? null : (
          <p className="flex flex-wrap gap-2 text-kecil text-ink-lirih">
            <span className="rounded-full border border-guilloche/70 px-2.5 py-1">
              {lokal === 'id' ? 'Direkam' : 'Recorded'} {rekaman.direkamPada}
            </span>
            <span className="rounded-full border border-guilloche/70 px-2.5 py-1 font-mono">
              {rekaman.runtime}
            </span>
          </p>
        )}
      </header>

      {belumDirekam ? null : (
        <section className="flex flex-wrap gap-2 text-kecil">
          <span className="label mr-1 self-center">{t.survei.keterangan}</span>
          <span className="rounded-full border border-garis px-2.5 py-1 text-ink-sedang">
            {t.survei.sama}
          </span>
          <span className="rounded-full border border-void/40 bg-void/[0.06] px-2.5 py-1 text-void">
            {t.survei.beda}
          </span>
          <span className="rounded-full border border-garis px-2.5 py-1 text-ink-lirih">
            {t.survei.menolak}
          </span>
        </section>
      )}

      {/*
        Baterai masukan selalu tampil, direkam atau belum: kolom terbilang
        adalah keluaran pustaka ini sendiri, dan itu sudah punya nilai sebagai
        rujukan meski belum ada paket pembanding. Karena itu tabelnya
        didahulukan, dan keterangan "belum ada paket" turun ke bawahnya —
        pembaca yang datang ke halaman kosong tetap menemukan sesuatu yang
        bisa dibaca, alih-alih pemberitahuan bahwa tidak ada apa-apa.
      */}
      <section className="space-y-3">
        <h2 className="font-display text-besar">{t.survei.baterai}</h2>
        <p className="max-w-2xl text-dasar text-ink-sedang">{t.survei.bateraiRingkas}</p>

        <div className="lembar overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-kecil">
              <thead>
                <tr className="border-b border-guilloche bg-tint/50 text-left">
                  <th className="px-4 py-2.5 font-medium sm:px-5">{t.survei.masukan}</th>
                  <th className="px-4 py-2.5 font-medium sm:px-5">terbilang</th>
                  {rekaman.paket.map((p) => (
                    <th key={p.nama} className="px-4 py-2.5 font-medium sm:px-5">
                      {p.nama}
                      <span className="block font-mono text-kecil font-normal text-ink-lirih">
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
                    <tr
                      key={masukan}
                      className="border-b border-guilloche/40 align-top transition-colors duration-200 ease-kertas last:border-0 hover:bg-tint/40"
                    >
                      <td className="tabular whitespace-nowrap px-4 py-3 font-mono text-kecil text-ink-sedang sm:px-5">
                        {bertitik(masukan)}
                      </td>
                      <td className="px-4 py-3 font-display text-dasar text-bank sm:px-5">{kami}</td>

                      {rekaman.paket.map((p) => {
                        const baris = rekaman.hasil.find(
                          (b) => b.paket === p.nama && b.masukan === masukan,
                        );
                        const beda = baris?.keluaran != null && baris.keluaran !== kami;
                        return (
                          <td
                            key={p.nama}
                            className={`px-4 py-3 sm:px-5 ${
                              beda ? 'text-void' : 'text-ink-sedang'
                            } ${baris?.galat != null ? 'text-ink-lirih' : ''}`}
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
        </div>

        <p className="max-w-2xl text-kecil text-ink-lirih">{t.survei.catatan}</p>
      </section>

      {/* Cara mengisinya, sebagai keterangan di kaki — bukan penghalang di kepala. */}
      {belumDirekam ? (
        <section className="lembar space-y-3 p-5 sm:p-6">
          <h2 className="font-display text-sedang">{t.survei.belum}</h2>
          <p className="max-w-2xl text-dasar text-ink-sedang">{t.survei.belumIsi}</p>
          <pre className="overflow-x-auto rounded-lembar border border-guilloche/70 bg-tint/60 p-3.5 font-mono text-kecil">
            pnpm survey:record &lt;paket&gt; [paket...]
          </pre>
        </section>
      ) : null}
    </div>
  );
}
