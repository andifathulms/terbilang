import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { format, OPSI_BAWAAN } from '@/lib';
import { CekSorot } from '../../components/CekSorot';
import { Cap } from '../../components/cheque/Cap';
import { Uraian } from '../../components/cheque/Uraian';
import { Roset } from '../../components/kerangka/Guilloche';
import { KAMUS, lokalSah, type Lokal } from '../kamus';
import { metaHalaman } from '../meta';

/*
 * Bilangan untuk uraian pengantar. Sengaja yang biasa saja: cukup besar untuk
 * memakai dua kata skala dan memakai ratusan serta puluhan, tetapi tanpa satu
 * pun kasus batas. Nilai awal lembar sorot, 1.000.001, justru kasus tepi — ia
 * dipilih karena memperagakan kelompok kosong — dan kasus tepi bukan tempat
 * memulai sebuah uraian.
 */
const URAI_PENGANTAR = 4_250_000n;

/** Nilai, catatan, dan bentuk keliru yang lazim muncul di implementasi lain. */
type Baris = readonly [bigint, string, string];

const CONTOH: Record<Lokal, readonly Baris[]> = {
  id: [
    [1_000n, 'peleburan se- berlaku sampai ribu', 'satu ribu'],
    [1_000_001n, 'kelompok 000 tidak menghasilkan kata', 'satu juta nol ribu satu'],
    [9_007_199_254_740_993n, 'di atas 2⁵³ tetap utuh', 'dibulatkan diam-diam oleh number'],
  ],
  en: [
    [1_000n, 'the se- fusion runs up to ribu', 'satu ribu'],
    [1_000_001n, 'a 000 group emits nothing', 'satu juta nol ribu satu'],
    [9_007_199_254_740_993n, 'still exact above 2⁵³', 'silently rounded by a number'],
  ],
};

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const lokal: Lokal = lokalSah(params.locale) ? params.locale : 'id';
  const t = KAMUS[lokal];
  return metaHalaman({
    lokal,
    jalur: '',
    /*
     * Beranda memakai judul lengkap situs, bukan template "· Terbilang".
     * Taglinenya dipotong di koma: utuh ia 81 aksara dan terpenggal di hasil
     * pencarian, sedangkan klausa pertamanya sudah menyebut seluruh pokoknya.
     * Ringkasannya merangkai kalimat utama halaman dengan taglinenya — dua
     * kalimat yang memang tampil di halaman, bukan salinan yang bisa
     * menyimpang darinya.
     */
    judul: `${t.judulSitus} — ${t.taglineSitus.split(',')[0]}`,
    ringkas: `${t.beranda.kepala} ${t.taglineSitus}`,
  });
}

export default function Beranda({ params }: { params: { locale: string } }) {
  if (!lokalSah(params.locale)) notFound();
  const lokal: Lokal = params.locale;
  const t = KAMUS[lokal];

  return (
    <div className="space-y-ruang7 sm:space-y-ruang8">
      {/*
        Sorot di pita hutan selebar layar: judul dan ajakan di kiri, lembar
        cek yang bisa diketik di kanan. Lembar itulah alatnya — ketukan
        pertama pengunjung adalah mengetik, bukan memuat halaman lain.

        Urutan markah sudah urutan layar sempit: judul, lembar, prosa dan
        ajakan. Di layar lebar penempatannya disebut tegas; kolom kanan
        memanjang dua baris untuk lembarnya.
      */}
      <section className="pita-hutan relative -mt-10 overflow-hidden pb-ruang7 pt-ruang7 text-hutan-ink sm:-mt-14 sm:pt-ruang8">
        <Roset kelas="absolute -left-40 top-1/2 h-[34rem] w-[34rem] -translate-y-1/2 text-hutan-garis opacity-70" />

        <div className="relative grid items-center gap-x-ruang7 gap-y-ruang6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
          <div className="animate-naik-masuk space-y-ruang5 lg:col-start-1 lg:row-start-1 lg:self-end">
            <p className="label !text-hutan-bank">{t.beranda.mata}</p>
            <h1 className="font-display text-sorot font-light">
              {t.beranda.judul}{' '}
              <em className="text-hutan-bank">{t.beranda.judulTekan}</em>
            </h1>
            <p className="max-w-xl text-sedang text-hutan-ink">{t.beranda.kepala}</p>
          </div>

          <div className="animate-naik-masuk tunda-2 relative lg:col-start-2 lg:row-span-2 lg:row-start-1">
            <CekSorot lokal={lokal} t={t} />
            <div className="absolute right-4 top-4 sm:right-5 sm:top-5">
              <Cap judul={t.beranda.cap.judul} isi={t.beranda.cap.isi} />
            </div>
          </div>

          <div className="animate-naik-masuk tunda-3 space-y-ruang5 lg:col-start-1 lg:row-start-2 lg:self-start">
            <div className="max-w-xl space-y-ruang4 text-dasar text-hutan-lirih">
              {t.beranda.paragraf.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>

            <div className="flex flex-wrap gap-ruang3">
              <Link
                href={`/${lokal}/ubah/`}
                className="group inline-flex min-h-sasaran items-center gap-2 rounded-full bg-hutan-bank px-5 py-2.5 text-kendali text-hutan transition-transform duration-200 ease-kertas hover:-translate-y-0.5"
              >
                {t.beranda.ajakan}
                <span
                  aria-hidden
                  className="transition-transform duration-200 ease-kertas group-hover:translate-x-0.5"
                >
                  →
                </span>
              </Link>
              <Link
                href={`/${lokal}/aturan/`}
                className="inline-flex min-h-sasaran items-center rounded-full border border-hutan-garis px-5 py-2.5 text-kendali text-hutan-ink transition-colors duration-200 ease-kertas hover:border-hutan-bank hover:text-hutan-bank"
              >
                {t.beranda.ajakanDua}
              </Link>
            </div>
          </div>
        </div>

        {/*
          Empat angka tentang pustakanya, sebagai satu jalur di kaki sorot —
          seperti baris kode di kaki cek — bukan bagian tersendiri lebih jauh
          di bawah. Fakta yang sama, tempat yang lebih dekat ke alatnya.
        */}
        <dl
          aria-label={t.beranda.labelSifat}
          className="relative mt-ruang7 grid grid-cols-2 border-y border-hutan-garis lg:grid-cols-4"
        >
          {t.beranda.sifat.map((s, i) => (
            <div
              key={s.label}
              className={`flex flex-col-reverse gap-1 py-ruang4 pr-ruang4 ${
                i % 2 === 1 ? 'pl-ruang4 border-l border-hutan-garis' : ''
              } ${i >= 2 ? 'border-t border-hutan-garis lg:border-t-0' : ''} ${
                i === 2 ? 'lg:border-l lg:pl-ruang4' : ''
              }`}
            >
              <dt className="text-kecil text-hutan-lirih">{s.label}</dt>
              <dd className="tabular font-mono text-besar text-hutan-bank">{s.nilai}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/*
        Contoh berjalan yang bisa diikuti sebelum menyentuh kendali apa pun.
        Ia mendahului daftar kasus tepi dengan sengaja: pembaca perlu tahu
        rupa bilangan biasa sebelum diperlihatkan yang ganjil.
      */}
      <section className="grid gap-x-ruang7 gap-y-ruang4 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
        <div className="space-y-ruang3 lg:sticky lg:top-24 lg:self-start">
          <h2 className="font-display text-judul tracking-tight">{t.beranda.judulUrai}</h2>
          <p className="text-dasar text-ink-sedang">{t.beranda.ringkasUrai}</p>
        </div>

        <div className="lembar p-5 sm:p-6">
          <Uraian bulat={URAI_PENGANTAR} opsi={OPSI_BAWAAN} t={t.urai} />
        </div>
      </section>

      {/* Tempat implementasi lain patah, di pita kertas. Tiap baris dihitung oleh pustaka. */}
      <section className="pita-kertas space-y-ruang5 py-ruang7">
        <div className="max-w-2xl space-y-ruang3">
          <h2 className="font-display text-judul tracking-tight">{t.beranda.judulContoh}</h2>
          <p className="text-dasar text-ink-sedang">{t.beranda.ringkasContoh}</p>
        </div>

        <ul className="grid items-start gap-ruang4 md:grid-cols-3">
          {CONTOH[lokal].map(([nilai, catatan, keliru]) => {
            const hasil = format(nilai);
            return (
              <li
                key={nilai.toString()}
                className="flex flex-col gap-ruang3 rounded-lembar border border-guilloche bg-tint/50 p-5"
              >
                <p className="tabular break-all font-mono text-sedang text-ink">
                  {nilai.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                </p>
                <p lang="id" className="break-words font-display text-sedang text-bank">
                  {hasil.type === 'ok' ? hasil.nilai : hasil.galat.pesan}
                </p>
                <div className="space-y-1 border-t border-guilloche pt-ruang3">
                  <p className="text-kecil text-ink-lirih">
                    <span className="line-through decoration-void/70">{keliru}</span>
                  </p>
                  <p className="text-kecil text-ink-sedang">{catatan}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {/*
        Pintu ke isi situs, sebagai satu jalur — bukan kartu yang berdiri
        sendiri-sendiri. Tanpa nomor: urutannya bukan langkah yang harus
        diikuti, jadi nomor hanya akan berpura-pura menjadi informasi.
      */}
      <section className="lembar grid divide-y divide-guilloche overflow-hidden sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4">
        {t.beranda.kartu.map((k, i) => (
          <Link
            key={k.ke}
            href={`/${lokal}/${k.ke}/`}
            className={`group flex flex-col gap-ruang2 p-5 transition-colors duration-200 ease-kertas hover:bg-tint/60 sm:p-6 ${
              i % 2 === 1 ? 'sm:border-l sm:border-guilloche' : ''
            } ${i >= 2 ? 'sm:border-t sm:border-guilloche lg:border-t-0' : ''} ${
              i === 2 ? 'lg:border-l' : ''
            }`}
          >
            <h3 className="font-display text-sedang">{k.judul}</h3>
            <p className="flex-1 text-kecil text-ink-sedang">{k.isi}</p>
            <span className="text-kendali-kecil text-bank">
              {k.tautan}
              <span
                aria-hidden
                className="ml-1 inline-block transition-transform duration-200 ease-kertas group-hover:translate-x-1"
              >
                →
              </span>
            </span>
          </Link>
        ))}
      </section>
    </div>
  );
}
