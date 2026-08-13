import type { Metadata, Viewport } from 'next';
import { Fraunces, Inter, Roboto_Mono } from 'next/font/google';
import { SKRIP_LOKAL } from './kamus';
import { SKRIP_TEMA } from '../components/kerangka/TombolTema';
import './globals.css';

/**
 * Fraunces membawa halaman: ia punya kualitas terukir yang sama dengan
 * cetakan pengaman dan tetap tegak pada ukuran besar. Roboto Mono dengan
 * angka tabular untuk digit, Inter untuk kendali dan prosa.
 */
const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
});

const mono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
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
  openGraph: {
    type: 'website',
    siteName: 'Terbilang',
    locale: 'id_ID',
    title: 'Terbilang — bilangan Indonesia dieja menjadi kata',
    description:
      'Pengubah dua arah, rujukan aturan bersitasi, dan survei implementasi yang berversi dan bertanggal.',
    images: [
      {
        url: `${asal}${basis}/og.png`,
        width: 1200,
        height: 630,
        alt: 'Terbilang — dieja jadi kata, dibaca kembali',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terbilang — bilangan Indonesia dieja menjadi kata',
    description: 'Pengubah dua arah, berbasis BigInt, tanpa dependensi.',
    images: [`${asal}${basis}/og.png`],
  },
};

/** Bilah alamat peramban ikut warna lembar, di kedua tema. */
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#E6EDE4' },
    { media: '(prefers-color-scheme: dark)', color: '#0F1411' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="id"
      data-tema="siang"
      suppressHydrationWarning
      className={`${fraunces.variable} ${mono.variable} ${inter.variable}`}
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
