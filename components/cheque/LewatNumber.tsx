import { format } from '@/lib';

/**
 * Peragaan hilangnya presisi, dijalankan sungguhan.
 *
 * Situs ini menyatakan bahwa implementasi berbasis number salah diam-diam di
 * atas 2⁵³, lalu tidak pernah memperlihatkan salahnya jadi apa. Seluruh daya
 * keterangan itu ada pada melihat digit terakhirnya berubah.
 *
 * Nilainya benar-benar dilewatkan Number() lalu dikembalikan ke BigInt saat
 * halaman dibangun — bukan angka yang dikarang, bukan pembulatan yang ditiru.
 * Ini satu-satunya tempat di situs yang sengaja memakai number, dan gunanya
 * memang untuk memperlihatkan number gagal.
 */
export function LewatNumber({
  nilai,
  labelUtuh,
  labelNumber,
  catatan,
}: {
  nilai: bigint;
  labelUtuh: string;
  labelNumber: string;
  catatan: string;
}) {
  const rusak = BigInt(Number(nilai));
  if (rusak === nilai) return null;

  const utuh = format(nilai);
  const setelah = format(rusak);
  if (utuh.type !== 'ok' || setelah.type !== 'ok') return null;

  const bertitik = (n: bigint) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  return (
    <div className="space-y-ruang3 border-t border-guilloche/60 bg-tint/40 p-5 sm:p-6">
      <div className="space-y-1">
        <p className="label">{labelUtuh}</p>
        <p className="tabular break-all font-mono text-dasar text-ink">{bertitik(nilai)}</p>
        <p lang="id" className="break-words font-display text-dasar text-bank">
          {utuh.nilai}
        </p>
      </div>

      <div className="space-y-1">
        <p className="label text-void">{labelNumber}</p>
        <p className="tabular break-all font-mono text-dasar text-void">{bertitik(rusak)}</p>
        <p lang="id" className="break-words font-display text-dasar text-void">
          {setelah.nilai}
        </p>
      </div>

      <p className="max-w-2xl text-kecil text-ink-sedang">{catatan}</p>
    </div>
  );
}
