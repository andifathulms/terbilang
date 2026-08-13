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
        /** Hairline dekoratif. Untuk batas kendali pakai `garis`. */
        guilloche: token('guilloche'),
        garis: token('garis'),
        ink: token('ink'),
        /**
         * Dua tingkat keredupan teks, disetel per tema di globals.css supaya
         * keduanya tetap di atas 4,5:1. Jangan ganti dengan ink/xx.
         */
        'ink-sedang': token('ink-sedang'),
        'ink-lirih': token('ink-lirih'),
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
      /**
       * Satu tangga tipe, nilainya di globals.css. Teks bacaan berhenti di
       * `dasar` (16px); `kecil` untuk keterangan, `label` untuk label huruf
       * besar. Tidak ada text-[…] sebarang di komponen.
       */
      fontSize: {
        label: ['var(--teks-label)', { lineHeight: '1.2', letterSpacing: '0.14em' }],
        kecil: ['var(--teks-kecil)', { lineHeight: '1.5' }],
        dasar: ['var(--teks-dasar)', { lineHeight: '1.65' }],
        /*
         * Ukuran yang sama dengan `dasar` dan `kecil`, tetapi berdaun rapat:
         * kendali diukur oleh kotak barisnya, dan daun bacaan 1,65 menambah
         * enam piksel pada setiap tombol tanpa memberi apa-apa. Teks yang
         * dibaca memakai `dasar`; teks yang diklik memakai ini.
         */
        kendali: ['var(--teks-dasar)', { lineHeight: '1.2' }],
        'kendali-kecil': ['var(--teks-kecil)', { lineHeight: '1.2' }],
        sedang: ['var(--teks-sedang)', { lineHeight: '1.5' }],
        besar: ['var(--teks-besar)', { lineHeight: '1.35' }],
        judul: ['var(--teks-judul)', { lineHeight: '1.25', letterSpacing: '-0.01em' }],
        /** Jumlah terbilang: pahlawan halaman, ikut lebar layar. */
        jumlah: ['var(--teks-jumlah)', { lineHeight: '1.2' }],
        /** Sorot beranda, satu tingkat di atas jumlah. */
        sorot: ['var(--teks-sorot)', { lineHeight: '1.1', letterSpacing: '-0.015em' }],
      },
      /**
       * Tangga ruang bernama, ditambahkan di samping skala bawaan Tailwind
       * alih-alih menimpanya — menimpa `1.5`/`2.5` akan menggeser diam-diam
       * setiap komponen yang sudah memakainya.
       */
      spacing: {
        /** Tinggi minimum sasaran ketuk dan tinggi kepala halaman. */
        sasaran: 'var(--sasaran)',
        kepala: 'var(--tinggi-kepala)',
        ruang1: 'var(--ruang-1)',
        ruang2: 'var(--ruang-2)',
        ruang3: 'var(--ruang-3)',
        ruang4: 'var(--ruang-4)',
        ruang5: 'var(--ruang-5)',
        ruang6: 'var(--ruang-6)',
        ruang7: 'var(--ruang-7)',
        ruang8: 'var(--ruang-8)',
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
      },
      animation: {
        'kelompok-masuk': 'kelompok-masuk 240ms cubic-bezier(0.22, 1, 0.36, 1) both',
        'naik-masuk': 'naik-masuk 340ms cubic-bezier(0.22, 1, 0.36, 1) both',
        'cap-turun': 'cap-turun 460ms cubic-bezier(0.22, 1, 0.36, 1) both',
      },
    },
  },
  plugins: [],
};

export default config;
