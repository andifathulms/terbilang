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
  const kataSorot = sorot.type === 'ok' ? sorot.nilai : null;

  return (
    <div className="space-y-ruang8">
      {/*
        Sorot: judul di kiri, lembar cek di kanan pada layar lebar. Judulnya
        adalah contoh yang sudah jadi — angka, panah, kata — karena satu contoh
        menerangkan alat ini lebih cepat daripada kalimat mana pun tentangnya.
      */}
      <section className="grid items-center gap-ruang7 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        <div className="animate-naik-masuk space-y-ruang5">
          <p className="label">{t.beranda.mata}</p>

          <h1 className="flex flex-wrap items-baseline gap-x-ruang3 gap-y-ruang1 font-display text-sorot">
            <span className="tabular font-mono text-ink">{t.beranda.angkaSorot}</span>
            <span aria-hidden className="text-ink-lirih">
              →
            </span>
            <span className="sr-only">{t.beranda.panah}</span>
            {kataSorot === null ? null : <span className="text-bank">{kataSorot}</span>}
          </h1>

          <p className="max-w-xl text-sedang text-ink">{t.beranda.kepala}</p>

          <div className="max-w-xl space-y-ruang4 text-dasar text-ink-sedang">
            {t.beranda.paragraf.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>

          <div className="flex flex-wrap gap-ruang3">
            <Link
              href={`/${lokal}/ubah/`}
              className="group inline-flex items-center gap-2 rounded-full bg-bank px-5 py-2.5 text-dasar text-kertas shadow-lembar transition-transform duration-200 ease-kertas hover:-translate-y-0.5"
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
              className="inline-flex items-center rounded-full border border-garis px-5 py-2.5 text-dasar text-ink-sedang transition-colors duration-200 ease-kertas hover:border-bank hover:text-bank"
            >
              {t.beranda.ajakanDua}
            </Link>
          </div>
        </div>

        {/*
          Lembar cek. Urutannya kini menegaskan arah: angka masuk di kolom yang
          berbentuk kolom masukan, panah turun, lalu kata di garis jumlah.
          Kurung kelompok pindah ke bawah sebagai keterangan cara kerja — ia
          menerangkan mekanismenya, bukan hasil ketiga yang setara.
        */}
        <div className="animate-naik-masuk tunda-2">
          <Link
            href={`/${lokal}/ubah/`}
            className="lembar roset group block overflow-hidden transition-all duration-300 ease-kertas hover:-translate-y-1 hover:shadow-angkat"
          >
            <div className="space-y-ruang4 bg-kertas/90 p-5 sm:p-6">
              <div className="flex items-start justify-between gap-ruang4">
                <div className="min-w-0 flex-1">
                  <span className="label">{t.ubah.labelAngka}</span>
                  <p className="kolom-semu tabular mt-1.5 font-mono text-sedang text-ink transition-colors duration-200 ease-kertas group-hover:border-bank">
                    {t.beranda.angkaSorot}
                  </p>
                </div>
                <div className="-mt-1 shrink-0">
                  <Cap judul={t.beranda.cap.judul} isi={t.beranda.cap.isi} />
                </div>
              </div>

              {/* Arah dinyatakan, tidak disiratkan oleh susunan saja. */}
              <p aria-hidden className="text-center text-sedang leading-none text-ink-lirih">
                ↓
              </p>

              {kataSorot === null ? null : (
                <GarisJumlah kata={kataSorot} modeDokumen label={t.ubah.labelKata} />
              )}

              <div className="border-t border-guilloche/60 pt-ruang4">
                <span className="label">{t.beranda.caraKerja}</span>
                <div className="mt-1.5 scale-90 origin-left">
                  <KurungKelompok
                    kelompok={kelompok}
                    labelKosong={t.ubah.kosong}
                    ejaan={OPSI_BAWAAN.ejaanMiliar}
                  />
                </div>
              </div>

              <p className="text-kecil text-bank">
                {t.beranda.ketik}
                <span
                  aria-hidden
                  className="ml-1 inline-block transition-transform duration-200 ease-kertas group-hover:translate-x-1"
                >
                  →
                </span>
              </p>
            </div>
          </Link>
          {/* Tepi sobek, seperti cek yang dilepas dari bukunya. */}
          <div aria-hidden className="perforasi mx-3 -mt-[5px]" />
        </div>
      </section>

      {/* Tempat implementasi lain patah. Tiap baris dihitung oleh pustaka. */}
      <section className="space-y-ruang4">
        <h2 className="font-display text-besar">{t.beranda.judulContoh}</h2>
        <p className="max-w-2xl text-dasar text-ink-sedang">{t.beranda.ringkasContoh}</p>

        <ul className="lembar divide-y divide-guilloche/60 overflow-hidden">
          {CONTOH[lokal].map(([nilai, catatan, keliru]) => {
            const hasil = format(nilai);
            return (
              <li key={nilai.toString()} className="grid gap-2 p-5 sm:grid-cols-[14rem_1fr]">
                <div>
                  <p className="tabular font-mono text-dasar text-ink">
                    {nilai.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                  </p>
                  <p className="mt-1 text-kecil text-ink-lirih">{catatan}</p>
                </div>
                <div className="min-w-0">
                  <p className="break-words font-display text-sedang text-bank">
                    {hasil.type === 'ok' ? hasil.nilai : hasil.galat.pesan}
                  </p>
                  <p className="mt-1 text-kecil text-ink-lirih">
                    <span className="line-through decoration-void/60">{keliru}</span>
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {/*
        Empat angka tentang pustakanya. Diletakkan setelah contoh: ini keterangan
        untuk yang sudah paham alatnya, bukan pengantar bagi yang belum.
      */}
      <section className="space-y-ruang4">
        <h2 className="font-display text-besar">{t.beranda.judulSifat}</h2>

        <div className="grid gap-px overflow-hidden rounded-lembar border border-guilloche/70 bg-guilloche/60 sm:grid-cols-2 lg:grid-cols-4">
          {t.beranda.sifat.map((s) => (
            <div key={s.label} className="bg-tint p-5">
              <p className="tabular font-display text-besar text-bank">{s.nilai}</p>
              <p className="mt-1 text-kecil text-ink-sedang">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tiga pintu ke isi situs. */}
      <section className="grid gap-ruang4 sm:grid-cols-3">
        {t.beranda.kartu.map((k) => (
          <Link
            key={k.ke}
            href={`/${lokal}/${k.ke}/`}
            className="lembar group flex flex-col gap-ruang3 p-5 transition-all duration-300 ease-kertas hover:-translate-y-1 hover:shadow-angkat"
          >
            <h3 className="font-display text-sedang">{k.judul}</h3>
            <p className="flex-1 text-dasar text-ink-sedang">{k.isi}</p>
            <span className="text-kecil text-bank">
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
