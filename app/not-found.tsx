import Link from 'next/link';
import { KAMUS } from './kamus';

/**
 * Halaman 404. Ekspor statis menuliskannya sebagai out/404.html, yang dipakai
 * GitHub Pages untuk alamat apa pun yang tidak ada.
 */
export default function TakDitemukan() {
  const t = KAMUS.id;

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-6 py-20">
      <div className="lembar roset overflow-hidden">
        <div className="space-y-4 bg-kertas/85 p-8">
          <p className="label">404</p>
          <h1 className="font-display text-judul">{t.takDitemukan.judul}</h1>
          <p className="text-dasar text-ink-sedang">{t.takDitemukan.isi}</p>
          <Link
            href="/id/"
            className="inline-flex items-center gap-2 rounded-full border border-bank px-4 py-2 text-dasar text-bank transition-colors duration-200 ease-kertas hover:bg-bank hover:text-kertas"
          >
            {t.takDitemukan.kembali}
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
