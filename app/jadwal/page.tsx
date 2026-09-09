import Link from "next/link";
import { ClipboardCheck, Flag } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { fmtD } from "@/lib/format";
import FieldChip from "@/components/FieldChip";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Jadwal Pelatihan",
  description: "Jadwal pelatihan BPVP Kupang tahun 2026.",
};

export default async function JadwalPage({
  searchParams,
}: {
  searchParams: { tahun?: string; bidang?: string };
}) {
  const bidang = searchParams.bidang || "all";

  // Ambil semua jadwal pelatihan tahun 2026
  const all = await prisma.trainingBatch.findMany({
    where: {
      year: 2026,
      program: {
        status: "aktif",
      },
    },
    include: {
      program: true,
    },
    orderBy: {
      regStart: "asc",
    },
  });

  // Ambil bidang secara otomatis dari program yang tersedia
  const bidangList = Array.from(
    new Set(
      all
        .map((b) => b.program.field)
        .filter((field): field is string => Boolean(field))
    )
  ).sort();

  // Filter berdasarkan bidang
  const list = all.filter(
    (b) => bidang === "all" || b.program.field === bidang
  );

  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      {/* HEADER */}
      <p className="text-orange text-[12px] font-bold uppercase tracking-[.14em] mb-3.5">
        Jadwal Pelatihan
      </p>

      <h2 className="text-[clamp(26px,4vw,38px)] mb-3">
        Pilih gelombang, catat tanggalnya.
      </h2>

      <p className="text-mut max-w-[640px] mb-8">
        Informasi jadwal pelatihan BPVP Kupang tahun 2026.
      </p>

      {/* FILTER */}
      <form
        method="GET"
        className="flex flex-wrap items-center gap-2.5 mb-8"
      >
        {/* TAHUN */}
        <span className="chip chip-on">
          Tahun 2026
        </span>

        {/* BIDANG */}
        <select
          name="bidang"
          defaultValue={bidang}
          aria-label="Filter bidang pelatihan"
          className="border-[1.5px] border-line rounded-lg px-3.5 py-2.5 font-semibold text-[13px] bg-white"
        >
          <option value="all">
            Semua bidang
          </option>

          {bidangList.map((field) => (
            <option key={field} value={field}>
              {field}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="btn-b btn-sm"
        >
          Terapkan filter
        </button>
      </form>

      {/* DAFTAR JADWAL */}
      <div className="space-y-3.5">
        {list.map((b) => (
          <div
            key={b.id}
            className="card border hover:border-blue2 p-5 grid lg:grid-cols-[2fr_1fr_auto] gap-4 items-center"
          >
            {/* INFORMASI PROGRAM */}
            <div>
              <FieldChip field={b.program.field} />

              <h3 className="text-lg mt-2">
                {b.program.name} — {b.name}
              </h3>

              <div className="flex flex-wrap gap-4 text-mut text-[13px] mt-2">
                <span className="inline-flex items-center gap-1.5">
                  <ClipboardCheck size={13} />
                  Seleksi: {fmtD(b.selectionDate)}
                </span>

                <span className="inline-flex items-center gap-1.5">
                  <Flag size={13} />
                  Pelatihan: {fmtD(b.startDate)} –{" "}
                  {fmtD(b.endDate)}
                </span>
              </div>
            </div>

            {/* KUOTA */}
            <div className="w-[150px]">
              <span className="font-bold text-[12px] text-mut">
                Kuota {b.quota} peserta
              </span>

              <div className="h-[7px] bg-sky rounded-full overflow-hidden mt-2">
                <div
                  className="h-full bg-blue rounded-full"
                  style={{ width: "55%" }}
                />
              </div>
            </div>

            {/* DETAIL */}
            <div className="flex flex-col items-end gap-2">
              <Link
                href={`/program/${b.programId}`}
                className="btn-out btn-sm"
              >
                Detail program
              </Link>
            </div>
          </div>
        ))}

        {/* TIDAK ADA DATA */}
        {!list.length && (
          <div className="border border-line rounded-xl p-8 text-center">
            <p className="font-semibold">
              Tidak ada jadwal pelatihan
            </p>

            <p className="text-mut text-sm mt-1">
              Belum tersedia jadwal untuk bidang yang dipilih.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}