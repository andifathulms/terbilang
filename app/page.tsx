'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Akar situs. Ekspor statis tidak punya server untuk mengalihkan, jadi
 * pengalihan dilakukan di klien — dengan tautan yang tetap bisa diklik bila
 * JavaScript tidak jalan.
 */
export default function Akar() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/id/');
  }, [router]);

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-6">
      <p className="font-display text-judul">
        <Link href="/id/" className="text-bank underline decoration-garis underline-offset-4">
          Terbilang
        </Link>
      </p>
      <p className="mt-2 text-dasar text-ink-sedang">Bilangan Indonesia dieja menjadi kata.</p>
    </main>
  );
}
