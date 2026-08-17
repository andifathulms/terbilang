/**
 * Kepatuhan token: mengunci tiga hal yang selama ini benar hanya karena
 * ditinjau tangan, bukan karena ditegakkan.
 *
 *   1. Tidak ada heksa atau rgb() mentah di komponen situs — hanya token.
 *   2. Tidak ada ukuran huruf sebarang — hanya tangga bernama di
 *      tailwind.config.ts.
 *   3. Rasio kontras yang dicatat di komentar globals.css memang tercapai,
 *      dihitung ulang dari nilai token itu sendiri, bukan disalin dari
 *      komentarnya.
 *
 * DESIGN-REWORK.md §3: mengubah dokumentasi warna terbaik di portofolio ini
 * dari catatan menjadi jaminan.
 */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const AKAR = join(__dirname, '..', '..');

/** Path yang boleh membawa heksa mentah, dan alasannya, dicatat di sini saja. */
const IZIN_HEKSA: Record<string, string> = {
  'app/layout.tsx': 'viewport.themeColor — meta tag, bukan style komponen; lihat PRD.md §8.',
};

function daftarBerkas(dir: string, akhiran: string): string[] {
  const hasil: string[] = [];
  for (const nama of readdirSync(dir)) {
    const penuh = join(dir, nama);
    if (statSync(penuh).isDirectory()) {
      hasil.push(...daftarBerkas(penuh, akhiran));
    } else if (nama.endsWith(akhiran)) {
      hasil.push(penuh);
    }
  }
  return hasil;
}

function relatif(path: string): string {
  return path.slice(AKAR.length + 1).split('\\').join('/');
}

const BERKAS_TSX = [
  ...daftarBerkas(join(AKAR, 'app'), '.tsx'),
  ...daftarBerkas(join(AKAR, 'components'), '.tsx'),
].map((p) => ({ path: p, relatif: relatif(p), isi: readFileSync(p, 'utf8') }));

describe('kepatuhan token — warna', () => {
  it('tidak ada heksa mentah di app/** atau components/**, kecuali yang berizin', () => {
    const POLA_HEKSA = /#[0-9a-fA-F]{3,8}\b/g;
    const pelanggar: string[] = [];

    for (const berkas of BERKAS_TSX) {
      if (berkas.relatif in IZIN_HEKSA) continue;
      const cocok = berkas.isi.match(POLA_HEKSA);
      if (cocok) pelanggar.push(`${berkas.relatif}: ${cocok.join(', ')}`);
    }

    expect(pelanggar).toEqual([]);
  });

  it('tidak ada rgb()/rgba() dengan angka mentah — hanya rgb(var(--token) / alfa)', () => {
    /* rgb(var(...)) sah, sumber token itu sendiri. Yang dilarang adalah
       rgb(255,0,0) atau serupanya: angka langsung, bukan variabel. */
    const POLA_RGB_MENTAH = /rgba?\(\s*\d/g;
    const pelanggar: string[] = [];

    for (const berkas of BERKAS_TSX) {
      const cocok = berkas.isi.match(POLA_RGB_MENTAH);
      if (cocok) pelanggar.push(`${berkas.relatif}: ${cocok.join(', ')}`);
    }

    expect(pelanggar).toEqual([]);
  });
});

describe('kepatuhan token — ukuran huruf', () => {
  it('tidak ada text-[...] sebarang — hanya tangga bernama di tailwind.config.ts', () => {
    const POLA_SEBARANG = /text-\[[^\]]+\]/g;
    const pelanggar: string[] = [];

    for (const berkas of BERKAS_TSX) {
      const cocok = berkas.isi.match(POLA_SEBARANG);
      if (cocok) pelanggar.push(`${berkas.relatif}: ${cocok.join(', ')}`);
    }

    expect(pelanggar).toEqual([]);
  });

  it('tidak ada kelas ukuran bawaan Tailwind — hanya label, kecil, dasar, kendali(-kecil), sedang, besar, judul, jumlah, sorot', () => {
    /* Tangga bawaan Tailwind (text-sm, text-4xl, dst.) masih ada di paket
       karena tailwind.config.ts memakai `extend`, bukan menimpa. Ada
       tidaknya kelas itu di className tidak dicegah oleh Tailwind sendiri —
       hanya di sini. */
    const POLA_BAWAAN = /\btext-(?:xs|sm|base|lg|(?:\d\.5)?xl|[2-9]xl)\b/g;
    const pelanggar: string[] = [];

    for (const berkas of BERKAS_TSX) {
      const cocok = berkas.isi.match(POLA_BAWAAN);
      if (cocok) pelanggar.push(`${berkas.relatif}: ${cocok.join(', ')}`);
    }

    expect(pelanggar).toEqual([]);
  });
});

/* ---------------------------------------------------------------------- */

interface Rgb {
  readonly r: number;
  readonly g: number;
  readonly b: number;
}

/**
 * Ambil isi blok CSS pertama yang cocok dengan `selektor`, dengan menghitung
 * kurung kurawal alih-alih regex tamak — globals.css punya dua blok :root,
 * dan yang dicari selalu yang pertama (token warna), bukan yang kedua
 * (tangga tipe dan ruang).
 */
function ambilBlok(css: string, selektor: string): string {
  const mulai = css.indexOf(selektor);
  if (mulai === -1) throw new Error(`selektor tidak ditemukan: ${selektor}`);
  const kurungBuka = css.indexOf('{', mulai);
  let dalam = 1;
  let i = kurungBuka + 1;
  while (dalam > 0) {
    if (css[i] === '{') dalam++;
    if (css[i] === '}') dalam--;
    i++;
  }
  return css.slice(kurungBuka + 1, i - 1);
}

function ambilToken(blok: string): Record<string, Rgb> {
  const token: Record<string, Rgb> = {};
  const pola = /--([\w-]+):\s*(\d+)\s+(\d+)\s+(\d+)\s*;/g;
  let cocok: RegExpExecArray | null;
  while ((cocok = pola.exec(blok)) !== null) {
    const [, nama, r, g, b] = cocok;
    if (nama === undefined || r === undefined || g === undefined || b === undefined) continue;
    token[nama] = { r: Number(r), g: Number(g), b: Number(b) };
  }
  return token;
}

/** Luminansi relatif WCAG. https://www.w3.org/TR/WCAG21/#dfn-relative-luminance */
function luminansi({ r, g, b }: Rgb): number {
  const linierkan = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * linierkan(r) + 0.7152 * linierkan(g) + 0.0722 * linierkan(b);
}

/** Rasio kontras WCAG. https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio */
function kontras(a: Rgb, b: Rgb): number {
  const [terang, gelap] = [luminansi(a), luminansi(b)].sort((x, y) => y - x);
  return ((terang ?? 0) + 0.05) / ((gelap ?? 0) + 0.05);
}

const css = readFileSync(join(AKAR, 'app', 'globals.css'), 'utf8');
const TEMA: Record<string, Record<string, Rgb>> = {
  siang: ambilToken(ambilBlok(css, ':root')),
  malam: ambilToken(ambilBlok(css, "[data-tema='malam']")),
};

/*
 * "Diukur terhadap latar tersulitnya" (globals.css) berarti latar yang
 * memberi kontras terendah, bukan satu latar tetap per tema — tint dan
 * kertas tidak selalu berurutan sama antara dua tema. Diperiksa terhadap
 * keduanya dan diambil yang terburuk, supaya jaminannya berlaku di mana pun
 * token itu benar-benar dipakai (body memakai tint, lembar cek memakai
 * kertas).
 */
function kontrasTerburuk(tema: Record<string, Rgb>, nama: string): number {
  const token = tema[nama];
  const tint = tema.tint;
  const kertas = tema.kertas;
  if (token === undefined || tint === undefined || kertas === undefined) {
    throw new Error(`token tidak ditemukan: ${nama}`);
  }
  return Math.min(kontras(token, tint), kontras(token, kertas));
}

describe('kepatuhan token — kontras', () => {
  const TEKS = ['ink', 'ink-sedang', 'ink-lirih', 'bank', 'void'] as const;
  const AMBANG_TEKS = 4.5;
  const AMBANG_NON_TEKS = 3.0;

  for (const namaTema of ['siang', 'malam'] as const) {
    describe(`tema ${namaTema}`, () => {
      const tema = TEMA[namaTema];
      if (tema === undefined) throw new Error(`tema tidak ditemukan: ${namaTema}`);

      it.each(TEKS)('%s terhadap latar tersulitnya >= 4.5:1', (nama) => {
        expect(kontrasTerburuk(tema, nama)).toBeGreaterThanOrEqual(AMBANG_TEKS);
      });

      it('garis (batas kendali, non-teks) terhadap latar tersulitnya >= 3:1', () => {
        expect(kontrasTerburuk(tema, 'garis')).toBeGreaterThanOrEqual(AMBANG_NON_TEKS);
      });
    });
  }
});
