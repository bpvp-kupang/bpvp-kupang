// app/rekomendasi/page.tsx
import { prisma } from "@/lib/prisma";
import RekomendasiQuiz from "@/components/RekomendasiQuiz";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Cari Pelatihan",
  description: "Temukan pelatihan yang cocok untuk Anda dalam 4 pertanyaan singkat.",
};

export default async function RekomendasiPage() {
  const programs = await prisma.trainingProgram.findMany({
    where: { status: "aktif" },
    select: {
      id: true,
      name: true,
      field: true,
      description: true,
      duration: true,
      minEducation: true,
      jobProspects: true,
      businessProspects: true,
    },
  });

  const safePrograms = programs.map((p) => ({
    ...p,
    jobProspects: Array.isArray(p.jobProspects)
      ? p.jobProspects.filter(
          (v): v is string => typeof v === "string"
        )
      : [],
    businessProspects: Array.isArray(p.businessProspects)
      ? p.businessProspects.filter(
          (v): v is string => typeof v === "string"
        )
      : [],
  }));

  return (
    <section className="max-w-3xl mx-auto px-6 py-16">
      <div className="text-center mb-9">
        <p className="text-orange text-[12px] font-bold uppercase tracking-[.14em] mb-3.5">
          Pelatihan yang cocok untuk saya
        </p>

        <h1 className="text-[clamp(28px,4vw,40px)]">
          Empat pertanyaan, rekomendasi langsung.
        </h1>
      </div>

      <RekomendasiQuiz programs={safePrograms} />
    </section>
  );
}