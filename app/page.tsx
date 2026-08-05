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
    <main className="mx-auto max-w-2xl px-6 py-24">
      <p className="font-display text-2xl">
        <Link href="/id/" className="text-bank underline underline-offset-4">
          Terbilang
        </Link>
      </p>
    </main>
  );
}
