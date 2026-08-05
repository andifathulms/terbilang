/**
 * Sajikan ./out di bawah basePath produksi.
 *
 * Situs yang benar di localhost/ dan rusak di /terbilang/ adalah kekeliruan
 * yang hanya ketahuan bila pratinjau memakai basePath yang sama dengan Pages.
 */
import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '/terbilang';
const akar = 'out';
const port = Number(process.env.PORT ?? 4173);

const TIPE = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
};

if (!existsSync(akar)) {
  console.error('preview: jalankan `pnpm build` lebih dahulu — ./out belum ada');
  process.exit(1);
}

function berkasUntuk(urlPath) {
  let sisa = urlPath;
  if (basePath && sisa.startsWith(basePath)) sisa = sisa.slice(basePath.length);
  if (!sisa.startsWith('/')) sisa = `/${sisa}`;

  const kandidat = normalize(join(akar, decodeURIComponent(sisa)));
  if (!kandidat.startsWith(akar)) return undefined; // tolak lintas direktori

  if (existsSync(kandidat) && statSync(kandidat).isFile()) return kandidat;
  const indeks = join(kandidat, 'index.html');
  if (existsSync(indeks)) return indeks;
  const html = `${kandidat.replace(/\/$/, '')}.html`;
  if (existsSync(html)) return html;
  return undefined;
}

createServer((req, res) => {
  const urlPath = new URL(req.url ?? '/', 'http://localhost').pathname;

  if (basePath && !urlPath.startsWith(basePath)) {
    res.writeHead(302, { location: `${basePath}/` });
    res.end();
    return;
  }

  const berkas = berkasUntuk(urlPath);
  if (!berkas) {
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    res.end(`404 — ${urlPath}`);
    return;
  }

  res.writeHead(200, { 'content-type': TIPE[extname(berkas)] ?? 'application/octet-stream' });
  createReadStream(berkas).pipe(res);
}).listen(port, () => {
  console.log(`preview: http://localhost:${port}${basePath}/`);
});
