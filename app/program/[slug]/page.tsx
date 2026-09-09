import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Clock3,
  Users,
  ClipboardCheck,
  Flag,
  FileCheck2,
  Briefcase,
  ListChecks,
  Brain,
  Store,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import { batchStatus } from "@/lib/batch";
import { fmtD } from "@/lib/format";
import FieldChip from "@/components/FieldChip";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const p = await prisma.trainingProgram.findUnique({
    where: { id: params.slug },
  });

  if (!p) {
    return { title: "Program" };
  }

  return {
    title: p.name,
    description: `${p.description} — ${p.duration}, kuota ${p.quota} peserta.`,
  };
}

export default async function ProgramDetail({
  params,
}: {
  params: { slug: string };
}) {
  const p = await prisma.trainingProgram.findUnique({
    where: { id: params.slug },
    include: {
      batches: {
        orderBy: {
          regStart: "asc",
        },
      },
    },
  });

  if (!p || p.status !== "aktif") {
    notFound();
  }

  const active =
    [...p.batches].reverse().find((b) => batchStatus(b) === "open") ||
    p.batches.at(-1) ||
    null;

  const jobCount = await prisma.jobOpportunity.count({
    where: {
      field: p.field,
      status: "aktif",
    },
  });

  const asStringArray = (value: unknown): string[] =>
    Array.isArray(value)
      ? value.filter((v): v is string => typeof v === "string")
      : [];

  const boxes: [string, string, string[]][] = [
    [
      "Kompetensi yang diperoleh",
      "list-checks",
      asStringArray(p.competencies),
    ],
    ["Soft skill", "brain", asStringArray(p.softSkills)],
    ["Prospek pekerjaan", "briefcase", asStringArray(p.jobProspects)],
    ["Prospek usaha", "store", asStringArray(p.businessProspects)],
  ];

  const requirements = [
    "Usia maksimal 31 tahun",
    "Pendidikan terakhir minimal SD",
    "Tidak sedang mengikuti pelatihan lain (tidak rangkap)",
    "Data pendaftaran diisi dengan benar",
  ];

  const registrationFiles = [
    "Kartu Tanda Penduduk (KTP)",
    "Kartu Keluarga (KK)",
    "Ijazah atau dokumen pendidikan terakhir",
    "Pas foto terbaru",
    "Nomor HP/WhatsApp yang aktif",
    "Email aktif",
  ];

  return (
    <section className="max-w-6xl mx-auto px-6 py-14">
      {/* BREADCRUMB */}
      <nav
        aria-label="breadcrumb"
        className="text-[13px] text-mut mb-5"
      >
        <Link href="/program">Program</Link>
        {" / "}
        <b className="text-ink">{p.name}</b>
      </nav>

      <div className="grid lg:grid-cols-[1fr_360px] gap-9 items-start">
        {/* =========================
            KONTEN UTAMA
        ========================== */}
        <div>
          {/* GAMBAR */}
          <div className="relative rounded-2xl overflow-hidden mb-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={
                p.image ||
                `https://picsum.photos/seed/bpvp-${p.id}/960/420`
              }
              alt={`Suasana pelatihan ${p.name}`}
              className="w-full h-[300px] object-cover"
            />

            <div className="absolute top-3 left-3">
              <FieldChip field={p.field} />
            </div>
          </div>

          {/* JUDUL */}
          <h1 className="text-[clamp(28px,4vw,42px)]">
            {p.name}
          </h1>

          <p className="text-mut text-base mt-3">
            {p.description}
          </p>

          {/* MATERI */}
          <h2 className="text-2xl mt-9 mb-1.5">
            Apa yang akan dipelajari?
          </h2>

          <div className="grid sm:grid-cols-2 gap-4 my-7">
            {boxes.map(([title, icon, items]) => (
              <div
                key={title}
                className="bg-sky2 border border-line rounded-2xl p-5"
              >
                <h4 className="flex items-center gap-2 text-[15px] mb-3">
                  {icon === "list-checks" && (
                    <ListChecks size={18} className="text-blue shrink-0" />
                  )}

                  {icon === "brain" && (
                    <Brain size={18} className="text-blue shrink-0" />
                  )}

                  {icon === "briefcase" && (
                    <Briefcase size={18} className="text-blue shrink-0" />
                  )}

                  {icon === "store" && (
                    <Store size={18} className="text-blue shrink-0" />
                  )}

                  {title}
                </h4>

                {items.length > 0 ? (
                  <ul className="ml-4 text-[13.5px] space-y-1.5 list-disc">
                    {items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[13px] text-mut">
                    Informasi akan diperbarui.
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* CATATAN */}
          <div className="bg-warnBg border-l-4 border-warn rounded-lg px-4.5 py-3.5 text-[13px] text-[#7A5A10]">
            <b>Catatan:</b> {p.certificateNote} BPVP tidak
            menjanjikan pekerjaan otomatis setelah lulus.
          </div>
        </div>

        {/* =========================
            SIDEBAR INFORMASI BATCH
        ========================== */}
        <aside className="lg:sticky lg:top-[96px] bg-sky2 border border-line rounded-2xl p-6 flex flex-col gap-4">
          {/* NAMA BATCH */}
          {active && (
            <div>
              <h3 className="text-[19px] font-bold mt-1">
                {active.name}
              </h3>
            </div>
          )}

          {/* STATUS PENDAFTARAN - HANYA SATU */}
          {active && batchStatus(active) === "open" && (
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-green-700 via-green-600 to-emerald-600 text-white px-5 py-3.5 flex items-center justify-center gap-2.5 font-bold text-[14px] shadow-md shadow-green-600/20 border border-green-500">
              <ClipboardCheck
                size={20}
                strokeWidth={2.5}
                className="shrink-0"
              />

              <span className="tracking-wide">
                PENDAFTARAN DIBUKA
              </span>

              <span className="w-2.5 h-2.5 bg-white rounded-full animate-pulse shrink-0" />
            </div>
          )}

          {/* DURASI */}
          <div className="flex items-center justify-between gap-4 text-[13.5px] border-b border-dashed border-line pb-2.5">
            <span className="text-mut inline-flex items-center gap-2 shrink-0">
              <Clock3 size={15} className="text-blue shrink-0" />
              Durasi
            </span>

            <b className="text-right">
              {p.duration}
            </b>
          </div>

          {/* KUOTA */}
          <div className="flex items-center justify-between gap-4 text-[13.5px] border-b border-dashed border-line pb-2.5">
            <span className="text-mut inline-flex items-center gap-2 shrink-0">
              <Users size={15} className="text-blue shrink-0" />
              Kuota
            </span>

            <b className="text-right">
              {active?.quota ?? p.quota} peserta
            </b>
          </div>

          {/* PENDAFTARAN */}
          {active && (
            <div className="flex items-start justify-between gap-4 text-[13.5px] border-b border-dashed border-line pb-2.5">
              <span className="text-mut inline-flex items-center gap-2 shrink-0">
                <ClipboardCheck
                  size={15}
                  className="text-blue shrink-0"
                />
                Pendaftaran
              </span>

              <b className="text-right whitespace-nowrap">
                {fmtD(active.regStart)} – {fmtD(active.regEnd)}
              </b>
            </div>
          )}

          {/* SELEKSI */}
          {active && (
            <div className="flex items-center justify-between gap-4 text-[13.5px] border-b border-dashed border-line pb-2.5">
              <span className="text-mut inline-flex items-center gap-2 shrink-0">
                <ClipboardCheck
                  size={15}
                  className="text-blue shrink-0"
                />
                Seleksi
              </span>

              <b className="text-right">
                {fmtD(active.selectionDate)}
              </b>
            </div>
          )}

          {/* PELATIHAN */}
          {active && (
            <div className="flex items-start justify-between gap-4 text-[13.5px]">
              <span className="text-mut inline-flex items-center gap-2 shrink-0">
                <Flag
                  size={15}
                  className="text-blue shrink-0"
                />
                Pelatihan
              </span>

              <b className="text-right whitespace-nowrap">
                {fmtD(active.startDate)} – {fmtD(active.endDate)}
              </b>
            </div>
          )}

          {/* GARIS */}
          <div className="border-t border-line pt-4" />

          {/* PERSYARATAN */}
          <div>
            <span className="text-mut inline-flex items-center gap-2 text-[13.5px] font-semibold">
              <FileCheck2
                size={15}
                className="text-blue shrink-0"
              />
              Persyaratan
            </span>

            <ul className="ml-5 mt-2 text-[13px] space-y-1.5 list-disc">
              {requirements.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          {/* BERKAS */}
          <div className="border-t border-line pt-4">
            <span className="text-mut inline-flex items-center gap-2 text-[13.5px] font-semibold">
              <FileCheck2
                size={15}
                className="text-blue shrink-0"
              />
              Berkas yang Perlu Disiapkan
            </span>

            <ul className="ml-5 mt-2 text-[13px] space-y-1.5 list-disc">
              {registrationFiles.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          {/* LOWONGAN */}
          {jobCount > 0 && (
            <Link
              href="/lowongan"
              className="btn-out btn-sm w-full"
            >
              <Briefcase size={15} />
              {jobCount} lowongan di bidang ini
            </Link>
          )}
        </aside>
      </div>
    </section>
  );
}