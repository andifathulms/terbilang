/**
 * Guilloche sungguhan, bukan garis-garis CSS: roset dari elips yang diputar
 * mengelilingi satu titik, seperti pola engine-turned di sudut cek dan uang
 * kertas. Elips yang bertumpuk itulah yang menimbulkan moiré-nya — tidak ada
 * kurva yang digambar satu per satu.
 *
 * Murni hiasan: aria-hidden, warnanya currentColor sehingga ikut token apa
 * pun yang dipasang pemanggil, dan geometrinya dihitung sekali saat modul
 * dimuat. Ini bukan nilai bilangan — pustaka tetap satu-satunya sumber kata
 * dan angka di situs.
 *
 * Komponen server: tidak ada satu bait pun JavaScript yang dikirim untuknya.
 */

const PUTARAN_LUAR = Array.from({ length: 40 }, (_, i) => i * 4.5);
const PUTARAN_DALAM = Array.from({ length: 30 }, (_, i) => i * 6);

export function Roset({ kelas = '' }: { kelas?: string }) {
  return (
    <svg
      aria-hidden
      focusable="false"
      viewBox="-100 -100 200 200"
      className={`pointer-events-none ${kelas}`}
      fill="none"
      stroke="currentColor"
    >
      <g strokeWidth="0.3">
        {PUTARAN_LUAR.map((sudut) => (
          <ellipse key={sudut} rx="96" ry="30" transform={`rotate(${sudut})`} />
        ))}
      </g>
      <g strokeWidth="0.25" opacity="0.8">
        {PUTARAN_DALAM.map((sudut) => (
          <ellipse key={sudut} rx="52" ry="19" transform={`rotate(${sudut})`} />
        ))}
      </g>
      <circle r="98" strokeWidth="0.4" />
      <circle r="58" strokeWidth="0.3" />
    </svg>
  );
}

/**
 * Pita gelombang: garis sinus sejajar yang bergeser fase sedikit demi
 * sedikit, seperti latar kolom jumlah pada bilyet giro. Satu jalur, diulang
 * dengan <use>, supaya markahnya tetap kecil.
 */
const LEBAR = 1200;
const JALUR_GELOMBANG = (() => {
  const titik: string[] = [];
  /* Lebih panjang dari bidangnya: tiap baris digeser ke kiri, dan ujung
     kanannya tidak boleh kelihatan putus. */
  for (let x = 0; x <= LEBAR + 132; x += 12) {
    const y = Math.sin(x / 42) * 6 + Math.sin(x / 131) * 4;
    titik.push(`${x === 0 ? 'M' : 'L'}${x} ${y.toFixed(2)}`);
  }
  return titik.join('');
})();
const BARIS_GELOMBANG = Array.from({ length: 18 }, (_, i) => i);

export function Gelombang({ kelas = '' }: { kelas?: string }) {
  return (
    <svg
      aria-hidden
      focusable="false"
      viewBox={`0 -10 ${LEBAR} 110`}
      preserveAspectRatio="none"
      className={`pointer-events-none ${kelas}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="0.6"
    >
      <defs>
        <path id="gelombang-guilloche" d={JALUR_GELOMBANG} />
      </defs>
      {BARIS_GELOMBANG.map((i) => (
        <use
          key={i}
          href="#gelombang-guilloche"
          transform={`translate(${-i * 7} ${i * 5})`}
        />
      ))}
    </svg>
  );
}
