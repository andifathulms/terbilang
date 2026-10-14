import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { format, OPSI_BAWAAN, parse, SITASI_OPSI, type Galat, type Hasil, type Options } from '@/lib';
import { TombolSalin } from '../../../components/TombolSalin';
import { KAMUS, LOKAL, lokalSah, type Lokal } from '../../kamus';
import { metaHalaman } from '../../meta';

export function generateStaticParams() {
  return LOKAL.map((locale) => ({ locale }));
}

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const lokal: Lokal = lokalSah(params.locale) ? params.locale : 'id';
  const t = KAMUS[lokal];
  return metaHalaman({ lokal, jalur: 'pakai', judul: t.pakai.judul, ringkas: t.pakai.ringkas });
}

const PASANG = [
  'git clone https://github.com/andifathulms/terbilang',
  'cd terbilang',
  'pnpm install',
  'pnpm build:lib',
].join('\n');

/**
 * Contoh pemanggilan. Hanya pemanggilannya yang ditulis di sini; hasilnya
 * dihitung pustaka saat halaman dibangun dan dicetak apa adanya, sehingga
 * contoh di halaman ini tidak bisa menyimpang dari perilaku pustakanya.
 * `hash` adalah keadaan pengubah yang memperagakan contoh yang sama.
 */
interface Contoh {
  readonly kode: string;
  readonly hasil: Hasil<unknown>;
  readonly hash: string;
}

const CONTOH_FORMAT: readonly Contoh[] = [
  { kode: 'format(1_000_001n)', hasil: format(1_000_001n), hash: 'n=1000001' },
  {
    kode: "format('1.500,25', { mataUang: 'rupiah', sen: 'sen' })",
    hasil: format('1.500,25', { mataUang: 'rupiah', sen: 'sen' }),
    hash: 'n=1500%2C25&mataUang=rupiah&sen=sen',
  },
  { kode: 'format(9_007_199_254_740_993n)', hasil: format(9_007_199_254_740_993n), hash: 'n=9007199254740993' },
  { kode: 'format(10n ** 18n)', hasil: format(10n ** 18n), hash: 'n=1000000000000000000' },
];

const CONTOH_PARSE: readonly Contoh[] = [
  {
    kode: "parse('dua ratus lima puluh ribu')",
    hasil: parse('dua ratus lima puluh ribu'),
    hash: 'arah=kata&k=dua+ratus+lima+puluh+ribu',
  },
  { kode: "parse('seribu juta')", hasil: parse('seribu juta'), hash: 'arah=kata&k=seribu+juta' },
];

/** Satu Hasil ditulis seperti yang akan terlihat di konsol, sependek mungkin. */
function tulisHasil(h: Hasil<unknown>): string {
  if (h.type === 'galat') {
    return `{ type: 'galat', galat: { type: '${h.galat.type}', … } }`;
  }
  const n = h.nilai;
  if (typeof n === 'string') return `{ type: 'ok', nilai: '${n}' }`;
  if (typeof n === 'object' && n !== null && 'bulat' in n) {
    const t = n as { negatif: boolean; bulat: bigint; pecahan: string };
    return `{ type: 'ok', nilai: { negatif: ${t.negatif}, bulat: ${t.bulat}n, pecahan: '${t.pecahan}' } }`;
  }
  return `{ type: 'ok', … }`;
}

/** Semua kode galat, dalam urutan yang sama dengan union Galat di lib/errors.ts. */
const KODE_GALAT: readonly Galat['type'][] = [
  'masukan-kosong',
  'tipe-tidak-didukung',
  'bukan-bilangan',
  'di-luar-jangkauan',
  'pecahan-terlalu-panjang',
  'opsi-bertentangan',
  'kata-tidak-dikenal',
  'skala-tanpa-kuantitas',
  'urutan-skala-salah',
  'susunan-tidak-sah',
];

export default function Pakai({ params }: { params: { locale: string } }) {
  if (!lokalSah(params.locale)) notFound();
  const lokal: Lokal = params.locale;
  const t = KAMUS[lokal];
  const p = t.pakai;

  return (
    <div className="space-y-ruang8">
      <header className="max-w-2xl space-y-ruang3">
        <h1 className="font-display text-judul tracking-tight">{p.judul}</h1>
        <p className="text-sedang text-ink-sedang">{p.ringkas}</p>
      </header>

      <section className="grid gap-ruang5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <div className="min-w-0 space-y-ruang4">
          {/*
            Status rilis disebut lebih dulu dan terus terang: nama di npm milik
            paket lain, dan memasang nama itu memasang pustaka yang berbeda.
            Segel, bukan void — ini peringatan, bukan penolakan.
          */}
          <div className="rounded-lembar border border-segel/70 bg-kertas p-5">
            <p className="label !text-segel">{p.statusJudul}</p>
            <p className="mt-2 text-dasar text-ink-sedang">{p.statusIsi}</p>
          </div>

          <div className="space-y-ruang2">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-besar">{p.pasangJudul}</h2>
              <TombolSalin teks={PASANG} label={p.salin} labelTersalin={p.tersalin} />
            </div>
            <pre className="tabular overflow-x-auto rounded-lembar bg-hutan p-5 font-mono text-kecil leading-relaxed text-hutan-ink">
              {PASANG.split('\n').map((baris) => (
                <span key={baris} className="block">
                  <span aria-hidden className="select-none text-hutan-lirih">
                    ${' '}
                  </span>
                  {baris}
                </span>
              ))}
            </pre>
            <p className="text-kecil text-ink-lirih">{p.pasangIsi}</p>
          </div>
        </div>

        <div className="lembar min-w-0 space-y-ruang3 p-5 sm:p-6">
          <h2 className="label">{p.jaminanJudul}</h2>
          <ul className="space-y-ruang3">
            {p.jaminan.map((j) => (
              <li key={j.slice(0, 24)} className="flex gap-3 text-dasar text-ink-sedang">
                <span aria-hidden className="mt-1 text-bank">
                  ✓
                </span>
                <span>{j}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="space-y-ruang5">
        <div className="max-w-2xl space-y-ruang2">
          <h2 className="font-display text-judul tracking-tight">{p.apiJudul}</h2>
          <p className="text-dasar text-ink-sedang">{p.apiIsi}</p>
        </div>

        <BlokApi
          tanda="format(nilai: bigint | string, opsi?: Partial<Options>): Hasil<string>"
          isi={p.formatIsi}
          contoh={CONTOH_FORMAT}
          lokal={lokal}
          coba={p.cobaDiPengubah}
        />
        <BlokApi
          tanda="parse(kata: string, opsi?: Partial<Options>): Hasil<Terurai>"
          isi={p.parseIsi}
          contoh={CONTOH_PARSE}
          lokal={lokal}
          coba={p.cobaDiPengubah}
        />
      </section>

      <section className="space-y-ruang4">
        <div className="max-w-2xl space-y-ruang2">
          <h2 className="font-display text-judul tracking-tight">{p.opsiJudul}</h2>
          <p className="text-dasar text-ink-sedang">{p.opsiIsi}</p>
        </div>
        <div className="lembar overflow-x-auto">
          <table className="w-full min-w-[36rem] text-left text-kecil">
            <thead>
              <tr className="border-b border-guilloche">
                <th scope="col" className="label px-5 py-3 font-medium">{p.kolomKunci}</th>
                <th scope="col" className="label px-5 py-3 font-medium">{p.kolomBawaan}</th>
                <th scope="col" className="label px-5 py-3 font-medium">{p.kolomPilihan}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-guilloche">
              {SITASI_OPSI.map((o) => (
                <tr key={o.kunci}>
                  <th scope="row" className="px-5 py-3 font-mono font-normal text-ink">{o.kunci}</th>
                  <td className="px-5 py-3 font-mono text-bank">{tulisNilai(OPSI_BAWAAN[o.kunci])}</td>
                  <td className="px-5 py-3 text-ink-sedang">
                    <ul className="space-y-1">
                      {o.pilihan.map((c) => (
                        <li key={c.nilai}>
                          <span className="font-mono text-ink">{tulisPilihan(o.kunci, c.nilai)}</span>{' '}
                          <span lang="id" className="text-ink-lirih">— {c.contoh}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-ruang4">
        <div className="max-w-2xl space-y-ruang2">
          <h2 className="font-display text-judul tracking-tight">{p.galatJudul}</h2>
          <p className="text-dasar text-ink-sedang">{p.galatIsi}</p>
        </div>
        <div className="lembar overflow-x-auto">
          <table className="w-full min-w-[30rem] text-left text-kecil">
            <thead>
              <tr className="border-b border-guilloche">
                <th scope="col" className="label px-5 py-3 font-medium">{p.kolomKode}</th>
                <th scope="col" className="label px-5 py-3 font-medium">{p.kolomArti}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-guilloche">
              {KODE_GALAT.map((k) => (
                <tr key={k}>
                  <th scope="row" className="whitespace-nowrap px-5 py-3 font-mono font-normal text-void">{k}</th>
                  <td className="px-5 py-3 text-ink-sedang">{t.galat[k]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function BlokApi({
  tanda,
  isi,
  contoh,
  lokal,
  coba,
}: {
  tanda: string;
  isi: string;
  contoh: readonly Contoh[];
  lokal: Lokal;
  coba: string;
}) {
  return (
    <div className="lembar overflow-hidden">
      <div className="space-y-ruang2 border-b border-guilloche p-5 sm:p-6">
        <code className="block overflow-x-auto whitespace-nowrap font-mono text-dasar text-ink">{tanda}</code>
        <p className="max-w-3xl text-dasar text-ink-sedang">{isi}</p>
      </div>
      <ul className="divide-y divide-guilloche">
        {contoh.map((c) => (
          <li key={c.kode} className="grid gap-x-ruang5 gap-y-1 px-5 py-4 sm:px-6 md:grid-cols-[minmax(0,1fr)_auto]">
            <div className="min-w-0 space-y-1">
              <code className="block overflow-x-auto font-mono text-kecil text-ink">{c.kode}</code>
              <code
                className={`block overflow-x-auto font-mono text-kecil ${
                  c.hasil.type === 'ok' ? 'text-bank' : 'text-void'
                }`}
              >
                <span aria-hidden className="text-ink-lirih">
                  →{' '}
                </span>
                {tulisHasil(c.hasil)}
              </code>
            </div>
            <Link
              href={`/${lokal}/ubah/#${c.hash}`}
              className="self-center whitespace-nowrap text-kendali-kecil text-bank underline decoration-garis underline-offset-4 hover:decoration-bank"
            >
              {coba} →
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function tulisNilai(v: Options[keyof Options]): string {
  return typeof v === 'string' ? `'${v}'` : String(v);
}

function tulisPilihan(kunci: keyof Options, nilai: string): string {
  return kunci === 'sejuta' ? nilai : `'${nilai}'`;
}
