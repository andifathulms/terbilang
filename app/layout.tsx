import type { Metadata, Viewport } from 'next';
import { Fraunces, Inter, Roboto_Mono } from 'next/font/google';
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

export const metadata: Metadata = {
  title: {
    default: 'Terbilang — bilangan Indonesia dieja menjadi kata',
    template: '%s · Terbilang',
  },
  description:
    'Bilangan Indonesia dieja menjadi kata, dan dibaca kembali. Dua arah, berbasis BigInt, tanpa dependensi, diuji tuntas untuk sejuta nilai pertama.',
  applicationName: 'Terbilang',
  authors: [{ name: 'Andi Fathul Mukminin Salahuddin' }],
  keywords: ['terbilang', 'bilangan', 'kuitansi', 'rupiah', 'number to words', 'indonesia'],
  openGraph: {
    type: 'website',
    siteName: 'Terbilang',
    locale: 'id_ID',
    title: 'Terbilang — bilangan Indonesia dieja menjadi kata',
    description:
      'Pengubah dua arah, rujukan aturan bersitasi, dan survei implementasi yang berversi dan bertanggal.',
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
        {/* Tema dipasang sebelum cat pertama supaya tidak ada kedipan. */}
        <script dangerouslySetInnerHTML={{ __html: SKRIP_TEMA }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
