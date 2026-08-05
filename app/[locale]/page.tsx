import Link from 'next/link';
import { notFound } from 'next/navigation';
import { format, kelompokkan, OPSI_BAWAAN } from '@/lib';
import { Cap } from '../../components/cheque/Cap';
import { GarisJumlah } from '../../components/cheque/GarisJumlah';
import { KurungKelompok } from '../../components/cheque/KurungKelompok';
import { KAMUS, lokalSah, type Lokal } from '../kamus';

/** Nilai sorot dan contoh dihitung pustaka saat halaman dibangun. */
const SOROT = 1_000_001n;

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

export default function Beranda({ params }: { params: { locale: string } }) {
  if (!lokalSah(params.locale)) notFound();
  const lokal: Lokal = params.locale;
  const t = KAMUS[lokal];

  const sorot = format(SOROT);
  const kelompok = kelompokkan(SOROT);

  return (
    <div className="space-y-16 sm:space-y-20">
      {/* Sorot: judul di kiri, lembar cek di kanan pada layar lebar. */}
      <section className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        <div className="animate-naik-masuk space-y-6">
          <p className="label">KBBI · PUEBI/EYD · BigInt</p>

          <h1 className="max-w-xl font-display text-sorot">{t.beranda.kepala}</h1>

          <div className="max-w-xl space-y-4 text-[0.95rem] leading-relaxed text-ink/80">
            {t.beranda.paragraf.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href={`/${lokal}/ubah/`}
              className="group inline-flex items-center gap-2 rounded-full bg-bank px-5 py-2.5 text-sm text-kertas shadow-lembar transition-transform duration-200 ease-kertas hover:-translate-y-0.5"
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
              className="inline-flex items-center rounded-full border border-guilloche px-5 py-2.5 text-sm text-ink/75 transition-colors duration-200 ease-kertas hover:border-bank hover:text-bank"
            >
              {t.beranda.ajakanDua}
            </Link>
          </div>
        </div>

        {/* Lembar cek: kelompok tiga angka di atas, kata di garis jumlah. */}
        <div className="animate-naik-masuk tunda-2">
          <div className="lembar roset overflow-hidden">
            <div className="space-y-5 bg-kertas/90 p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="label">{t.ubah.labelAngka}</span>
                  <p className="tabular mt-1 font-mono text-xl">{t.beranda.angkaSorot}</p>
                </div>
                <div className="-mt-1 shrink-0">
                  <Cap judul={t.beranda.cap.judul} isi={t.beranda.cap.isi} />
                </div>
              </div>

              <div className="space-y-1">
                <span className="label">{t.ubah.kelompok}</span>
                <KurungKelompok
                  kelompok={kelompok}
                  labelKosong={t.ubah.kosong}
                  ejaan={OPSI_BAWAAN.ejaanMiliar}
                />
              </div>

              {sorot.type === 'ok' ? (
                <GarisJumlah kata={sorot.nilai} modeDokumen label={t.ubah.labelKata} />
              ) : null}
            </div>
          </div>
          {/* Tepi sobek, seperti cek yang dilepas dari bukunya. */}
          <div aria-hidden className="perforasi mx-3 -mt-[5px]" />
        </div>
      </section>

      {/* Empat angka yang menerangkan proyek ini dalam satu baris. */}
      <section className="grid gap-px overflow-hidden rounded-lembar border border-guilloche/70 bg-guilloche/60 sm:grid-cols-2 lg:grid-cols-4">
        {t.beranda.sifat.map((s) => (
          <div key={s.label} className="bg-tint p-5">
            <p className="tabular font-display text-2xl text-bank">{s.nilai}</p>
            <p className="mt-1 text-xs leading-snug text-ink/65">{s.label}</p>
          </div>
        ))}
      </section>

      {/* Tempat implementasi lain patah. Tiap baris dihitung oleh pustaka. */}
      <section className="space-y-4">
        <h2 className="font-display text-xl">{t.beranda.judulContoh}</h2>

        <ul className="lembar divide-y divide-guilloche/60 overflow-hidden">
          {CONTOH[lokal].map(([nilai, catatan, keliru]) => {
            const hasil = format(nilai);
            return (
              <li key={nilai.toString()} className="grid gap-2 p-5 sm:grid-cols-[14rem_1fr]">
                <div>
                  <p className="tabular font-mono text-sm text-ink/70">
                    {nilai.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                  </p>
                  <p className="mt-1 text-xs text-ink/50">{catatan}</p>
                </div>
                <div className="min-w-0">
                  <p className="break-words font-display text-lg text-bank">
                    {hasil.type === 'ok' ? hasil.nilai : hasil.galat.pesan}
                  </p>
                  <p className="mt-1 text-xs text-ink/45">
                    <span className="line-through decoration-void/60">{keliru}</span>
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Tiga pintu ke isi situs. */}
      <section className="grid gap-4 sm:grid-cols-3">
        {t.beranda.kartu.map((k) => (
          <Link
            key={k.ke}
            href={`/${lokal}/${k.ke}/`}
            className="lembar group flex flex-col gap-3 p-5 transition-all duration-300 ease-kertas hover:-translate-y-1 hover:shadow-angkat"
          >
            <h3 className="font-display text-lg">{k.judul}</h3>
            <p className="flex-1 text-xs leading-relaxed text-ink/65">{k.isi}</p>
            <span className="text-xs text-bank">
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
