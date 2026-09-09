import Link from "next/link";
import { ArrowRight, Building2, Briefcase, Users } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const metadata = { title: "Dunia Kerja", description: "Menghubungkan hasil pelatihan BPVP Kupang dengan kebutuhan dunia kerja dan industri." };

export default async function DuniaKerjaPage() {
  const [partners, jobs] = await Promise.all([
    prisma.partner.findMany(),
    prisma.jobOpportunity.findMany({ where: { status: "aktif" } }),
  ]);
  const byCat = partners.reduce<Record<string, number>>((acc, p) => { acc[p.category] = (acc[p.category] || 0) + 1; return acc; }, {});

  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <p className="text-orange text-[12px] font-bold uppercase tracking-[.14em] mb-3.5">Dunia Kerja</p>
      <h1 className="text-[clamp(28px,4vw,40px)] mb-3">Dari ruang praktik ke tempat kerja.</h1>
      <p className="text-mut max-w-[640px] mb-9">Halaman ini menghubungkan hasil pelatihan dengan kebutuhan dunia kerja: jejaring mitra, peluang magang dan kerja, serta pemetaan kompetensi yang dibutuhkan industri.</p>

      <div className="grid sm:grid-cols-3 gap-4 mb-12">
        <div className="card p-6"><Users className="text-orange mb-3" size={22} /><b className="stat-num text-3xl block">{partners.length}</b><span className="text-mut text-[13px] font-semibold">Mitra perusahaan &amp; industri</span></div>
        <div className="card p-6"><Briefcase className="text-orange mb-3" size={22} /><b className="stat-num text-3xl block">{jobs.length}</b><span className="text-mut text-[13px] font-semibold">Lowongan &amp; magang aktif</span></div>
        <div className="card p-6"><Building2 className="text-orange mb-3" size={22} /><b className="stat-num text-3xl block">{Object.keys(byCat).length}</b><span className="text-mut text-[13px] font-semibold">Kategori kerja sama</span></div>
      </div>

      <h2 className="text-2xl mb-4">Bentuk kerja sama dengan mitra</h2>
      <div className="flex flex-wrap gap-3.5 mb-12">
        {partners.map((m) => (
          <div key={m.id} className="card p-5 min-w-[230px] flex-1">
            <b className="block font-display text-navy text-[15.5px]">{m.name}</b>
            <span className="text-[11.5px] text-mut">{m.category}</span>
            <p className="text-[12.5px] text-mut mt-2">{m.cooperation}</p>
          </div>
        ))}
      </div>

      <h2 className="text-2xl mb-4">Kebutuhan kompetensi dari lowongan aktif</h2>
      <div className="card p-6 mb-12">
        <ul className="text-[14px] space-y-2.5">
      {[...new Set(
  jobs
    .flatMap((j) => Array.isArray(j.requirements) ? j.requirements : [])
    .filter((r): r is string => typeof r === "string")
)].slice(0, 10).map((r) => (
  <li key={r} className="flex gap-2.5">
    <span className="text-orange font-bold">•</span>
    {r}
  </li>
))}
        </ul>
        <p className="text-[12.5px] text-mut mt-4">Persyaratan ini diambil langsung dari data lowongan mitra di database — petunjuk kompetensi apa yang paling dicari industri saat ini.</p>
      </div>

      <div className="bg-navy text-white rounded-3xl p-10 flex flex-wrap items-center justify-between gap-6">
        <h2 className="text-white text-[clamp(24px,3vw,34px)] max-w-[520px]">Lihat peluang kerja &amp; magang yang sedang dibuka.</h2>
        <Link href="/lowongan" className="btn-o">Buka halaman lowongan<ArrowRight size={17} /></Link>
      </div>
    </section>
  );
}