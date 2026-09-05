import Link from "next/link";
import { ArrowRight, Compass, LayoutGrid, Calendar, Send, Users } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { batchStatus, ST } from "@/lib/batch";
import { fmtD } from "@/lib/format";
import ProgramCard from "@/components/ProgramCard";
import FieldChip from "@/components/FieldChip";

export const dynamic = "force-dynamic";

const FLOW = [
  ["1", "Belajar", "Teori esensial dan standar industri dari instruktur berpengalaman."],
  ["2", "Praktik", "Mayoritas jam pelatihan adalah praktik langsung di workshop dan lab."],
  ["3", "Kompeten", "Ujian praktik memastikan kemampuan terukur, bukan sekadar hadir."],
  ["4", "Sertifikasi*", "Sertifikat pelatihan; uji sertifikasi kompetensi sesuai persyaratan program."],
  ["5", "Siap kerja / wirausaha", "Dibimbing menuju lowongan, magang, atau merintis usaha sendiri."],
];

export default async function Home() {
  const [programs, batches, alumni, partners, instructors] = await Promise.all([
    prisma.trainingProgram.findMany({ where: { status: "aktif" }, include: { batches: true } }),
    prisma.trainingBatch.findMany({ include: { program: true } }),
    prisma.alumni.count(),
    prisma.partner.count(),
    prisma.instructor.count(),
  ]);
  const open = batches.filter((b) => batchStatus(b) === "open");
  const feat = open[0] || batches[0];
  const featProg = programs.find((p) => p.id === feat?.programId);
  const sek = open[1] ? programs.find((p) => p.id === open[1].programId) : null;
  const featured = open.length
    ? open.slice(0, 5).map((b) => ({ b, p: programs.find((x) => x.id === b.programId)! })).filter((x) => x.p)
    : programs.slice(0, 4).map((p) => ({ b: null as any, p }));

  const stats: [string | number, string][] = [
    [programs.length, "Program Pelatihan"],
    [open.length, "Batch Dibuka Saat Ini"],
    [alumni, "Alumni"],
    [instructors, "Instruktur"],
    [partners, "Mitra Industri"],
  ];

  return (
    <>
      {/* HERO */}
      <section className="bg-navy text-white relative overflow-hidden pt-20">
        <div className="absolute inset-0 opacity-50 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.05) 1px,transparent 1px)", backgroundSize: "64px 64px" }} />
        <div className="max-w-6xl mx-auto px-6 relative grid lg:grid-cols-[1.15fr_.85fr] gap-14 items-center pb-20">
          <div>
            <p className="text-orange-2 text-[12px] font-bold uppercase tracking-[.14em] mb-3.5 text-[#F6A56C]">Selamat datang di BPVP Kupang</p>
            <h1 className="text-white text-[clamp(34px,4.6vw,56px)]">
              Dari belajar, menjadi <em className="not-italic text-orange">kompeten</em>,<br />siap kerja &amp; berwirausaha.
            </h1>
            <p className="font-display font-extrabold text-[15px] text-[#8FB4DE] mt-5 mb-2.5"><strong className="text-white">Bangun Kompetensi. Tingkatkan Produktivitas. Raih Masa Depan.</strong></p>
            <p className="text-[#C4D6EC] max-w-[520px]">BPVP Kupang hadir memberikan akses pelatihan vokasi untuk meningkatkan kompetensi, produktivitas, kesiapan kerja, dan kemampuan berwirausaha masyarakat.</p>
            <div className="flex flex-wrap gap-3 mt-7">
              <Link href="/rekomendasi" className="btn-o"><Compass size={18} />Cari Pelatihan</Link>
              <Link href="/pendaftaran" className="btn-gh"><Send size={18} />Daftar Pelatihan</Link>
              <Link href="/jadwal" className="inline-flex items-center gap-2 font-bold text-white py-4 px-2.5 rounded-lg hover:text-[#FCC9A8]">Lihat Jadwal<ArrowRight size={17} /></Link>
            </div>
          </div>
          {feat && featProg && (
            <div className="relative h-[340px] sm:h-[400px] max-w-[460px] w-full justify-self-end" aria-label="Batch pelatihan aktif">
              {sek && (
                <Link href={`/program/${sek.id}`} className="absolute w-[78%] right-[10%] top-0 rotate-3 opacity-55 bg-[#DCE9F6] text-ink rounded-2xl p-4 border border-[#C6D9EC]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={sek.image || `https://picsum.photos/seed/bpvp-${sek.id}/480/300`} alt="" className="rounded-xl h-[150px] w-full object-cover" />
                  <div className="pt-3"><h3 className="text-[17px]">{sek.name}</h3></div>
                </Link>
              )}
              <Link href={`/program/${featProg.id}`} className="absolute w-[88%] right-0 top-[34px] -rotate-[1.5deg] bg-white text-ink rounded-2xl p-4.5 shadow-2xl z-10 hover:rotate-0 hover:-translate-y-1 transition">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={featProg.image || `https://picsum.photos/seed/bpvp-${featProg.id}/640/360`} alt={`Pelatihan ${featProg.name}`} className="rounded-xl h-[150px] w-full object-cover" />
                <div className="pt-3.5">
                  <span className={`badge ${ST[batchStatus(feat)].cls}`}>{ST[batchStatus(feat)].label}</span>
                  <h3 className="text-xl mt-2">{featProg.name}</h3>
                  <div className="flex gap-3.5 text-mut text-[13px] mt-1.5">
                    <span className="inline-flex items-center gap-1.5"><Calendar size={14} />{fmtD(feat.regStart)} – {fmtD(feat.regEnd)}</span>
                    <span className="inline-flex items-center gap-1.5"><Users size={14} />Kuota {feat.quota}</span>
                  </div>
                </div>
              </Link>
              <Link href="/jadwal" className="absolute left-0 bottom-0 w-[60%] -rotate-3 bg-orange text-white rounded-2xl px-4 py-3.5 z-20">
                <b className="block font-display text-[15px]">{open.length} batch dibuka saat ini</b>
                <span className="text-[12px] font-semibold opacity-90">Lihat semua jadwal →</span>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ticker + statistik */}
      <div className="bg-orange overflow-hidden py-3" aria-hidden="true">
        <div className="flex whitespace-nowrap" style={{ animation: "tick 36s linear infinite" }}>
          {[...programs, ...programs].map((p, i) => (
            <span key={i} className="text-white font-bold text-[13px] uppercase tracking-widest px-6">{p.name}</span>
          ))}
        </div>
      </div>
      <style>{`@keyframes tick{to{transform:translateX(-50%)}}`}</style>

      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 border-b border-line">
          {stats.map(([v, l]) => (
            <div key={l} className="py-8 px-6 border-l border-line first:border-l-0 border-t border-t-transparent sm:border-t-0">
              <b className="stat-num text-[clamp(30px,3.4vw,44px)] block">{typeof v === "number" ? v.toLocaleString("id-ID") : v}</b>
              <span className="text-mut font-semibold text-[13px]">{l}</span>
            </div>
          ))}
        </div>
      </div>

      <section className="max-w-6xl mx-auto px-6 py-18 pt-16">
        <p className="text-orange text-[12px] font-bold uppercase tracking-[.14em] mb-3.5">Perjalanan Anda di BPVP</p>
        <h2 className="text-[clamp(26px,4vw,38px)] mb-3">Belajar → praktik → kompeten → <span className="text-orange">siap melangkah</span></h2>
        <p className="text-mut max-w-[640px] mb-9">Setiap program dirancang supaya Anda tidak berhenti di teori — tapi benar-benar mampu bekerja atau membuka usaha.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {FLOW.map(([n, t, d]) => (
            <div key={n} className="bg-sky2 border border-line rounded-2xl p-5">
              <div className="w-9 h-9 rounded-lg bg-navy text-white font-display font-extrabold grid place-items-center mb-3">{n}</div>
              <h4 className="text-[15.5px] mb-1.5">{t}</h4>
              <p className="text-[12.5px] text-mut">{d}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 max-w-[640px] bg-warnBg border-l-4 border-warn rounded-lg px-4.5 py-3.5 text-[13px] text-[#7A5A10]">
          *BPVP tidak menjanjikan pekerjaan otomatis setelah lulus — kami membekali kompetensi, jejaring, dan informasi peluang.
        </p>
      </section>

      <section className="bg-sky2 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-wrap items-end justify-between gap-5 mb-7">
            <div>
              <p className="text-orange text-[12px] font-bold uppercase tracking-[.14em] mb-3.5">Program unggulan</p>
              <h2 className="text-[clamp(26px,4vw,38px)]">Sedang dibuka &amp; paling diminati</h2>
            </div>
            <Link href="/program" className="btn-out btn-sm">Semua program<ArrowRight size={15} /></Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured.map(({ b, p }, i) => (
              <ProgramCard key={p.id} p={p} batch={b} wide={i === 0} />
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="bg-navy text-white rounded-3xl p-10 sm:p-14 flex flex-wrap items-center justify-between gap-9 relative overflow-hidden">
          <div className="absolute -right-16 -top-16 w-[260px] h-[260px] rounded-full border-[34px] border-orange/20" />
          <h2 className="text-white text-[clamp(26px,3.4vw,38px)] max-w-[560px] relative">
            “Punya kemampuan. Punya peluang. <em className="not-italic text-orange">Mulai dari BPVP Kupang.</em>”
          </h2>
          <Link href="/program" className="btn-o relative">Temukan Pelatihan Saya<ArrowRight size={18} /></Link>
        </div>
      </section>
    </>
  );
}