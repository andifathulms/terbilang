/**
 * Situs saja. Pustaka tidak tahu berkas ini ada.
 *
 * basePath harus sama dengan nama repositori supaya GitHub Pages menemukan
 * asetnya; `pnpm preview` menyajikan ./out di bawah basePath yang sama agar
 * kekeliruan itu ketahuan sebelum didorong.
 */

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '/terbilang';

/** @type {import('next').NextConfig} */
export default {
  output: 'export',
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};
