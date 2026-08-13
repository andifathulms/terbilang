/**
 * Tanda pembuat: kredit pribadi di dasar kaki halaman. Ia sengaja dipisahkan
 * dari atribusi sumber dan lisensi di atasnya — yang itu keterangan hukum,
 * yang ini tanda tangan — tetapi tanpa garis pembatas kedua; kaki halaman
 * tetap satu jahitan.
 *
 * Seluruh identitas ada di satu tempat di bawah ini supaya menyalin atau
 * memperbaruinya tidak perlu menyentuh markah.
 */

const PEMBUAT = {
  nama: 'Andi Fathul Mukminin',
  portofolio: 'https://andifathulms.github.io/en/',
} as const;

interface Tempat {
  readonly nama: string;
  readonly href: string;
  readonly ikon: React.ReactNode;
}

/* Ikon digambar sebaris, 18px, mewarisi currentColor — tidak ada aset dan
   tidak ada dependensi ikon. */
const TAUTAN: readonly Tempat[] = [
  {
    nama: 'Portfolio',
    href: PEMBUAT.portofolio,
    ikon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18" />
        <path d="M12 3a14 14 0 0 1 0 18a14 14 0 0 1 0-18" />
      </>
    ),
  },
  {
    nama: 'GitHub',
    href: 'https://github.com/andifathulms',
    ikon: (
      <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12 12 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />
    ),
  },
  {
    nama: 'LinkedIn',
    href: 'https://www.linkedin.com/in/andifathulmukminin/',
    ikon: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M7.5 10.5V17M7.5 7.2v.1M11.5 17v-3.6a2.4 2.4 0 0 1 4.8 0V17" />
      </>
    ),
  },
  {
    nama: 'Instagram',
    href: 'https://www.instagram.com/andifathulms/',
    ikon: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="3.6" />
        <path d="M17.2 6.8v.1" />
      </>
    ),
  },
];

export function TandaPembuat() {
  /* Ekspor statis: tahunnya dipatri saat bangun, bukan di peramban. */
  const tahun = new Date().getFullYear();

  return (
    <div className="flex flex-col gap-3 text-kecil text-ink-lirih sm:flex-row sm:items-center sm:justify-between">
      <p>
        Designed &amp; built by{' '}
        <a
          href={PEMBUAT.portofolio}
          target="_blank"
          rel="noopener noreferrer"
          className="text-ink underline decoration-garis underline-offset-4 transition-colors duration-200 ease-kertas hover:text-bank hover:decoration-bank"
        >
          {PEMBUAT.nama}
        </a>
        <span aria-hidden className="px-1.5 text-guilloche">
          ·
        </span>
        <span className="tabular font-mono">© {tahun}</span>
      </p>

      <ul className="-mx-1.5 flex items-center gap-0.5 sm:-mr-1.5">
        {TAUTAN.map((t) => (
          <li key={t.nama}>
            <a
              href={t.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t.nama}
              className="flex rounded p-1.5 text-ink-lirih transition-colors duration-200 ease-kertas hover:bg-guilloche/25 hover:text-bank"
            >
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {t.ikon}
              </svg>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
