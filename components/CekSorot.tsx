'use client';

import { useMemo, useState } from 'react';
import { format, kelompokkan, OPSI_BAWAAN } from '@/lib';
import type { Lokal, Teks } from '../app/kamus';
import { GarisJumlah } from './cheque/GarisJumlah';
import { KurungKelompok } from './cheque/KurungKelompok';
import { Penolakan } from './cheque/Penolakan';
import { KolomAngka } from './KolomAngka';

/*
 * Tautan ke pengubah ditulis sebagai <a> biasa, bukan next/link. Di dalam
 * komponen klien, next/link menyeret 8,5 kB gzip ke bundel beranda dan
 * mendorongnya melewati batas 100 kB (PRD.md §10) — untuk satu tautan yang
 * toh membuka halaman yang membaca keadaannya sendiri dari hash. Karena itu
 * basePath dipasang tangan.
 */
const BASIS = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

/** Nilai pembuka dan contoh cepat — masing-masing tempat implementasi lain patah. */
const AWAL = '1000001';
const CONTOH: ReadonlyArray<{ readonly label: string; readonly nilai: string }> = [
  { label: '1.000', nilai: '1000' },
  { label: '1.000.001', nilai: '1000001' },
  { label: '250.000', nilai: '250000' },
  { label: '2⁵³ + 1', nilai: '9007199254740993' },
  { label: '10¹⁸', nilai: '1000000000000000000' },
];

/**
 * Lembar cek di sorot beranda — yang bisa diketik, bukan gambar pengubah.
 * Dahulu sorot beranda adalah tautan berbentuk cek, sehingga ketukan pertama
 * pengunjung adalah memuat halaman lain alih-alih mengetik.
 *
 * Versi ringkas dari Konverter: satu arah, opsi bawaan, tanpa hash. Yang
 * ingin mengubah opsi atau membaca balik dibawa ke pengubah lengkap dengan
 * nilainya terbawa di hash. Tidak ada yang dihitung di sini — format dan
 * kelompokkan dari pustaka, sama seperti di pengubah.
 *
 * Nilai awalnya dirender saat halaman dibangun, jadi lembar ini sudah berisi
 * sebelum JavaScript menyala, dan tetap berisi tanpanya.
 */
export function CekSorot({ lokal, t }: { lokal: Lokal; t: Teks }) {
  const [angka, setAngka] = useState(AWAL);
  const hasil = useMemo(() => format(angka), [angka]);

  const bulat = useMemo(() => {
    const digit = angka.split(',')[0] ?? '';
    return /^\d+$/.test(digit) ? BigInt(digit) : undefined;
  }, [angka]);
  const kelompok = useMemo(() => (bulat === undefined ? [] : kelompokkan(bulat)), [bulat]);

  const kata = hasil.type === 'ok' ? hasil.nilai : '';
  const ucapan =
    hasil.type === 'ok' ? kata : `${t.galat[hasil.galat.type] ?? ''} ${hasil.galat.pesan}`;

  return (
    <div>
      <section
        aria-label={t.beranda.labelLembar}
        className="relative overflow-hidden rounded-lembar border border-guilloche bg-kertas text-ink shadow-pita"
      >
        <div className="roset pointer-events-none absolute inset-0 opacity-40" aria-hidden />

        <div className="relative space-y-ruang4 p-5 sm:p-6">
          {/*
            Cap "Diuji tuntas" tidak dirender di sini: ia hiasan tanpa keadaan,
            jadi beranda memasangnya dari komponen server di atas lembar ini
            dan ia tidak ikut menambah bundel klien. Ruang kanan baris ini
            disisakan untuknya.
          */}
          <p className="min-h-12 pr-36 font-display text-dasar italic text-ink-sedang">{t.ubah.judulLembar}</p>

          <KolomAngka
            nilai={angka}
            ubah={setAngka}
            label={t.ubah.labelAngka}
            petunjuk=""
            kosongkan={t.ubah.kosongkan}
            pintas=""
          />

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="label mr-1">{t.beranda.coba}</span>
            {CONTOH.map((c) => (
              <button
                key={c.nilai}
                type="button"
                onClick={() => setAngka(c.nilai)}
                aria-pressed={angka === c.nilai}
                className={`tabular inline-flex min-h-sasaran items-center rounded-full border px-2.5 py-0.5 font-mono text-kendali-kecil transition-colors duration-200 ease-kertas ${
                  angka === c.nilai
                    ? 'border-bank bg-bank text-kertas'
                    : 'border-garis text-ink-sedang hover:border-bank hover:text-bank'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {kelompok.length > 0 ? (
            <KurungKelompok
              kelompok={kelompok}
              labelKosong={t.ubah.kosong}
              ringkas={t.ubah.kelompokRingkas}
              ejaan={OPSI_BAWAAN.ejaanMiliar}
              padat
            />
          ) : null}

          {/* Wilayah hidup yang selalu ada, seperti di pengubah. */}
          <p role="status" lang={hasil.type === 'ok' ? 'id' : undefined} className="sr-only">
            {ucapan}
          </p>

          {hasil.type === 'ok' ? (
            <GarisJumlah kata={kata} modeDokumen label={t.ubah.labelKata} bisu />
          ) : (
            <Penolakan galat={hasil.galat} judul={t.galat[hasil.galat.type] ?? ''} />
          )}

          {/*
            Tanpa tombol salin di sini, dengan sengaja: beranda berada tepat di
            batas 100 kB (PRD.md §10), dan tombol itu menarik modul bersama ke
            bundelnya. Lembar ini memperagakan; menyalin dikerjakan di pengubah,
            yang dibuka tautan ini dengan nilai yang sama.
          */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1">
            <a
              href={`${BASIS}/${lokal}/ubah/${angka === '' ? '' : `#n=${encodeURIComponent(angka)}`}`}
              className="group inline-flex min-h-sasaran items-center gap-1.5 rounded-full bg-bank px-4 py-1.5 text-kendali-kecil text-kertas transition-colors duration-200 ease-kertas hover:bg-ink"
            >
              {t.beranda.bukaPengubah}
              <span aria-hidden className="transition-transform duration-200 ease-kertas group-hover:translate-x-0.5">
                →
              </span>
            </a>
          </div>
        </div>
      </section>
      {/* Tepi sobek, seperti cek yang dilepas dari bukunya. */}
      <div aria-hidden className="perforasi-hutan mx-3 -mt-[5px]" />
    </div>
  );
}
