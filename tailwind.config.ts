import type { Config } from 'tailwindcss';

/**
 * Token semantik saja. Tidak ada heksa mentah di komponen.
 *
 * Dunia bahannya adalah cek dan bilyet giro: tint pengaman yang pucat,
 * guilloche halus di belakang kolom jumlah, tinta gelap, biru bank untuk
 * keluaran kata — dan merah void yang khusus untuk penolakan.
 */
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        tint: '#E6EDE4',
        guilloche: '#B9C7BC',
        ink: '#1C231F',
        bank: '#2B4C6F',
        void: '#A33C33',
      },
      fontFamily: {
        display: ['var(--font-fraunces)', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        jumlah: ['clamp(1.75rem, 5vw, 3rem)', { lineHeight: '1.15' }],
      },
    },
  },
  plugins: [],
};

export default config;
