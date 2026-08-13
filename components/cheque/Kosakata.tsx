import { format, SKALA } from '@/lib';
import type { Lokal } from '../../app/kamus';

/**
 * Seluruh kata yang bisa keluar, beserta artinya.
 *
 * Halaman ini menerangkan aturan tentang kata-kata yang tidak pernah
 * diterjemahkannya. Pembaca berbahasa Inggris diberi tahu bahwa "ribu (10³)"
 * adalah kata skala, lalu dibiarkan menyimpulkan sendiri bahwa ribu berarti
 * seribu — menyimpulkan, di situs yang seluruh sikapnya justru menyitasi dan
 * bukan menerka.
 *
 * Satuan dan belasan diambil dari pustaka dengan menanyakan katanya satu per
 * satu; kata skala diambil dari SKALA. Tidak ada daftar kata kedua yang
 * ditulis tangan di situs dan bisa menyimpang diam-diam dari lema pustaka.
 */
const ARTI_SKALA: Record<string, string> = {
  ribu: 'thousand',
  juta: 'million',
  miliar: 'billion',
  triliun: 'trillion',
  kuadriliun: 'quadrillion',
};

function kata(n: bigint): string {
  const h = format(n);
  return h.type === 'ok' ? h.nilai : '';
}

export function Kosakata({
  lokal,
  judul,
  ringkas,
  kolomKata,
  kolomBesaran,
  kolomArti,
}: {
  lokal: Lokal;
  judul: string;
  ringkas: string;
  kolomKata: string;
  kolomBesaran: string;
  kolomArti: string;
}) {
  const satuan = [1n, 2n, 3n, 4n, 5n, 6n, 7n, 8n, 9n];
  const belasan = [10n, 11n, 12n, 19n];
  const skala = SKALA.filter((s) => s.baku !== '');

  return (
    <div className="space-y-ruang3 border-t border-guilloche/60 p-5 sm:p-6">
      <div className="space-y-1">
        <h3 className="label" id="kosakata">
          {judul}
        </h3>
        <p className="max-w-2xl text-kecil text-ink-sedang">{ringkas}</p>
      </div>

      <div className="overflow-x-auto">
        <table aria-labelledby="kosakata" className="w-full border-collapse text-kecil">
          <thead>
            <tr className="border-b border-guilloche text-left">
              <th scope="col" className="py-2 pr-4 font-medium">
                {kolomKata}
              </th>
              <th scope="col" className="py-2 pr-4 font-medium">
                {kolomBesaran}
              </th>
              {lokal === 'en' ? (
                <th scope="col" className="py-2 font-medium">
                  {kolomArti}
                </th>
              ) : null}
            </tr>
          </thead>
          <tbody>
            {[...satuan, ...belasan].map((n) => (
              <tr key={n.toString()} className="border-b border-guilloche/40 last:border-0">
                <th scope="row" lang="id" className="py-1.5 pr-4 text-left font-display font-normal text-bank">
                  {kata(n)}
                </th>
                <td className="tabular py-1.5 pr-4 font-mono text-ink-sedang">{n.toString()}</td>
                {lokal === 'en' ? <td className="py-1.5 text-ink-sedang">{n.toString()}</td> : null}
              </tr>
            ))}

            {skala.map((s) => (
              <tr key={s.nama} className="border-b border-guilloche/40 last:border-0">
                <th scope="row" lang="id" className="py-1.5 pr-4 text-left font-display font-normal text-bank">
                  {s.baku}
                </th>
                <td className="tabular py-1.5 pr-4 font-mono text-ink-sedang">
                  {s.nilai.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                </td>
                {lokal === 'en' ? (
                  <td className="py-1.5 text-ink-sedang">{ARTI_SKALA[s.nama] ?? ''}</td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
