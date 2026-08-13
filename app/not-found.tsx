import Link from 'next/link';
import { KAMUS, LOKAL } from './kamus';

/**
 * Halaman 404. Ekspor statis menuliskannya sebagai out/404.html, yang dipakai
 * GitHub Pages untuk alamat apa pun yang tidak ada.
 *
 * Satu berkas melayani kedua lokal — tidak ada peladen yang bisa memilihkan —
 * jadi keduanya ditulis sekaligus, Indonesia lebih dahulu seperti di seluruh
 * situs. Pengunjung yang tersesat dari /en/ dahulu mendapat halaman berbahasa
 * Indonesia saja; sekarang kalimatnya ada dalam bahasa yang ia baca, dan
 * tautan pulangnya menuju lokal yang sama.
 */
export default function TakDitemukan() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-6 py-20">
      <div className="lembar roset overflow-hidden">
        <div className="space-y-ruang5 bg-kertas/85 p-8">
          <p className="label">404</p>

          {LOKAL.map((lokal, i) => {
            const t = KAMUS[lokal].takDitemukan;
            const Judul = i === 0 ? 'h1' : 'h2';

            return (
              <div
                key={lokal}
                lang={lokal}
                className={
                  i === 0
                    ? 'space-y-ruang3'
                    : 'space-y-ruang3 border-t border-guilloche/60 pt-ruang5'
                }
              >
                <Judul className="font-display text-judul">{t.judul}</Judul>
                <p className="text-dasar text-ink-sedang">{t.isi}</p>
                <Link
                  href={`/${lokal}/`}
                  className="inline-flex items-center gap-2 rounded-full border border-bank px-4 py-2 text-kendali text-bank transition-colors duration-200 ease-kertas hover:bg-bank hover:text-kertas"
                >
                  {t.kembali}
                  <span aria-hidden>→</span>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
