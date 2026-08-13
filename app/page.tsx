import Link from 'next/link';
import { KAMUS } from './kamus';
import { alamat } from './meta';

/**
 * Akar situs. Ekspor statis tidak punya peladen untuk mengalihkan, jadi
 * pengalihannya ditulis sebagai meta refresh nol detik — bukan lagi useEffect
 * di klien.
 *
 * Bedanya ada pada yang bukan peramban. Perayap dan pengambil pratinjau tidak
 * menjalankan JavaScript, jadi alamat akar — yang justru paling sering
 * ditautkan orang — terindeks sebagai halaman berisi dua kalimat. Meta refresh
 * diikuti perayap sebagai pengalihan, dan canonical menunjuk lokal bawaannya,
 * sehingga bobot tautannya jatuh ke halaman yang benar.
 *
 * Halamannya kini juga komponen peladen: tidak ada lagi JavaScript yang
 * dikirim untuk sekadar berpindah alamat, dan tautannya tetap bisa diklik
 * bila pengalihannya diabaikan.
 */
/* basePath tidak dipasang otomatis pada meta refresh seperti pada <Link>,
   jadi ia ditulis di sini — tanpa itu akar mengalihkan ke alamat yang 404 di
   GitHub Pages. */
const BASIS = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const TUJUAN = `${BASIS}/id/`;

export const metadata = {
  title: `${KAMUS.id.judulSitus} — ${KAMUS.id.taglineSitus.replace(/\.$/, '')}`,
  description: KAMUS.id.beranda.paragraf.join(' '),
  alternates: { canonical: alamat('id', '') },
};

export default function Akar() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-6">
      {/* Diangkat ke <head> oleh React; tata letak akar tetap yang merender html. */}
      <meta httpEquiv="refresh" content={`0; url=${TUJUAN}`} />

      <p className="font-display text-judul">
        <Link href="/id/" className="text-bank underline decoration-garis underline-offset-4">
          {KAMUS.id.judulSitus}
        </Link>
      </p>
      <p className="mt-2 text-dasar text-ink-sedang">{KAMUS.id.taglineSitus}</p>
    </main>
  );
}
