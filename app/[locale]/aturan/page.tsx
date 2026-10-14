import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { format, SITASI_OPSI } from '@/lib';
import { BandingVarian } from '../../../components/BandingVarian';
import { Kosakata } from '../../../components/cheque/Kosakata';
import { LewatNumber } from '../../../components/cheque/LewatNumber';
import { DaftarIsi } from '../../../components/kerangka/DaftarIsi';
import { ATURAN, type Contoh } from '../../../data/aturan';
import { KAMUS, LOKAL, lokalSah, type Lokal } from '../../kamus';
import { metaHalaman } from '../../meta';

export function generateStaticParams() {
  return LOKAL.map((locale) => ({ locale }));
}

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const lokal: Lokal = lokalSah(params.locale) ? params.locale : 'id';
  const t = KAMUS[lokal];
  return metaHalaman({ lokal, jalur: 'aturan', judul: t.aturan.judul, ringkas: t.aturan.ringkas });
}

/*
 * Kisi contoh: garis rambut di antara kartu adalah latar guilloche yang
 * terlihat di celah 1px. Celah itu juga yang terlihat di sel kosong bila
 * jumlah contoh tidak habis dibagi kolomnya — sepetak hijau tanpa isi. Jadi
 * jumlah kolom dipilih per aturan, dan kartu terakhir merentang sisa barisnya.
 * Kelasnya ditulis utuh supaya Tailwind menemukannya.
 */
const KOLOM: Record<number, string> = { 1: '', 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-3' };
const RENTANG: Record<number, string> = { 2: 'sm:col-span-2', 3: 'sm:col-span-3' };

function kolomUntuk(jumlah: number): number {
  if (jumlah <= 3) return jumlah;
  return jumlah % 3 === 0 ? 3 : jumlah % 2 === 0 ? 2 : 3;
}

function sisaKolom(jumlah: number): number {
  const kolom = kolomUntuk(jumlah);
  const isiBarisAkhir = jumlah % kolom === 0 ? kolom : jumlah % kolom;
  return kolom - isiBarisAkhir + 1;
}

/**
 * Contoh dibentuk oleh pustaka saat halaman dibangun, termasuk contoh yang
 * memang ditolak — penolakannya ditampilkan sebagai penolakan, bukan
 * disembunyikan. Bentuk keliru berdampingan dengan bentuk benar supaya
 * bedanya terbaca dalam satu tarikan mata.
 *
 * Satu kartu per contoh, jumlahnya dalam ukuran yang sama dengan yang
 * dipakai di pengubah: contoh adalah yang dicari pembaca halaman ini, jadi
 * ia tidak lagi diset sebagai baris kecil di bawah prosanya.
 */
function KartuContoh({
  contoh,
  kelirul,
  rentang,
}: {
  contoh: Contoh;
  kelirul: string;
  /** Kolom yang direntang kartu ini — lebih dari satu hanya untuk kartu terakhir. */
  rentang: number;
}) {
  const hasil = format(contoh.masukan);
  const masukan =
    typeof contoh.masukan === 'bigint'
      ? contoh.masukan.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
      : contoh.masukan;

  return (
    <li className={`flex min-w-0 flex-col gap-1.5 bg-kertas p-4 sm:p-5 ${RENTANG[rentang] ?? ''}`}>
      <span className="tabular break-all font-mono text-dasar text-ink-sedang">{masukan}</span>

      {/* Suku tengahnya disebut, supaya barisnya bisa diterka bukan dihafal. */}
      {contoh.turunan === undefined ? null : (
        <span lang="id" className="block font-mono text-kecil text-ink-lirih">
          {contoh.turunan} →
        </span>
      )}

      {hasil.type === 'ok' ? (
        <span lang="id" className="block break-words font-display text-besar leading-snug text-bank">
          {hasil.nilai}
        </span>
      ) : (
        <span className="flex flex-col gap-1">
          <span className="text-dasar text-void">{hasil.galat.pesan}</span>
          <span className="font-mono text-label uppercase tracking-widest text-void">
            {hasil.galat.type}
          </span>
        </span>
      )}

      {contoh.keliru ? (
        <span className="mt-auto block pt-1 text-kecil text-ink-lirih">
          {kelirul}:{' '}
          <span className="line-through decoration-void/70">{contoh.keliru}</span>
        </span>
      ) : null}
    </li>
  );
}

export default function Aturan({ params }: { params: { locale: string } }) {
  if (!lokalSah(params.locale)) notFound();
  const lokal: Lokal = params.locale;
  const t = KAMUS[lokal];

  const pokok = [
    ...ATURAN.map((a) => ({ kunci: a.kunci, judul: a.judul[lokal] })),
    { kunci: 'varian', judul: t.aturan.varian },
  ];

  return (
    <div className="space-y-ruang7">
      <header className="max-w-2xl space-y-2">
        <h1 className="font-display text-judul tracking-tight">{t.aturan.judul}</h1>
        <p className="text-dasar text-ink-sedang">{t.aturan.ringkas}</p>
      </header>

      <div className="gap-ruang7 lg:grid lg:grid-cols-[14rem_minmax(0,1fr)]">
        <aside className="mb-ruang6 lg:mb-0">
          <DaftarIsi pokok={pokok} judul={t.aturan.daftarIsi} bernomor={ATURAN.length} />
        </aside>

        <div className="min-w-0 space-y-ruang6">
          {ATURAN.map((a, i) => (
            <section
              key={a.kunci}
              id={a.kunci}
              tabIndex={-1}
              aria-labelledby={`judul-${a.kunci}`}
              className="lembar scroll-mt-24 overflow-hidden"
            >
              <div className="space-y-ruang3 p-5 sm:p-6">
                {/*
                  Nomornya informasi, bukan hiasan: aturan disusun dari yang
                  paling dasar ke yang paling jarang dipikirkan, dan daftar isi
                  memakai nomor yang sama.
                */}
                <p className="tabular font-mono text-kecil text-bank">
                  {t.aturan.nomor.replace('{n}', String(i + 1)).replace('{dari}', String(ATURAN.length))}
                </p>
                {/* Tautan jangkar di luar h2, supaya nama judulnya tetap judulnya saja. */}
                <div className="group flex items-baseline gap-2">
                  <h2 id={`judul-${a.kunci}`} className="font-display text-judul tracking-tight">
                    {a.judul[lokal]}
                  </h2>
                  <a
                    href={`#${a.kunci}`}
                    aria-label={`${t.aturan.tautanBagian}: ${a.judul[lokal]}`}
                    className="text-besar text-ink-lirih opacity-0 transition-opacity duration-200 ease-kertas hover:text-bank focus-visible:opacity-100 group-hover:opacity-100"
                  >
                    #
                  </a>
                </div>
                <p className="max-w-2xl text-dasar text-ink-sedang">{a.isi[lokal]}</p>
                <p className="inline-flex rounded-full border border-garis px-2.5 py-1 text-kecil text-ink-sedang">
                  <span className="mr-1 text-ink-lirih">§</span>
                  {t.aturan.sumber}: {a.sumber}
                </p>
              </div>

              {/*
                Kisi kartu dengan garis rambut di antaranya: latar guilloche
                pada celah 1px menjadi garisnya, jadi tidak ada batas ganda di
                kartu yang bersebelahan.
              */}
              <ul className={`grid gap-px border-t border-guilloche bg-guilloche ${KOLOM[kolomUntuk(a.contoh.length)]}`}>
                {a.contoh.map((c, j) => (
                  <KartuContoh
                    key={String(c.masukan)}
                    contoh={c}
                    kelirul={t.aturan.keliru}
                    rentang={j === a.contoh.length - 1 ? sisaKolom(a.contoh.length) : 1}
                  />
                ))}
              </ul>

              {/* Daftar katanya diletakkan pada aturan skala, tempat kata itu dipakai. */}
              {a.kunci === 'skala' ? (
                <Kosakata
                  lokal={lokal}
                  judul={t.aturan.kosakata}
                  ringkas={t.aturan.kosakataRingkas}
                  kolomKata={t.aturan.kolomKata}
                  kolomBesaran={t.aturan.kolomBesaran}
                  kolomArti={t.aturan.kolomArti}
                />
              ) : null}

              {/* Peragaan diletakkan pada aturannya, bukan di halaman lain. */}
              {a.kunci === 'presisi' ? (
                <LewatNumber
                  nilai={9_007_199_254_740_993n}
                  labelUtuh={t.aturan.presisiUtuh}
                  labelNumber={t.aturan.presisiNumber}
                  catatan={t.aturan.presisiCatatan}
                />
              ) : null}
            </section>
          ))}

          <section
            id="varian"
            tabIndex={-1}
            aria-labelledby="judul-varian"
            className="lembar scroll-mt-24 overflow-hidden"
          >
            <div className="space-y-2 p-5 sm:p-6">
              <h2 id="judul-varian" className="font-display text-judul tracking-tight">
                {t.aturan.varian}
              </h2>
              <p className="max-w-2xl text-dasar text-ink-sedang">
                {t.aturan.varianRingkas}
              </p>
            </div>

            <div className="divide-y divide-guilloche/50 border-t border-guilloche/60 bg-tint/40">
              {SITASI_OPSI.map((o) => (
                <BandingVarian
                  key={o.kunci}
                  opsi={o}
                  labelMasukan={t.aturan.masukanSama}
                  labelBerubah={t.aturan.kataBerubah}
                  labelBawaan={t.aturan.bawaan}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
