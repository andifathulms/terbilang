import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { format } from '@/lib';
import { BATERAI } from '../../../data/survey/baterai';
import rekamanJson from '../../../data/survey/hasil.json';
import type { RekamanSurvei } from '../../../data/survey/skema';
import type { Kelas } from '../../../tests/survey/klasifikasi';
import { KAMUS, LOKAL, lokalSah, type Lokal } from '../../kamus';
import { metaHalaman } from '../../meta';
import { kelompokkanModus, statusBaris, type StatusBaris } from './kelompokkan';

export function generateStaticParams() {
  return LOKAL.map((locale) => ({ locale }));
}

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const lokal: Lokal = lokalSah(params.locale) ? params.locale : 'id';
  const t = KAMUS[lokal];
  return metaHalaman({ lokal, jalur: 'survei', judul: t.survei.judul, ringkas: t.survei.ringkas });
}

const rekaman = rekamanJson as RekamanSurvei;

function kataKita(masukan: string): string {
  const hasil = format(masukan);
  return hasil.type === 'ok' ? hasil.nilai : `— ${hasil.galat.type}`;
}

function bertitik(digit: string): string {
  return digit.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/**
 * Tanda kedua di samping warna untuk tiap status, supaya warna tidak
 * sendirian membawa arti — lihat DESIGN-REWORK.md §1.1. void hanya dipakai
 * untuk "menolak": paket yang benar-benar melempar galat saat dijalankan
 * adalah penolakan dalam pengertian yang sama dengan invariant 14, bukan
 * sekadar berbeda hasil.
 */
function Tanda({ status }: { status: StatusBaris }) {
  if (status === 'menolak') {
    return (
      <span
        aria-hidden
        className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-void/50 text-label leading-none text-void"
      >
        !
      </span>
    );
  }
  if (status === 'beda') {
    return (
      <span aria-hidden className="inline-block w-4 shrink-0 text-center text-ink-sedang">
        ≠
      </span>
    );
  }
  if (status === 'sama') {
    return (
      <span aria-hidden className="inline-block w-4 shrink-0 text-center text-ink-lirih">
        =
      </span>
    );
  }
  return (
    <span aria-hidden className="inline-block w-4 shrink-0 text-center text-ink-lirih">
      —
    </span>
  );
}

const WARNA_STATUS: Record<StatusBaris, string> = {
  sama: 'text-ink-sedang',
  beda: 'text-ink-sedang',
  menolak: 'text-void',
  'tak-terekam': 'text-ink-lirih',
};

/**
 * Lencana kelas (bug kami / bug mereka / varian sah). Tidak satu pun memakai
 * void — invariant 14 menyediakannya untuk penolakan, dan sebuah paket yang
 * menghasilkan kata berbeda bukan penolakan, betapapun itu keliru. Bentuknya
 * berbeda per kelas supaya bukan cuma warna yang membedakan.
 */
function LencanaKelas({ kelas, label }: { kelas: Kelas; label: string }) {
  const tanda = kelas === 'bug-kita' ? '■' : kelas === 'bug-mereka' ? '●' : '✓';
  const warna = kelas === 'varian-sah' ? 'text-ink-lirih' : 'text-ink-sedang';
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-garis px-2.5 py-1 text-kecil ${warna}`}
    >
      <span aria-hidden>{tanda}</span>
      {label}
    </span>
  );
}

export default function Survei({ params }: { params: { locale: string } }) {
  if (!lokalSah(params.locale)) notFound();
  const lokal: Lokal = params.locale;
  const t = KAMUS[lokal];

  const belumDirekam = rekaman.paket.length === 0;

  const status = rekaman.hasil.map((baris) => statusBaris(baris, kataKita(baris.masukan)));
  const jumlahSama = status.filter((s) => s === 'sama').length;
  const jumlahBeda = status.filter((s) => s === 'beda').length;
  const jumlahMenolak = status.filter((s) => s === 'menolak').length;

  const kelasLabel: Record<Kelas, string> = {
    'bug-kita': t.survei.kelasBugKita,
    'bug-mereka': t.survei.kelasBugMereka,
    'varian-sah': t.survei.kelasVarianSah,
  };

  const kelompok = kelompokkanModus(rekaman, lokal, kataKita);

  return (
    <div className="space-y-8">
      <header className="max-w-2xl space-y-3">
        <h1 className="font-display text-judul">{t.survei.judul}</h1>
        <p className="text-dasar text-ink-sedang">{t.survei.ringkas}</p>

        {rekaman.direkamPada === null ? null : (
          <p className="flex flex-wrap gap-2 text-kecil text-ink-lirih">
            <span className="rounded-full border border-guilloche/70 px-2.5 py-1">
              {lokal === 'id' ? 'Direkam' : 'Recorded'} {rekaman.direkamPada}
            </span>
            <span className="rounded-full border border-guilloche/70 px-2.5 py-1 font-mono">
              {rekaman.runtime}
            </span>
          </p>
        )}
      </header>

      {belumDirekam ? null : (
        <section className="flex flex-wrap items-center gap-2 text-kecil" aria-label={t.survei.keterangan}>
          <span className="label mr-1">{t.survei.keterangan}</span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-garis px-2.5 py-1 text-ink-sedang">
            <Tanda status="sama" />
            {jumlahSama} {t.survei.sama}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-garis px-2.5 py-1 text-ink-sedang">
            <Tanda status="beda" />
            {jumlahBeda} {t.survei.beda}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-void/40 bg-void/[0.06] px-2.5 py-1 text-void">
            <Tanda status="menolak" />
            {jumlahMenolak} {t.survei.menolak}
          </span>
        </section>
      )}

      {/*
        Sumbunya adalah modus kegagalan, bukan kolom per paket — satu kolom
        per paket membuat halaman ini dibaca sebagai papan skor, dan itu
        persis yang invariant 12 dan PRD.md §5.4 menolaknya. Rekaman yang
        sama disusun ulang di sini; tabel per baris tetap ada di bawah
        sebagai rujukan presisi.
      */}
      {kelompok.length === 0 ? null : (
        <section className="space-y-4">
          <div className="max-w-2xl space-y-2">
            <h2 id="modus" className="font-display text-besar">
              {t.survei.judulModus}
            </h2>
            <p className="text-dasar text-ink-sedang">{t.survei.ringkasModus}</p>
          </div>

          <div className="space-y-4">
            {kelompok.map((k) => (
              <article key={k.kunci} className="lembar space-y-4 p-5 sm:p-6">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="font-display text-sedang">{k.judul}</h3>
                  <LencanaKelas kelas={k.kelas} label={kelasLabel[k.kelas]} />
                </div>
                <p className="max-w-2xl text-dasar text-ink-sedang">{k.deskripsi}</p>

                <ul className="space-y-3">
                  {k.contoh.map((c) => (
                    <li
                      key={`${c.paket}-${c.masukan}`}
                      className="space-y-1.5 rounded-lembar border border-guilloche/60 bg-tint/40 p-3.5 sm:p-4"
                    >
                      <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1 text-kecil text-ink-lirih">
                        <span className="tabular font-mono text-ink-sedang">{bertitik(c.masukan)}</span>
                        <span>
                          {c.paket}
                          <span className="font-mono"> @{c.versi}</span>
                        </span>
                      </div>

                      <p lang="id" className="font-display text-dasar text-bank">
                        {c.kami}
                      </p>

                      <p className={`flex items-start gap-1.5 text-dasar ${WARNA_STATUS[statusBaris(c, c.kami)]}`}>
                        <Tanda status={statusBaris(c, c.kami)} />
                        <span lang={c.galat === null ? 'id' : undefined}>{c.galat ?? c.keluaran}</span>
                      </p>

                      <p className="text-kecil text-ink-lirih">{c.catatan}</p>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>
      )}

      {/*
        Baterai masukan selalu tampil, direkam atau belum: kolom terbilang
        adalah keluaran pustaka ini sendiri, dan itu sudah punya nilai sebagai
        rujukan meski belum ada paket pembanding. Karena itu tabelnya
        didahulukan, dan keterangan "belum ada paket" turun ke bawahnya —
        pembaca yang datang ke halaman kosong tetap menemukan sesuatu yang
        bisa dibaca, alih-alih pemberitahuan bahwa tidak ada apa-apa.
      */}
      <section className="space-y-3">
        <div className="max-w-2xl space-y-2">
          <h2 id="baterai" className="font-display text-besar">
            {t.survei.judulRujukan}
          </h2>
          <p className="text-dasar text-ink-sedang">{t.survei.ringkasRujukan}</p>
        </div>

        <div className="lembar overflow-hidden">
          <div className="overflow-x-auto">
            {/*
              Tabel dinamai lewat judul bagian yang sudah terlihat, bukan
              <caption> baru yang mengulang kalimat yang sama tepat di
              atasnya. scope tetap dipakai — itu yang mengikat sel ke
              kepalanya, dan tanpa itu isi kolom sebuah paket dibacakan tanpa
              menyebut paket mana.
            */}
            <table aria-labelledby="baterai" className="w-full border-collapse text-kecil">
              <thead>
                <tr className="border-b border-guilloche bg-tint/50 text-left">
                  <th scope="col" className="px-4 py-2.5 font-medium sm:px-5">
                    {t.survei.masukan}
                  </th>
                  <th scope="col" className="px-4 py-2.5 font-medium sm:px-5">
                    {t.survei.kami}
                  </th>
                  {rekaman.paket.map((p) => (
                    <th key={p.nama} scope="col" className="px-4 py-2.5 font-medium sm:px-5">
                      {p.nama}
                      <span className="block font-mono text-kecil font-normal text-ink-lirih">
                        {p.versi}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {BATERAI.map((masukan) => {
                  const kami = kataKita(masukan);
                  return (
                    <tr
                      key={masukan}
                      className="border-b border-guilloche/40 align-top transition-colors duration-200 ease-kertas last:border-0 hover:bg-tint/40"
                    >
                      <th
                        scope="row"
                        className="tabular whitespace-nowrap px-4 py-3 text-left font-mono text-kecil font-normal text-ink-sedang sm:px-5"
                      >
                        {bertitik(masukan)}
                      </th>
                      <td lang="id" className="px-4 py-3 font-display text-dasar text-bank sm:px-5">
                        {kami}
                      </td>

                      {rekaman.paket.map((p) => {
                        const baris = rekaman.hasil.find(
                          (b) => b.paket === p.nama && b.masukan === masukan,
                        );
                        const s = statusBaris(baris, kami);
                        return (
                          <td key={p.nama} className={`px-4 py-3 sm:px-5 ${WARNA_STATUS[s]}`}>
                            <span className="flex items-start gap-1.5">
                              <Tanda status={s} />
                              <span lang={s === 'beda' || s === 'sama' ? 'id' : undefined}>
                                {baris?.galat ?? baris?.keluaran ?? '—'}
                              </span>
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <p className="max-w-2xl text-kecil text-ink-lirih">{t.survei.catatan}</p>
      </section>

      {/* Cara mengisinya, sebagai keterangan di kaki — bukan penghalang di kepala. */}
      {belumDirekam ? (
        <section className="lembar space-y-3 p-5 sm:p-6">
          <h2 className="font-display text-sedang">{t.survei.belum}</h2>
          <p className="max-w-2xl text-dasar text-ink-sedang">{t.survei.belumIsi}</p>
          <pre className="overflow-x-auto rounded-lembar border border-guilloche/70 bg-tint/60 p-3.5 font-mono text-kecil">
            pnpm survey:record &lt;paket&gt; [paket...]
          </pre>
        </section>
      ) : null}
    </div>
  );
}
