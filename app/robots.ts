import type { MetadataRoute } from 'next';

/**
 * Tidak ada yang perlu disembunyikan dari perayap: seluruh situs statis dan
 * publik. Berkas ini ada supaya peta situsnya disebutkan, bukan supaya ada
 * yang dilarang.
 */
export const dynamic = 'force-static';

const ASAL = 'https://andifathulms.github.io';
const BASIS = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${ASAL}${BASIS}/sitemap.xml`,
  };
}
