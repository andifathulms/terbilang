import type { Metadata } from 'next';
import { KAMUS, LOKAL, type Lokal } from './kamus';

/**
 * Metadata satu halaman, dibangun dari kamus yang sama dengan isinya.
 *
 * Judul dan ringkasan tiap halaman sudah datang dari kamus, tetapi kartu bagi
 * — og:title, og:description — ditulis sekali di tata letak akar dan tidak
 * pernah ditimpa, sehingga membagikan halaman Aturan memperlihatkan pratinjau
 * beranda. Semuanya kini berasal dari satu sumber, jadi ringkasan yang
 * menyimpang dari halamannya tidak bisa terjadi diam-diam.
 *
 * Ditulis juga yang selama ini tidak ada sama sekali: canonical, og:url, dan
 * hreflang. Dua lokal berisi bahan yang sama tanpa satu pun penanda yang
 * memasangkannya membuat keduanya bersaing alih-alih berkelompok.
 */

const ASAL = 'https://andifathulms.github.io';
const BASIS = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

/** Kode lokal penuh untuk Open Graph. */
const OG_LOKAL: Record<Lokal, string> = { id: 'id_ID', en: 'en_US' };

/** Alamat mutlak sebuah halaman. Ekspor statis memakai garis miring di ujung. */
export function alamat(lokal: Lokal, jalur: string): string {
  const ekor = jalur === '' ? '' : `${jalur}/`;
  return `${ASAL}${BASIS}/${lokal}/${ekor}`;
}

export function metaHalaman({
  lokal,
  jalur,
  judul,
  ringkas,
}: {
  lokal: Lokal;
  /** Ruas di bawah lokal, tanpa garis miring. Kosong untuk beranda. */
  jalur: string;
  judul: string;
  ringkas: string;
}): Metadata {
  const kanonik = alamat(lokal, jalur);
  const lain = LOKAL.filter((l) => l !== lokal);

  /*
   * Kartu bagi memakai judul lengkapnya. `title` di bawah dilewatkan template
   * "%s · Terbilang" oleh Next, tetapi og:title tidak — tanpa ini kartu untuk
   * halaman Aturan hanya berbunyi "Aturan", yang di luar konteks tidak
   * menyebut situs apa pun.
   */
  const judulKartu = jalur === '' ? judul : `${judul} · ${KAMUS[lokal].judulSitus}`;

  return {
    title: judul,
    description: ringkas,
    alternates: {
      canonical: kanonik,
      /* x-default menunjuk ke bahasa Indonesia: situs ini berbahasa Indonesia
         lebih dahulu, dan pokoknya memang bahasa Indonesia. */
      languages: {
        ...Object.fromEntries(LOKAL.map((l) => [l, alamat(l, jalur)])),
        'x-default': alamat('id', jalur),
      },
    },
    openGraph: {
      type: 'website',
      siteName: KAMUS[lokal].judulSitus,
      title: judulKartu,
      description: ringkas,
      url: kanonik,
      locale: OG_LOKAL[lokal],
      alternateLocale: lain.map((l) => OG_LOKAL[l]),
      images: [
        {
          url: `${ASAL}${BASIS}/og.png`,
          width: 1200,
          height: 630,
          alt: KAMUS[lokal].taglineSitus,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: judulKartu,
      description: ringkas,
      images: [`${ASAL}${BASIS}/og.png`],
    },
  };
}
