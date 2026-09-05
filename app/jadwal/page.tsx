import Link from "next/link";
import { Calendar, ClipboardCheck, Flag } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { batchStatus, ST } from "@/lib/batch";
import { fmtD } from "@/lib/format";
import { FIELDS } from "@/lib/constants";
import FieldChip from "@/components/FieldChip";

export const dynamic = "force-dynamic";
export const metadata = { title: "Jadwal Pelatihan", description: "Jadwal batch pelatihan BPVP Kupang beserta status pendaftaran." };

export default async function JadwalPage({ searchParams }: { searchParams: { tahun?: string; bidang?: string } }) {
  const tahun = searchParams.tahun || "all";
  const bidang = searchParams.bidang || "all";
  const all = await prisma.trainingBatch.findMany({ include: { program: true }, orderBy: { regStart: "asc" } });
  const years = [...new Set(all.map((b) => b.year))].sort((a, b) => b - a);
  const list = all.filter((b) => (tahun === "all" || String(b.year) === tahun) && (bidang === "all" || b.program.field === bidang));

  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <p className="text-orange text-[12px] font-bold uppercase tracking-[.14em] mb-3.5">Jadwal Pelatihan</p>
      <h2 className="text-[clamp(26px,4vw,38px)] mb-3">Pilih gelombang, catat tanggalnya.</h2>
      <p className="text-mut max-w-[640px] mb-8">Status tiap batch dihitung otomatis dari tanggal pendaftaran di database.</p>

      <form className="flex flex-wrap gap-2.5 mb-6">
        <select name="tahun" defaultValue={tahun} aria-label="Filter tahun" className="border-[1.5px] border-line rounded-lg px-3.5 py-2.5 font-semibold text-[13px] bg-white">
          <option value="all">Semua tahun</option>
          {years.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
        <select name="bidang" defaultValue={bidang} aria-label="Filter bidang" className="border-[1.5px] border-line rounded-lg px-3.5 py-2.5 font-semibold text-[13px] bg-white">
          <option value="all">Semua bidang</option>
          {Object.keys(FIELDS).map((k) => <option key={k} value={k}>{k}</option>)}
        </select>
        <button className="btn-b btn-sm">Terapkan filter</button>
      </form>

      <div className="space-y-3.5">
        {list.map((b) => {
          const st = batchStatus(b);
          return (
            <div key={b.id} className="card border hover:border-blue2 p-5 grid lg:grid-cols-[2fr_1fr_auto] gap-4 items-center">
              <div>
                <FieldChip field={b.program.field} />
                <h3 className="text-lg mt-2">{b.program.name} — {b.name}</h3>
                <div className="flex flex-wrap gap-4 text-mut text-[13px] mt-1.5">
                  <span className="inline-flex items-center gap-1.5"><Calendar size={13} />Daftar: {fmtD(b.regStart)} – {fmtD(b.regEnd)}</span>
                  <span className="inline-flex items-center gap-1.5"><ClipboardCheck size={13} />Seleksi: {fmtD(b.selectionDate)}</span>
                  <span className="inline-flex items-center gap-1.5"><Flag size={13} />Pelatihan: {fmtD(b.startDate)} – {fmtD(b.endDate)}</span>
                </div>
              </div>
              <div className="w-[150px]">
                <span className="font-bold text-[12px] text-mut">Kuota {b.quota} peserta</span>
                <div className="h-[7px] bg-sky rounded-full overflow-hidden mt-2">
                  <div className="h-full bg-blue rounded-full" style={{ width: st === "closed" ? "90%" : st === "open" ? "55%" : "10%" }} />
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`badge ${ST[st].cls}`}>{ST[st].label}</span>
                {st === "open"
                  ? <Link href={`/pendaftaran?program=${b.programId}`} className="btn-o btn-sm">Daftar</Link>
                  : <Link href={`/program/${b.programId}`} className="btn-out btn-sm">Detail program</Link>}
              </div>
            </div>
          );
        })}
        {!list.length && <p className="text-mut">Tidak ada jadwal untuk filter ini.</p>}
      </div>
    </section>
  );
}