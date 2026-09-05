import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Clock3,
  Users,
  Calendar,
  ClipboardCheck,
  Flag,
  FileCheck2,
  ArrowRight,
  Briefcase,
  ListChecks,
  Brain,
  Store,
  BookOpen,
  Wrench,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { batchStatus, ST } from "@/lib/batch";
import { fmtD } from "@/lib/format";
import FieldChip from "@/components/FieldChip";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const p = await prisma.trainingProgram.findUnique({ where: { id: params.slug } });
  if (!p) return { title: "Program" };
  return { title: p.name, description: `${p.description} — ${p.duration}, kuota ${p.quota} peserta.` };
}

export default async function ProgramDetail({ params }: { params: { slug: string } }) {
  const p = await prisma.trainingProgram.findUnique({ where: { id: params.slug }, include: { batches: { orderBy: { regStart: "asc" } } } });
  if (!p || p.status !== "aktif") notFound();
  const active = [...p.batches].reverse().find((b) => batchStatus(b) === "open") || p.batches.at(-1) || null;
  const jobCount = await prisma.jobOpportunity.count({ where: { field: p.field, status: "aktif" } });

 const asStringArray = (value: unknown): string[] =>
  Array.isArray(value)
    ? value.filter((v): v is string => typeof v === "string")
    : [];

const boxes: [string, any, string[]][] = [
  ["Kompetensi yang diperoleh", "list-checks", asStringArray(p.competencies)],
  ["Soft skill", "brain", asStringArray(p.softSkills)],
  ["Prospek pekerjaan", "briefcase", asStringArray(p.jobProspects)],
  ["Prospek usaha", "store", asStringArray(p.businessProspects)],
];

  return (
    <section className="max-w-6xl mx-auto px-6 py-14">
      <nav aria-label="breadcrumb" className="text-[13px] text-mut mb-5">
        <Link href="/program">Program</Link> / <b className="text-ink">{p.name}</b>
      </nav>
      <div className="grid lg:grid-cols-[1fr_360px] gap-9 items-start">
        <div>
          <div className="relative rounded-2xl overflow-hidden mb-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.image || `https://picsum.photos/seed/bpvp-${p.id}/960/420`} alt={`Suasana pelatihan ${p.name}`} className="w-full h-[300px] object-cover" />
            <div className="absolute top-3 left-3"><FieldChip field={p.field} /></div>
          </div>
          <h1 className="text-[clamp(28px,4vw,42px)]">{p.name}</h1>
          <p className="text-mut text-base mt-3">{p.description}</p>

          <h2 className="text-2xl mt-9 mb-1.5">Apa yang akan dipelajari?</h2>
          <div className="grid sm:grid-cols-2 gap-4 my-7">
            {boxes.map(([t, icon, items]) => (
              <div key={t} className="bg-sky2 border border-line rounded-2xl p-5">
                <h4 className="flex items-center gap-2 text-[15px] mb-3">{icon === "list-checks" && <ListChecks />}{icon === "brain" && <Brain />}{icon === "briefcase" && <Briefcase />}{icon === "store" && <Store />}{icon === "book-open" && <BookOpen />}{icon === "wrench" && <Wrench size={17} className="text-orange shrink-0" />}{t}</h4>
                <ul className="ml-4 text-[13.5px] space-y-1.5 list-disc">{items.map((x) => <li key={x}>{x}</li>)}</ul>
              </div>
            ))}
          </div>

          <div className="bg-warnBg border-l-4 border-warn rounded-lg px-4.5 py-3.5 text-[13px] text-[#7A5A10]">
            <b>Catatan:</b> {p.certificateNote} BPVP tidak menjanjikan pekerjaan otomatis setelah lulus.
          </div>
        </div>

        <aside className="lg:sticky lg:top-[96px] bg-sky2 border border-line rounded-2xl p-6 flex flex-col gap-4">
          {active && (
            <div>
              <span className={`badge ${ST[batchStatus(active)].cls}`}>{ST[batchStatus(active)].label}</span>
              <h3 className="text-[19px] mt-3">{active.name}</h3>
            </div>
          )}
          <div className="flex justify-between gap-2.5 text-[13.5px] border-b border-dashed border-line pb-2.5">
            <span className="text-mut inline-flex items-center gap-2"><Clock3 size={15} className="text-blue" />Durasi</span><b className="text-right">{p.duration}</b>
          </div>
          <div className="flex justify-between gap-2.5 text-[13.5px] border-b border-dashed border-line pb-2.5">
            <span className="text-mut inline-flex items-center gap-2"><Users size={15} className="text-blue" />Kuota</span><b>{active?.quota ?? p.quota} peserta</b>
          </div>
          {active && (<>
            <div className="flex justify-between gap-2.5 text-[13.5px] border-b border-dashed border-line pb-2.5">
              <span className="text-mut inline-flex items-center gap-2"><Calendar size={15} className="text-blue" />Pendaftaran</span><b className="text-right">{fmtD(active.regStart)} – {fmtD(active.regEnd)}</b>
            </div>
            <div className="flex justify-between gap-2.5 text-[13.5px] border-b border-dashed border-line pb-2.5">
              <span className="text-mut inline-flex items-center gap-2"><ClipboardCheck size={15} className="text-blue" />Seleksi</span><b>{fmtD(active.selectionDate)}</b>
            </div>
            <div className="flex justify-between gap-2.5 text-[13.5px]">
              <span className="text-mut inline-flex items-center gap-2"><Flag size={15} className="text-blue" />Pelatihan</span><b className="text-right">{fmtD(active.startDate)} – {fmtD(active.endDate)}</b>
            </div>
          </>)}
          <div>
            <span className="text-mut inline-flex items-center gap-2 text-[13.5px] font-semibold"><FileCheck2 size={15} className="text-blue" />Persyaratan</span>
        <ul className="ml-4 mt-2 text-[13px] space-y-1.5 list-disc">
  {(Array.isArray(p.requirements) ? p.requirements : [])
    .filter((s): s is string => typeof s === "string")
    .map((s) => (
      <li key={s}>{s}</li>
    ))}
</ul>
          </div>
        {active && batchStatus(active) === "open" ? (
            <Link href={`/pendaftaran?program=${p.id}`} className="btn-o w-full">Daftar sekarang<ArrowRight size={17} /></Link>
          ) : (
            <span className="btn-out w-full cursor-default">Pendaftaran belum dibuka</span>
          )}
          {jobCount > 0 && <Link href="/lowongan" className="btn-out btn-sm w-full"><Briefcase size={15} />{jobCount} lowongan di bidang ini</Link>}
        </aside>
      </div>
    </section>
  );
}