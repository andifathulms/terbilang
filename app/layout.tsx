import type { Metadata } from 'next';
import { Fraunces, Inter, Roboto_Mono } from 'next/font/google';
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
  title: 'Terbilang',
  description: 'Bilangan Indonesia dieja menjadi kata, dan dibaca kembali.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${fraunces.variable} ${mono.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
