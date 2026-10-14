import type { Metadata, Viewport } from 'next';
import { Fraunces, IBM_Plex_Mono, IBM_Plex_Sans } from 'next/font/google';
import { SKRIP_LOKAL } from './kamus';
import { SKRIP_TEMA } from '../components/kerangka/TombolTema';
import './globals.css';

/**
 * Fraunces membawa halaman: ia punya kualitas terukir yang sama dengan
 * cetakan pengaman dan tetap tegak pada ukuran besar. Sumbu opsz ikut dimuat
 * supaya `font-optical-sizing: auto` memakai potongan tampilan pada jumlah dan
 * judul besar — garis yang lebih tipis, lebih dekat ke ukiran — dan potongan
 * teks pada ukuran bacaan.
 *
 * IBM Plex Sans untuk kendali dan prosa, IBM Plex Mono dengan angka tabular
 * untuk digit. Satu keluarga, satu kerangka: kolom angka dan labelnya terbaca
 * sebagai satu formulir, dan wataknya mesin kantor, bukan antarmuka umum.
 *
 * Plex hanya terbit sebagai potongan statis, jadi bobotnya disebut satu per
 * satu dan hanya yang dipakai: 400/500/600 untuk sans, 400/500 untuk mono.
 * Fraunces tetap berkas ragam — menyebut bobotnya justru menerbitkan ulang
 * berkas penuh per bobot (diukur dahulu: 115 kB jadi 226 kB).
 */
const fraunces = Fraunces({
  subsets: ['latin'],
  axes: ['opsz'],
  variable: '--font-fraunces',
  display: 'swap',
});

const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

const sans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-sans',
  display: 'swap',
});

/**
 * Aset merek disajikan dari public/ sehingga ikut basePath; alamat mutlak
 * dipakai untuk gambar bagi (OG) karena penerima tautan bukan peramban yang
 * sedang membuka situs ini.
 */
const basis = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const asal = 'https://andifathulms.github.io';

export const metadata: Metadata = {
  metadataBase: new URL(`${asal}${basis}/`),
  title: {
    default: 'Terbilang — bilangan Indonesia dieja menjadi kata',
    template: '%s · Terbilang',
  },
  description:
    'Bilangan Indonesia dieja menjadi kata, dan dibaca kembali. Dua arah, berbasis BigInt, tanpa dependensi, diuji tuntas untuk sejuta nilai pertama.',
  applicationName: 'Terbilang',
  authors: [{ name: 'Andi Fathul Mukminin Salahuddin' }],
  keywords: ['terbilang', 'bilangan', 'kuitansi', 'rupiah', 'number to words', 'indonesia'],
  icons: {
    icon: [
      { url: `${basis}/favicon.svg`, type: 'image/svg+xml' },
      { url: `${basis}/icon-32.png`, type: 'image/png', sizes: '32x32' },
      { url: `${basis}/icon-192.png`, type: 'image/png', sizes: '192x192' },
    ],
    apple: [{ url: `${basis}/apple-touch-icon.png`, sizes: '180x180' }],
  },
  appleWebApp: { capable: true, title: 'Terbilang', statusBarStyle: 'default' },
  /*
   * Kartu bagi tidak lagi disebut di sini. Sebelumnya og:title dan
   * og:description ditulis sekali di akar dan tidak pernah ditimpa, sehingga
   * membagikan halaman Aturan memperlihatkan pratinjau beranda — pratinjau
   * yang salah untuk enam dari delapan alamat. Sekarang tiap halaman
   * membangunnya sendiri dari kamus lewat app/meta.ts, dari sumber yang sama
   * dengan isinya.
   */
};

/** Bilah alamat peramban ikut warna lembar, di kedua tema. */
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#E9EFE6' },
    { media: '(prefers-color-scheme: dark)', color: '#0C1310' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="id"
      data-tema="siang"
      suppressHydrationWarning
      className={`${fraunces.variable} ${mono.variable} ${sans.variable}`}
    >
      <head>
        {/*
          Tautan manifes ditulis tangan: `metadata.manifest` keluar tanpa
          basePath, dan di GitHub Pages jalur tanpa basis itu 404. Isi manifes
          sendiri memakai jalur relatif, jadi ia ikut ke mana pun basis
          dipindahkan. Ikon lewat `metadata.icons` sudah berawalan basis.
        */}
        <link rel="manifest" href={`${basis}/manifest.webmanifest`} />
        {/* Tema dan lokal dipasang sebelum cat pertama. */}
        <script dangerouslySetInnerHTML={{ __html: SKRIP_TEMA }} />
        <script dangerouslySetInnerHTML={{ __html: SKRIP_LOKAL }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
