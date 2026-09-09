import Link from "next/link";
import { ArrowRight, Compass, Calendar, Users } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { batchStatus, ST } from "@/lib/batch";
import { fmtD } from "@/lib/format";
import ProgramCard from "@/components/ProgramCard";

export const dynamic = "force-dynamic";

const FLOW = [
  [
    "1",
    "Belajar",
    "Teori esensial dan standar industri dari instruktur berpengalaman.",
  ],
  [
    "2",
    "Praktik",
    "Mayoritas jam pelatihan adalah praktik langsung di workshop dan lab.",
  ],
  [
    "3",
    "Kompeten",
    "Ujian praktik memastikan kemampuan terukur, bukan sekadar hadir.",
  ],
  [
    "4",
    "Sertifikasi*",
    "Sertifikat pelatihan; uji sertifikasi kompetensi sesuai persyaratan program.",
  ],
  [
    "5",
    "Siap kerja / wirausaha",
    "Dibimbing untuk menerapkan kompetensi di dunia kerja atau merintis usaha sendiri.",
  ],
];

export default async function Home() {
  const [programs, batches] = await Promise.all([
    prisma.trainingProgram.findMany({
      where: { status: "aktif" },
      include: { batches: true },
    }),

    prisma.trainingBatch.findMany({
      where: {
        program: {
          status: "aktif",
        },
      },
      include: {
        program: true,
      },
    }),
  ]);

  const open = batches.filter((b) => batchStatus(b) === "open");

  const feat = open[0] || batches[0];

  const featProg = programs.find(
    (p) => p.id === feat?.programId
  );

  const sek = open[1]
    ? programs.find((p) => p.id === open[1].programId)
    : null;

  const featured = open.length
    ? open
        .slice(0, 5)
        .map((b) => ({
          b,
          p: programs.find((x) => x.id === b.programId)!,
        }))
        .filter((x) => x.p)
    : programs
        .slice(0, 4)
        .map((p) => ({
          b: null as any,
          p,
        }));

  const stats: [string | number, string][] = [
    [programs.length, "Program Pelatihan"],
    [open.length, "Batch Dibuka Saat Ini"],
  ];

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-navy pt-20 text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.05) 1px,transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />

        <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 pb-20 lg:grid-cols-[1.15fr_.85fr]">
          <div>
            <p className="mb-3.5 text-[12px] font-bold uppercase tracking-[.14em] text-[#F6A56C]">
              Selamat datang di BPVP Kupang
            </p>

            <h1 className="text-[clamp(34px,4.6vw,56px)] text-white">
              Dari belajar, menjadi{" "}
              <em className="not-italic text-orange">
                kompeten
              </em>
              ,<br />
              siap kerja &amp; berwirausaha.
            </h1>

            <p className="mt-5 mb-2.5 font-display text-[15px] font-extrabold text-[#8FB4DE]">
              <strong className="text-white">
                Bangun Kompetensi. Tingkatkan Produktivitas. Raih Masa Depan.
              </strong>
            </p>

            <p className="max-w-[520px] text-[#C4D6EC]">
              BPVP Kupang hadir memberikan akses pelatihan vokasi untuk
              meningkatkan kompetensi, produktivitas, kesiapan kerja, dan
              kemampuan berwirausaha masyarakat.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/rekomendasi" className="btn-o">
                <Compass size={18} />
                Cari Pelatihan
              </Link>

              <Link
                href="/jadwal"
                className="inline-flex items-center gap-2 rounded-lg px-2.5 py-4 font-bold text-white hover:text-[#FCC9A8]"
              >
                Lihat Jadwal
                <ArrowRight size={17} />
              </Link>
            </div>
          </div>

          {feat && featProg && (
            <div
              className="relative h-[340px] w-full max-w-[460px] justify-self-end sm:h-[400px]"
              aria-label="Batch pelatihan aktif"
            >
              {sek && (
                <Link
                  href={`/program/${sek.id}`}
                  className="absolute right-[10%] top-0 w-[78%] rotate-3 rounded-2xl border border-[#C6D9EC] bg-[#DCE9F6] p-4 text-ink opacity-55"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={
                      sek.image ||
                      `https://picsum.photos/seed/bpvp-${sek.id}/480/300`
                    }
                    alt=""
                    className="h-[150px] w-full rounded-xl object-cover"
                  />

                  <div className="pt-3">
                    <h3 className="text-[17px]">{sek.name}</h3>
                  </div>
                </Link>
              )}

              <Link
                href={`/program/${featProg.id}`}
                className="absolute right-0 top-[34px] z-10 w-[88%] -rotate-[1.5deg] rounded-2xl bg-white p-4.5 text-ink shadow-2xl transition hover:-translate-y-1 hover:rotate-0"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    featProg.image ||
                    `https://picsum.photos/seed/bpvp-${featProg.id}/640/360`
                  }
                  alt={`Pelatihan ${featProg.name}`}
                  className="h-[150px] w-full rounded-xl object-cover"
                />

                <div className="pt-3.5">
                  <span
                    className={`badge ${
                      ST[batchStatus(feat)].cls
                    }`}
                  >
                    {ST[batchStatus(feat)].label}
                  </span>

                  <h3 className="mt-2 text-xl">
                    {featProg.name}
                  </h3>

                  <div className="mt-1.5 flex gap-3.5 text-[13px] text-mut">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar size={14} />
                      {fmtD(feat.regStart)} – {fmtD(feat.regEnd)}
                    </span>

                    <span className="inline-flex items-center gap-1.5">
                      <Users size={14} />
                      Kuota {feat.quota}
                    </span>
                  </div>
                </div>
              </Link>

              <Link
                href="/jadwal"
                className="absolute bottom-0 left-0 z-20 w-[60%] -rotate-3 rounded-2xl bg-orange px-4 py-3.5 text-white"
              >
                <b className="block font-display text-[15px]">
                  {open.length} batch dibuka saat ini
                </b>

                <span className="text-[12px] font-semibold opacity-90">
                  Lihat semua jadwal →
                </span>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* TICKER */}
      <div
        className="overflow-hidden bg-orange py-3"
        aria-hidden="true"
      >
        <div
          className="flex whitespace-nowrap"
          style={{
            animation: "tick 36s linear infinite",
          }}
        >
          {[...programs, ...programs].map((p, i) => (
            <span
              key={i}
              className="px-6 text-[13px] font-bold uppercase tracking-widest text-white"
            >
              {p.name}
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes tick {
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>

      {/* STATISTIK */}
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-2 border-b border-line">
          {stats.map(([v, l]) => (
            <div
              key={l}
              className="border-l border-line border-t border-t-transparent px-6 py-8 first:border-l-0 sm:border-t-0"
            >
              <b className="stat-num block text-[clamp(30px,3.4vw,44px)]">
                {typeof v === "number"
                  ? v.toLocaleString("id-ID")
                  : v}
              </b>

              <span className="text-[13px] font-semibold text-mut">
                {l}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* PERJALANAN */}
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-16">
        <p className="mb-3.5 text-[12px] font-bold uppercase tracking-[.14em] text-orange">
          Perjalanan Anda di BPVP
        </p>

        <h2 className="mb-3 text-[clamp(26px,4vw,38px)]">
          Belajar → praktik → kompeten →{" "}
          <span className="text-orange">
            siap melangkah
          </span>
        </h2>

        <p className="mb-9 max-w-[640px] text-mut">
          Setiap program dirancang supaya Anda tidak berhenti di teori —
          tapi benar-benar mampu bekerja atau membuka usaha.
        </p>

        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-5">
          {FLOW.map(([n, t, d]) => (
            <div
              key={n}
              className="rounded-2xl border border-line bg-sky2 p-5"
            >
              <div className="mb-3 grid h-9 w-9 place-items-center rounded-lg bg-navy font-display font-extrabold text-white">
                {n}
              </div>

              <h4 className="mb-1.5 text-[15.5px]">
                {t}
              </h4>

              <p className="text-[12.5px] text-mut">
                {d}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-6 max-w-[640px] rounded-lg border-l-4 border-warn bg-warnBg px-4.5 py-3.5 text-[13px] text-[#7A5A10]">
          *BPVP tidak menjanjikan pekerjaan otomatis setelah lulus — kami
          membekali kompetensi, jejaring, dan informasi peluang.
        </p>
      </section>

      {/* PROGRAM UNGGULAN */}
      <section className="bg-sky2 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="mb-3.5 text-[12px] font-bold uppercase tracking-[.14em] text-orange">
                Program unggulan
              </p>

              <h2 className="text-[clamp(26px,4vw,38px)]">
                Sedang dibuka &amp; paling diminati
              </h2>
            </div>

            <Link href="/program" className="btn-out btn-sm">
              Semua program
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map(({ b, p }, i) => (
              <ProgramCard
                key={p.id}
                p={p}
                batch={b}
                wide={i === 0}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="relative flex flex-wrap items-center justify-between gap-9 overflow-hidden rounded-3xl bg-navy p-10 text-white sm:p-14">
          <div className="absolute -right-16 -top-16 h-[260px] w-[260px] rounded-full border-[34px] border-orange/20" />

          <h2 className="relative max-w-[560px] text-[clamp(26px,3.4vw,38px)] text-white">
            “Punya kemampuan. Punya peluang.{" "}
            <em className="not-italic text-orange">
              Mulai dari BPVP Kupang.
            </em>
            ”
          </h2>

          <Link
            href="/program"
            className="btn-o relative"
          >
            Temukan Pelatihan Saya
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}