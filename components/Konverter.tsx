'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { format, kelompokkan, OPSI_BAWAAN, parse, type Kelompok, type Options } from '@/lib';
import type { Teks } from '../app/kamus';
import { GarisJumlah } from './cheque/GarisJumlah';
import { KurungKelompok } from './cheque/KurungKelompok';
import { KurungLingkup } from './cheque/KurungLingkup';
import { Cap } from './cheque/Cap';
import { Penolakan } from './cheque/Penolakan';
import { BentukKeliru, Uraian } from './cheque/Uraian';
import { Roset } from './kerangka/Guilloche';
import { KolomAngka } from './KolomAngka';
import { PanelOpsi } from './PanelOpsi';
import { Tab, type IsiTab } from './Tab';
import { TombolSalin } from './TombolSalin';
import { tampilkan } from './masukan';
import { uraikan } from './urai';

type Arah = 'angka' | 'kata';

/**
 * Nilai yang sengaja dipilih: tempat implementasi lain patah. Labelnya angka
 * belaka, jadi tidak perlu diterjemahkan.
 */
const CONTOH: ReadonlyArray<{ readonly label: string; readonly nilai: string }> = [
  { label: '1.000', nilai: '1000' },
  { label: '1.000.001', nilai: '1000001' },
  { label: '101.000', nilai: '101000' },
  { label: '1.500,25', nilai: '1500,25' },
  { label: '2⁵³ + 1', nilai: '9007199254740993' },
  { label: '10¹⁸', nilai: '1000000000000000000' },
];

/**
 * Tidak ada yang dihitung di komponen ini: seluruh nilai berasal dari pustaka.
 * Yang dikerjakan di sini hanya keadaan masukan, hash URL, dan tata letak.
 */
export function Konverter({
  t,
  urai,
  galat,
}: {
  t: Teks['ubah'];
  urai: Teks['urai'];
  galat: Teks['galat'];
}) {
  const [arah, setArah] = useState<Arah>('angka');
  const [angka, setAngka] = useState('1000001');
  const [kata, setKata] = useState('dua ratus lima puluh ribu');
  const [opsi, setOpsi] = useState<Options>(OPSI_BAWAAN);
  const [modeDokumen, setModeDokumen] = useState(false);
  const [tautan, setTautan] = useState('');

  // Masukan dan opsi tinggal di hash supaya satu hasil bisa ditautkan apa adanya.
  useEffect(() => {
    const keadaan = bacaHash(window.location.hash);
    if (keadaan === undefined) return;
    setOpsi(keadaan.opsi);
    setArah(keadaan.arah);
    setModeDokumen(keadaan.modeDokumen);
    if (keadaan.angka !== undefined) setAngka(keadaan.angka);
    if (keadaan.kata !== undefined) setKata(keadaan.kata);
  }, []);

  useEffect(() => {
    const hash = tulisHash({ arah, angka, kata, opsi, modeDokumen });
    const alamat = `${window.location.pathname}${hash === '' ? '' : `#${hash}`}`;
    window.history.replaceState(null, '', alamat);
    setTautan(`${window.location.origin}${alamat}`);
  }, [arah, angka, kata, opsi, modeDokumen]);

  const hasilKata = useMemo(() => format(angka, opsi), [angka, opsi]);
  const hasilAngka = useMemo(() => parse(kata, opsi), [kata, opsi]);

  /* Sejalur dengan format, parse, dan kelompokkan di atas: uraikan satu-satunya
     hitungan jalur ketuk yang belum diingat, dan tetangganya semua sudah. */
  const bulatAngka = useMemo(() => bagianBulat(angka), [angka]);

  const kelompok: Kelompok[] = useMemo(
    () => (bulatAngka === undefined ? [] : kelompokkan(bulatAngka)),
    [bulatAngka],
  );

  const kelompokTerurai: Kelompok[] = useMemo(
    () => (hasilAngka.type === 'ok' ? kelompokkan(hasilAngka.nilai.bulat) : []),
    [hasilAngka],
  );

  const teksKata = hasilKata.type === 'ok' ? hasilKata.nilai : '';
  const teksDokumen = `# ${teksKata} #`;

  /*
   * Satu kalimat yang menyebutkan keadaan sekarang, entah hasil entah
   * penolakan, untuk wilayah hidup di bawah. Ia disusun di sini dan bukan di
   * dalam masing-masing komponen supaya wilayah hidupnya bisa selalu ada di
   * markah — wilayah hidup yang baru dipasang bersama isinya tidak diumumkan.
   */
  const hasilKini = arah === 'angka' ? hasilKata : hasilAngka;
  const ucapan =
    hasilKini.type === 'ok'
      ? arah === 'angka'
        ? modeDokumen
          ? `# ${teksKata} #`
          : teksKata
        : teksNilai(hasilAngka.type === 'ok' ? hasilAngka.nilai : NILAI_KOSONG)
      : `${galat[hasilKini.galat.type] ?? ''} ${hasilKini.galat.pesan}`;

  /** Yang disalin tombol utama, di arah mana pun — undefined bila ditolak. */
  const teksSalin =
    arah === 'angka'
      ? hasilKata.type === 'ok'
        ? modeDokumen
          ? teksDokumen
          : teksKata
        : undefined
      : hasilAngka.type === 'ok'
        ? teksNilai(hasilAngka.nilai)
        : undefined;

  /** Bilangan yang diuraikan di tab "cara kerjanya", di arah mana pun. */
  const bulatUrai =
    arah === 'angka' ? (hasilKata.type === 'ok' ? bulatAngka : undefined) : hasilAngka.type === 'ok' ? hasilAngka.nilai.bulat : undefined;

  const adaKeliru = useMemo(() => {
    if (bulatUrai === undefined) return false;
    const u = uraikan(bulatUrai, opsi);
    return u.adaKosong || u.adaLebur;
  }, [bulatUrai, opsi]);

  /*
   * Cap "Tersalin" dijatuhkan ke lembar setiap penyalinan berhasil. Kuncinya
   * hitungan, supaya menyalin dua kali berturut-turut memasang ulang capnya
   * dan geraknya berulang.
   */
  const [cap, setCap] = useState(0);
  const jamCap = useRef<number>();
  useEffect(() => () => window.clearTimeout(jamCap.current), []);
  function bubuhkanCap() {
    setCap((n) => n + 1);
    window.clearTimeout(jamCap.current);
    jamCap.current = window.setTimeout(() => setCap(0), 1800);
  }

  /*
   * Bilah salin di layar sempit muncul hanya ketika lembar ceknya sudah
   * tergulir keluar layar — saat membaca opsi atau uraian di bawahnya.
   * Selama lembarnya terlihat, tombol salin di lembar itu sendiri sudah cukup.
   */
  const lembar = useRef<HTMLDivElement>(null);
  const [lembarTerlihat, setLembarTerlihat] = useState(true);
  useEffect(() => {
    const el = lembar.current;
    if (el === null || typeof IntersectionObserver === 'undefined') return;
    const pengamat = new IntersectionObserver(([e]) => setLembarTerlihat(e?.isIntersecting ?? true));
    pengamat.observe(el);
    return () => pengamat.disconnect();
  }, []);

  const tabUrai: IsiTab[] =
    bulatUrai === undefined
      ? []
      : [
          {
            kunci: 'langkah',
            label: t.tabLangkah,
            isi:
              arah === 'angka' ? (
                <Uraian bulat={bulatUrai} opsi={opsi} t={urai} naif={false} />
              ) : (
                <div className="space-y-ruang6">
                  <KurungLingkup bulat={bulatUrai} opsi={opsi} ringkas={urai.lingkupGambar} />
                  <Uraian bulat={bulatUrai} opsi={opsi} t={urai} lingkup naif={false} />
                </div>
              ),
          },
          ...(adaKeliru
            ? [
                {
                  kunci: 'keliru',
                  label: t.tabKeliru,
                  isi: <BentukKeliru bulat={bulatUrai} opsi={opsi} t={urai} />,
                },
              ]
            : []),
        ];

  return (
    <div className="space-y-ruang5 pb-24 lg:pb-0">
      {/*
        Wilayah hidup untuk hasilnya. Ia selalu ada di markah, kosong pun,
        karena wilayah hidup yang baru dipasang bersama isinya tidak dibacakan
        — itulah sebabnya penolakan dahulu paling mungkin terlewat meski sudah
        memakai role="status". Isinya kalimat yang sama dengan yang terlihat,
        jadi tidak ada keterangan tambahan yang perlu dijaga tetap cocok.
      */}
      <p
        role="status"
        lang={arah === 'angka' && hasilKini.type === 'ok' ? 'id' : undefined}
        className="sr-only"
      >
        {ucapan}
      </p>

      {/*
        Meja kerja dua panel. Tiga anak, bukan dua, supaya urutan di layar
        sempit bisa disela — masukan, lembar cek, baru opsi — tanpa satu kelas
        order pun: urutan markah sudah urutan itu. Di layar lebar lembar ceknya
        berdiri di kolom kanan sepanjang dua baris dan melekat saat digulir,
        jadi setiap opsi yang diubah di kiri terlihat akibatnya di kanan tanpa
        menggulir di antara sebab dan akibat.
      */}
      <div className="grid items-start gap-ruang5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.12fr)] lg:gap-x-ruang6">
        <section className="lembar space-y-ruang5 p-5 sm:p-6 lg:col-start-1 lg:row-start-1">
          <SakelarArah t={t} arah={arah} ubah={setArah} />

          {arah === 'angka' ? (
            <>
              <KolomAngka
                nilai={angka}
                ubah={setAngka}
                label={t.labelAngka}
                petunjuk={t.petunjukAngka}
                kosongkan={t.kosongkan}
                pintas={t.pintas}
              />

              <div className="space-y-2">
                <span className="label">{t.contoh}</span>
                <div className="flex flex-wrap gap-1.5">
                  {CONTOH.map((c) => (
                    <button
                      key={c.nilai}
                      type="button"
                      onClick={() => setAngka(c.nilai)}
                      aria-pressed={angka === c.nilai}
                      className={`tabular inline-flex min-h-sasaran items-center rounded-full border px-3 py-1 font-mono text-kendali-kecil transition-all duration-200 ease-kertas ${
                        angka === c.nilai
                          ? 'border-bank bg-bank text-kertas'
                          : 'border-garis text-ink-sedang hover:-translate-y-0.5 hover:border-bank hover:text-bank'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <label className="block">
              <span className="label">{t.labelKataKeAngka}</span>
              <input
                value={kata}
                onChange={(e) => setKata(e.target.value)}
                spellCheck={false}
                autoComplete="off"
                aria-label={t.labelKataKeAngka}
                className="mt-1.5 w-full rounded-lembar border border-garis bg-kertas px-4 py-3 font-display text-besar outline-none transition-colors duration-200 ease-kertas focus:border-bank"
              />
              <span className="mt-2 block text-kecil text-ink-lirih">{t.petunjukKata}</span>
            </label>
          )}
        </section>

        <div ref={lembar} className="lg:sticky lg:top-20 lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <section
            aria-label={arah === 'angka' ? t.labelKata : t.hasilAngka}
            className="lembar relative overflow-hidden"
          >
            <Roset kelas="absolute -bottom-32 -right-28 h-80 w-80 text-guilloche opacity-50" />

            <div className="relative space-y-ruang4 p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="font-display text-dasar italic text-ink-sedang">{t.judulLembar}</span>
                {arah === 'angka' && hasilKata.type === 'ok' ? (
                  <Sakelar
                    label={t.modeDokumen}
                    aktif={modeDokumen}
                    ubah={() => setModeDokumen((n) => !n)}
                  />
                ) : null}
              </div>

              {arah === 'angka' ? (
                <>
                  {kelompok.length > 0 ? (
                    <KurungKelompok
                      kelompok={kelompok}
                      labelKosong={t.kosong}
                      ringkas={t.kelompokRingkas}
                      ejaan={opsi.ejaanMiliar}
                    />
                  ) : null}

                  {hasilKata.type === 'ok' ? (
                    <GarisJumlah kata={teksKata} modeDokumen={modeDokumen} label={t.labelKata} bisu />
                  ) : (
                    <Penolakan galat={hasilKata.galat} judul={galat[hasilKata.galat.type] ?? ''} />
                  )}
                </>
              ) : hasilAngka.type === 'ok' ? (
                <>
                  <div className="guilloche rounded-lembar border border-garis bg-kertas/60 px-4 py-3 sm:px-5">
                    <span className="label">{t.hasilAngka}</span>
                    <p
                      key={teksNilai(hasilAngka.nilai)}
                      className="tabular animate-kelompok-masuk mt-1 break-all font-mono text-jumlah text-bank"
                    >
                      {teksNilai(hasilAngka.nilai)}
                    </p>
                  </div>
                  <KurungKelompok
                    kelompok={kelompokTerurai}
                    labelKosong={t.kosong}
                    ringkas={t.kelompokRingkas}
                    ejaan={opsi.ejaanMiliar}
                  />
                </>
              ) : (
                <Penolakan galat={hasilAngka.galat} judul={galat[hasilAngka.galat.type] ?? ''} />
              )}

              {teksSalin === undefined ? null : (
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <TombolSalin
                    teks={teksSalin}
                    label={arah === 'angka' && modeDokumen ? t.salinDokumen : t.salinHasil}
                    labelTersalin={t.tersalin}
                    utama
                    besar
                    saatTersalin={bubuhkanCap}
                  />
                  <TombolSalin teks={tautan} label={t.bagikan} labelTersalin={t.tertaut} />
                </div>
              )}
            </div>

            {cap > 0 ? (
              <div key={cap} className="pointer-events-none absolute right-5 top-14">
                <Cap judul={t.tersalin} isi="✓" />
              </div>
            ) : null}
          </section>
          {/* Tepi sobek, seperti cek yang dilepas dari bukunya. */}
          <div aria-hidden className="perforasi mx-3 -mt-[5px]" />
        </div>

        <section className="lembar p-5 sm:p-6 lg:col-start-1 lg:row-start-2">
          <PanelOpsi
            opsi={opsi}
            ubah={setOpsi}
            judul={t.opsi}
            bawaanLabel={t.pulihkan}
            diubahLabel={t.diubah}
            sitasiLabel={t.sitasi}
          />
        </section>
      </div>

      {tabUrai.length === 0 ? null : (
        <section className="lembar p-5 sm:p-6">
          <Tab daftar={tabUrai} label={t.caraKerja} />
        </section>
      )}

      {/* Bilah salin di layar sempit, hanya saat lembarnya tak terlihat. */}
      {teksSalin === undefined || lembarTerlihat ? null : (
        <div className="animate-naik-masuk fixed inset-x-0 bottom-0 z-20 border-t border-guilloche bg-kertas/95 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 shadow-angkat backdrop-blur lg:hidden">
          <div className="mx-auto flex max-w-6xl items-center gap-3">
            <p
              aria-hidden
              lang={arah === 'angka' ? 'id' : undefined}
              className={`min-w-0 flex-1 truncate text-bank ${arah === 'angka' ? 'font-display text-dasar' : 'tabular font-mono text-dasar'}`}
            >
              {teksSalin}
            </p>
            <TombolSalin teks={teksSalin} label={t.salin} labelTersalin={t.tersalin} utama />
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Sakelar arah. Penanda meluncur di belakang tombol yang terpilih, sehingga
 * perpindahan arah terbaca sebagai satu benda yang bergeser, bukan dua tombol
 * yang berkedip.
 */
function SakelarArah({
  t,
  arah,
  ubah,
}: {
  t: Teks['ubah'];
  arah: Arah;
  ubah: (arah: Arah) => void;
}) {
  const pilihan: ReadonlyArray<{ readonly nilai: Arah; readonly label: string }> = [
    { nilai: 'angka', label: `${t.labelAngka} → ${t.labelKata}` },
    { nilai: 'kata', label: `${t.labelKataKeAngka} → ${t.labelAngka}` },
  ];

  /*
   * Radio di dalam fieldset, bukan dua tombol beraria-pressed: arahnya satu
   * dari dua, dan radio memberi posisi yang terucap serta penelusuran panah
   * tanpa satu baris ARIA pun. Penanda yang meluncur tetap ada di belakangnya
   * sebagai hiasan.
   */
  return (
    <fieldset className="relative grid w-full max-w-md grid-cols-2 rounded-full border border-garis bg-kertas/60 p-1">
      <legend className="sr-only">{t.tukar}</legend>

      <span
        aria-hidden
        className="absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-bank transition-transform duration-300 ease-kertas"
        style={{ transform: `translateX(${arah === 'angka' ? '0' : '100%'})` }}
      />

      {pilihan.map((p) => (
        <label key={p.nilai} className="relative z-10 cursor-pointer">
          <input
            type="radio"
            name="arah"
            value={p.nilai}
            checked={arah === p.nilai}
            onChange={() => ubah(p.nilai)}
            className="peer sr-only"
          />
          <span
            className={`flex min-h-sasaran items-center justify-center truncate rounded-full px-3 py-1.5 text-center text-kendali-kecil transition-colors duration-200 ease-kertas peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-bank sm:text-kendali ${
              arah === p.nilai ? 'text-kertas' : 'text-ink-sedang hover:text-bank'
            }`}
          >
            {p.label}
          </span>
        </label>
      ))}
    </fieldset>
  );
}

/** Sakelar mode dokumen: kurung pagar dipasang di kedua ujung jumlah. */
function Sakelar({
  label,
  aktif,
  ubah,
}: {
  label: string;
  aktif: boolean;
  ubah: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={aktif}
      onClick={ubah}
      className="group flex items-center gap-2.5 text-kendali text-ink-sedang"
    >
      <span
        aria-hidden
        className={`relative h-5 w-9 rounded-full border transition-colors duration-200 ease-kertas ${
          aktif ? 'border-bank bg-bank' : 'border-garis bg-tint'
        }`}
      >
        <span
          className={`absolute top-0.5 h-3.5 w-3.5 rounded-full transition-all duration-300 ease-kertas ${
            aktif ? 'left-[1.15rem] bg-kertas' : 'left-0.5 bg-guilloche'
          }`}
        />
      </span>
      {label}
    </button>
  );
}

/** Bagian bulat masukan sebagai bigint, atau undefined bila belum sah. */
function bagianBulat(masukan: string): bigint | undefined {
  const teks = masukan.trim().split('.').join('').split(',')[0] ?? '';
  const tanpaTanda = teks.startsWith('-') ? teks.slice(1) : teks;
  if (tanpaTanda === '' || !/^\d+$/.test(tanpaTanda)) return undefined;
  try {
    return BigInt(tanpaTanda);
  } catch {
    return undefined;
  }
}

const NILAI_KOSONG = { negatif: false, bulat: 0n, pecahan: '' };

function teksNilai(nilai: { negatif: boolean; bulat: bigint; pecahan: string }): string {
  const pecahan = nilai.pecahan === '' ? '' : `,${nilai.pecahan}`;
  return `${nilai.negatif ? '-' : ''}${tampilkan(nilai.bulat.toString())}${pecahan}`;
}

interface Keadaan {
  readonly arah: Arah;
  readonly angka?: string;
  readonly kata?: string;
  readonly opsi: Options;
  readonly modeDokumen: boolean;
}

function bacaHash(hash: string): Keadaan | undefined {
  if (!hash.startsWith('#')) return undefined;
  const p = new URLSearchParams(hash.slice(1));
  if ([...p.keys()].length === 0) return undefined;

  const angka = p.get('n');
  const kata = p.get('k');

  return {
    arah: p.get('arah') === 'kata' ? 'kata' : 'angka',
    angka: angka === null ? undefined : angka,
    kata: kata === null ? undefined : kata,
    modeDokumen: p.get('dok') === 'true',
    opsi: {
      sejuta: p.get('sejuta') === 'true',
      ejaanMiliar: p.get('ejaanMiliar') === 'varian' ? 'varian' : 'baku',
      mataUang: p.get('mataUang') === 'rupiah' ? 'rupiah' : 'tidak',
      sen: p.get('sen') === 'sen' ? 'sen' : 'koma',
      kapitalisasi:
        p.get('kapitalisasi') === 'judul'
          ? 'judul'
          : p.get('kapitalisasi') === 'kalimat'
            ? 'kalimat'
            : 'tidak',
    },
  };
}

/** Hanya yang menyimpang dari bawaan yang ditulis, supaya alamatnya tetap pendek. */
function tulisHash(keadaan: Keadaan): string {
  const p = new URLSearchParams();
  if (keadaan.arah !== 'angka') p.set('arah', keadaan.arah);
  if (keadaan.arah === 'angka') {
    if (keadaan.angka !== undefined && keadaan.angka !== '') p.set('n', keadaan.angka);
  } else if (keadaan.kata !== undefined && keadaan.kata !== '') {
    p.set('k', keadaan.kata);
  }
  if (keadaan.modeDokumen) p.set('dok', 'true');

  for (const [kunci, nilai] of Object.entries(keadaan.opsi)) {
    if (String(nilai) !== String(OPSI_BAWAAN[kunci as keyof Options])) {
      p.set(kunci, String(nilai));
    }
  }
  return p.toString();
}
