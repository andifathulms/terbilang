'use client';

import { useEffect, useMemo, useState } from 'react';
import { format, kelompokkan, OPSI_BAWAAN, parse, type Kelompok, type Options } from '@/lib';
import type { Teks } from '../app/kamus';
import { GarisJumlah } from './cheque/GarisJumlah';
import { KurungKelompok } from './cheque/KurungKelompok';
import { Penolakan } from './cheque/Penolakan';
import { KolomAngka } from './KolomAngka';
import { PanelOpsi } from './PanelOpsi';
import { TombolSalin } from './TombolSalin';
import { tampilkan } from './masukan';

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
export function Konverter({ t, galat }: { t: Teks['ubah']; galat: Teks['galat'] }) {
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

  const kelompok: Kelompok[] = useMemo(() => {
    const bulat = bagianBulat(angka);
    return bulat === undefined ? [] : kelompokkan(bulat);
  }, [angka]);

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

  return (
    <div className="space-y-8">
      <SakelarArah t={t} arah={arah} ubah={setArah} />

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

      {arah === 'angka' ? (
        <section className="lembar roset overflow-hidden">
          <div className="space-y-6 bg-kertas/90 p-5 sm:p-7">
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

            {kelompok.length > 0 ? (
              <div className="space-y-1.5">
                <span className="label">{t.kelompok}</span>
                <KurungKelompok
                  kelompok={kelompok}
                  labelKosong={t.kosong}
                  ringkas={t.kelompokRingkas}
                  ejaan={opsi.ejaanMiliar}
                />
              </div>
            ) : null}

            {hasilKata.type === 'ok' ? (
              <div className="space-y-4">
                <GarisJumlah kata={teksKata} modeDokumen={modeDokumen} label={t.labelKata} bisu />

                <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
                  <Sakelar
                    label={t.modeDokumen}
                    aktif={modeDokumen}
                    ubah={() => setModeDokumen((n) => !n)}
                  />
                  <div className="ml-auto flex flex-wrap gap-2">
                    <TombolSalin
                      teks={modeDokumen ? teksDokumen : teksKata}
                      label={modeDokumen ? t.salinDokumen : t.salin}
                      labelTersalin={t.tersalin}
                      utama
                    />
                    <TombolSalin teks={tautan} label={t.bagikan} labelTersalin={t.tertaut} />
                  </div>
                </div>
              </div>
            ) : (
              <Penolakan galat={hasilKata.galat} judul={galat[hasilKata.galat.type] ?? ''} />
            )}
          </div>
        </section>
      ) : (
        <section className="lembar roset overflow-hidden">
          <div className="space-y-6 bg-kertas/90 p-5 sm:p-7">
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

            {hasilAngka.type === 'ok' ? (
              <div className="space-y-5">
                <div className="guilloche rounded-lembar border border-garis bg-kertas/60 px-4 py-3 sm:px-5">
                  <span className="label">{t.hasilAngka}</span>
                  <p
                    key={teksNilai(hasilAngka.nilai)}
                    className="tabular animate-kelompok-masuk mt-1 break-all font-mono text-jumlah text-bank"
                  >
                    {teksNilai(hasilAngka.nilai)}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <span className="label">{t.kelompok}</span>
                  <KurungKelompok
                    kelompok={kelompokTerurai}
                    labelKosong={t.kosong}
                  ringkas={t.kelompokRingkas}
                    ejaan={opsi.ejaanMiliar}
                  />
                </div>

                <div className="flex flex-wrap justify-end gap-2">
                  <TombolSalin
                    teks={teksNilai(hasilAngka.nilai)}
                    label={t.salin}
                    labelTersalin={t.tersalin}
                    utama
                  />
                  <TombolSalin teks={tautan} label={t.bagikan} labelTersalin={t.tertaut} />
                </div>
              </div>
            ) : (
              <Penolakan galat={hasilAngka.galat} judul={galat[hasilAngka.galat.type] ?? ''} />
            )}
          </div>
        </section>
      )}

      <PanelOpsi opsi={opsi} ubah={setOpsi} judul={t.opsi} bawaanLabel={t.pulihkan} />
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
