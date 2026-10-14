import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DataTerstruktur } from '../../components/kerangka/DataTerstruktur';
import { TandaPagar } from '../../components/kerangka/Merek';
import { Gelombang } from '../../components/kerangka/Guilloche';
import {
  MenuPonsel,
  Navigasi,
  PengalihBahasa,
  TautanPengubah,
} from '../../components/kerangka/Navigasi';
import { TandaPembuat } from '../../components/kerangka/TandaPembuat';
import { TombolTema } from '../../components/kerangka/TombolTema';
import { KAMUS, LOKAL, lokalSah, type Lokal } from '../kamus';

export function generateStaticParams() {
  return LOKAL.map((locale) => ({ locale }));
}

export const dynamicParams = false;

export default function TataLetakLokal({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!lokalSah(params.locale)) notFound();
  const lokal: Lokal = params.locale;
  const t = KAMUS[lokal];

  /*
   * Pengubah berdiri sendiri sebagai tombol di kepala halaman; deretan
   * tautan sisanya adalah bacaan. Di menu ponsel keduanya kembali menjadi
   * satu daftar, pengubah di urutan pertama.
   */
  const pengubah = { href: `/${lokal}/ubah/`, label: t.nav.ubah };
  const bacaan = [
    { href: `/${lokal}/aturan/`, label: t.nav.aturan },
    { href: `/${lokal}/survei/`, label: t.nav.survei },
  ];

  return (
    <div lang={lokal} className="flex min-h-screen flex-col">
      <DataTerstruktur lokal={lokal} />

      <a
        href="#isi"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-bank focus:px-3 focus:py-2 focus:text-kendali focus:text-kertas"
      >
        {t.umum.lewatiKe}
      </a>

      <header className="sticky top-0 z-30 border-b border-guilloche/70 bg-tint/85 backdrop-blur">
        <div className="mx-auto flex min-h-kepala max-w-6xl items-center gap-3 px-4 py-2 sm:gap-6 sm:px-6">
          <Link
            href={`/${lokal}/`}
            className="flex shrink-0 items-center gap-2 font-display text-sedang tracking-tight"
          >
            <TandaPagar kelas="h-7 w-7 text-dasar" />
            {t.judulSitus}
          </Link>

          <Navigasi tautan={bacaan} label={t.umum.navigasi} />

          <div className="ml-auto flex shrink-0 items-center gap-2">
            <div className="hidden items-center gap-2 md:flex">
              <PengalihBahasa lokal={lokal} label={t.umum.bahasa} />
              <TombolTema label={t.umum.tema} siang={t.umum.siang} malam={t.umum.malam} />
            </div>
            <TautanPengubah tautan={pengubah} />
            <MenuPonsel
              tautan={[pengubah, ...bacaan]}
              label={t.umum.menu}
              tutup={t.umum.tutup}
              navigasi={t.umum.navigasi}
            >
              <PengalihBahasa lokal={lokal} label={t.umum.bahasa} />
              <TombolTema label={t.umum.tema} siang={t.umum.siang} malam={t.umum.malam} />
            </MenuPonsel>
          </div>
        </div>
      </header>

      <main id="isi" className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        {children}
      </main>

      {/*
        Kaki halaman di pita hutan: penutup yang gelap di kedua tema, dengan
        gelombang guilloche samar di tepinya seperti pinggiran uang kertas.
      */}
      <footer className="relative mt-ruang8 overflow-hidden bg-hutan text-hutan-lirih">
        <Gelombang kelas="absolute inset-x-0 top-0 h-24 w-full text-hutan-garis" />
        <div className="relative mx-auto max-w-6xl px-4 pb-8 pt-ruang8 sm:px-6">
          <div className="grid gap-6 text-kecil sm:grid-cols-3">
            <div className="space-y-2">
              <span className="flex items-center gap-2">
                <TandaPagar kelas="h-6 w-6 text-kecil !bg-hutan-ink !text-hutan" />
                <span className="font-display text-sedang text-hutan-ink">{t.judulSitus}</span>
              </span>
              <p className="max-w-xs">{t.taglineSitus}</p>
            </div>
            <p>
              KBBI &amp; PUEBI/EYD
              <br />
              Badan Pengembangan dan Pembinaan Bahasa
            </p>
            <p className="flex flex-wrap gap-x-4 gap-y-1 sm:justify-end">
              <a
                href="https://www.npmjs.com/package/terbilang"
                className="text-hutan-ink underline decoration-hutan-garis underline-offset-4 transition-colors hover:text-hutan-bank"
              >
                npm
              </a>
              <a
                href="https://github.com/andifathulms/terbilang"
                className="text-hutan-ink underline decoration-hutan-garis underline-offset-4 transition-colors hover:text-hutan-bank"
              >
                GitHub
              </a>
              <span>MIT</span>
            </p>
          </div>

          <div className="mt-8 border-t border-hutan-garis pt-6">
            <TandaPembuat />
          </div>
        </div>
      </footer>
    </div>
  );
}
