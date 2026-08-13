import type { MetadataRoute } from 'next';
import { LOKAL } from './kamus';
import { alamat } from './meta';

/**
 * Peta situs. Ruasnya diambil dari daftar lokal yang sama dengan yang dipakai
 * generateStaticParams, jadi rute yang ditambahkan tanpa mendaftarkannya di
 * sini akan langsung terlihat sebagai selisih, bukan hilang diam-diam.
 */
export const dynamic = 'force-static';

const RUAS = ['', 'ubah', 'aturan', 'survei'] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return LOKAL.flatMap((lokal) =>
    RUAS.map((jalur) => ({
      url: alamat(lokal, jalur),
      /* Beranda dan pengubah adalah pintu masuknya; sisanya rujukan. */
      priority: jalur === '' ? 1 : jalur === 'ubah' ? 0.9 : 0.7,
      alternates: {
        languages: Object.fromEntries(LOKAL.map((l) => [l, alamat(l, jalur)])),
      },
    })),
  );
}
