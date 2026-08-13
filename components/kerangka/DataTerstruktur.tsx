import { KAMUS, LOKAL, type Lokal } from '../../app/kamus';
import { alamat } from '../../app/meta';

/**
 * Data terstruktur JSON-LD.
 *
 * JSON sebaris, bukan skrip pihak ketiga: tidak ada yang diunduh, tidak ada
 * yang dijalankan, tidak ada yang dilacak. Isinya diambil dari kamus yang sama
 * dengan isi halaman, jadi ia tidak bisa menyimpang dari yang tertulis.
 *
 * Dua hal yang dinyatakan, dan keduanya memang benar tentang situs ini: ia
 * perkakas yang berjalan di peramban tanpa biaya, dan ia muka dari sebuah
 * pustaka sumber terbuka.
 */
export function DataTerstruktur({ lokal }: { lokal: Lokal }) {
  const t = KAMUS[lokal];
  const beranda = alamat(lokal, '');

  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${beranda}#situs`,
        url: beranda,
        name: t.judulSitus,
        description: t.taglineSitus,
        inLanguage: lokal,
        /* Terjemahan halaman yang sama, bukan situs lain. */
        workTranslation: LOKAL.filter((l) => l !== lokal).map((l) => alamat(l, '')),
      },
      {
        '@type': 'WebApplication',
        '@id': `${alamat(lokal, 'ubah')}#aplikasi`,
        url: alamat(lokal, 'ubah'),
        name: `${t.judulSitus} — ${t.ubah.judul}`,
        description: t.ubah.ringkas,
        applicationCategory: 'UtilityApplication',
        operatingSystem: 'Any',
        browserRequirements: 'Requires JavaScript',
        inLanguage: lokal,
        isAccessibleForFree: true,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'IDR' },
      },
      {
        '@type': 'SoftwareSourceCode',
        name: 'terbilang',
        description: t.beranda.paragraf.join(' '),
        codeRepository: 'https://github.com/andifathulms/terbilang',
        programmingLanguage: 'TypeScript',
        license: 'https://opensource.org/licenses/MIT',
        author: { '@type': 'Person', name: 'Andi Fathul Mukminin Salahuddin' },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
