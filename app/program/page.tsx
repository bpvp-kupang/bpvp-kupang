import Link from "next/link";
import { Search, Sparkles } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { batchStatus } from "@/lib/batch";
import { FIELDS } from "@/lib/constants";
import ProgramCard from "@/components/ProgramCard";

export const dynamic = "force-dynamic";
export const metadata = { title: "Program Pelatihan", description: "Katalog 17 program pelatihan vokasi BPVP Kupang: digital, pariwisata, fashion, otomotif, dan teknik." };

export default async function ProgramPage({ searchParams }: { searchParams: { bidang?: string; q?: string } }) {
  const bidang = searchParams.bidang || "all";
  const q = (searchParams.q || "").toLowerCase();
  const programs = await prisma.trainingProgram.findMany({
    where: { status: "aktif", ...(bidang !== "all" ? { field: bidang } : {}), ...(q ? { OR: [{ name: { contains: q } }, { description: { contains: q } }] } : {}) },
    include: { batches: true },
  });
  const openOf = (id: string) => {
    const bs = programs.find((p) => p.id === id)?.batches || [];
    return bs.filter((b) => batchStatus(b) !== "closed").sort((a, b) => +a.regStart - +b.regStart)[0] || null;
  };

  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <p className="text-orange text-[12px] font-bold uppercase tracking-[.14em] mb-3.5">Katalog Program</p>
      <h2 className="text-[clamp(26px,4vw,38px)] mb-3">{programs.length} program, lima bidang — <span className="text-orange">satu tujuan: kompeten.</span></h2>
      <p className="text-mut max-w-[640px] mb-8">Pilih bidang, atau langsung cari nama program. Kartu berlabel status menandakan batch yang sedang/akan dibuka.</p>

      <div className="flex flex-wrap gap-2.5 items-center mb-6">
        <form action="/program" className="flex-1 min-w-[220px] flex items-center gap-2 border-[1.5px] border-line rounded-xl px-3.5 bg-white">
          <Search size={17} className="text-mut shrink-0" />
          <input name="q" defaultValue={searchParams.q || ""} placeholder="Cari program…" aria-label="Cari program" className="flex-1 py-3 font-medium text-sm outline-none" />
        </form>
        <Link href="/program" className={`chip ${bidang === "all" ? "chip-on" : ""}`}>Semua</Link>
        {Object.keys(FIELDS).map((k) => (
          <Link key={k} href={`/program?bidang=${encodeURIComponent(k)}`} className={`chip ${bidang === k ? "chip-on" : ""}`}>{k}</Link>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {programs.map((p, i) => <ProgramCard key={p.id} p={p} batch={openOf(p.id)} wide={i === 0 && !q && bidang === "all"} />)}
        {!programs.length && <p className="text-mut">Tidak ada program yang cocok dengan pencarian Anda.</p>}
      </div>

      <div className="bg-navy text-white rounded-3xl p-10 mt-14 flex flex-wrap items-center justify-between gap-6">
        <h2 className="text-white text-[clamp(24px,3vw,34px)]">Belum tahu mulai dari mana?</h2>
        <Link href="/jadwal" className="btn-o"><Sparkles size={18} />Lihat batch yang dibuka</Link>
      </div>
    </section>
  );
}