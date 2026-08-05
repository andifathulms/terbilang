import type { Config } from 'tailwindcss';

/**
 * Token semantik saja. Tidak ada heksa mentah di komponen.
 *
 * Dunia bahannya adalah cek dan bilyet giro: tint pengaman yang pucat, kertas
 * yang lebih terang untuk lembar ceknya sendiri, guilloche halus di belakang
 * kolom jumlah, tinta gelap, biru bank untuk keluaran kata — dan merah void
 * yang khusus untuk penolakan.
 *
 * Warna ditulis sebagai variabel CSS supaya tema malam — salinan karbon dari
 * lembar yang sama — cukup menukar nilai variabelnya. Komponen tetap memakai
 * token yang sama dan tidak perlu tahu tema mana yang sedang berlaku.
 */
const token = (nama: string) => `rgb(var(--${nama}) / <alpha-value>)`;

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  darkMode: ['class', '[data-tema="malam"]'],
  theme: {
    extend: {
      colors: {
        tint: token('tint'),
        kertas: token('kertas'),
        guilloche: token('guilloche'),
        ink: token('ink'),
        bank: token('bank'),
        void: token('void'),
        /** Ochre stempel. Hanya untuk cap verifikasi; tidak untuk yang lain. */
        segel: token('segel'),
      },
      fontFamily: {
        display: ['var(--font-fraunces)', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        /** Jumlah terbilang: pahlawan halaman, ikut lebar layar. */
        jumlah: ['clamp(1.5rem, 4.4vw, 2.75rem)', { lineHeight: '1.2' }],
        /** Sorot beranda, satu tingkat di atas jumlah. */
        sorot: ['clamp(2rem, 4.6vw, 3.25rem)', { lineHeight: '1.1', letterSpacing: '-0.015em' }],
        /** Label kecil berhuruf besar yang berulang di seluruh situs. */
        label: ['0.6875rem', { lineHeight: '1.2', letterSpacing: '0.14em' }],
      },
      borderRadius: {
        lembar: '0.75rem',
      },
      boxShadow: {
        /** Lembar cek terangkat sedikit dari tint di belakangnya. */
        lembar: '0 1px 0 rgb(var(--ink) / 0.04), 0 12px 32px -20px rgb(var(--ink) / 0.5)',
        angkat: '0 2px 0 rgb(var(--ink) / 0.05), 0 24px 48px -24px rgb(var(--ink) / 0.6)',
      },
      transitionTimingFunction: {
        kertas: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        'kelompok-masuk': {
          from: { opacity: '0', transform: 'translateY(0.35em) scale(0.97)' },
          to: { opacity: '1', transform: 'none' },
        },
        'naik-masuk': {
          from: { opacity: '0', transform: 'translateY(0.5rem)' },
          to: { opacity: '1', transform: 'none' },
        },
        'cap-turun': {
          from: { opacity: '0', transform: 'rotate(-16deg) scale(1.7)' },
          '65%': { opacity: '1', transform: 'rotate(-8deg) scale(0.97)' },
          to: { opacity: '1', transform: 'rotate(-8deg) scale(1)' },
        },
        denyut: {
          '0%,100%': { opacity: '1' },
          '50%': { opacity: '0.3' },
        },
      },
      animation: {
        'kelompok-masuk': 'kelompok-masuk 240ms cubic-bezier(0.22, 1, 0.36, 1) both',
        'naik-masuk': 'naik-masuk 340ms cubic-bezier(0.22, 1, 0.36, 1) both',
        'cap-turun': 'cap-turun 460ms cubic-bezier(0.22, 1, 0.36, 1) both',
        denyut: 'denyut 1.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
