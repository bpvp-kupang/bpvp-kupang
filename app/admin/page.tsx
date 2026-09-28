import Link from "next/link";
import {
  GraduationCap,
  CalendarDays,
  FolderOpen,
  Newspaper,
  Images,
  ArrowRight,
  Clock3,
  Activity,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import { batchStatus } from "@/lib/batch";
import { fmtD } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [programs, batches, news, gallery, audit] = await Promise.all([
    prisma.trainingProgram.count({
      where: { status: "aktif" },
    }),

    prisma.trainingBatch.findMany({
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
        startDate: "asc",
      },
    }),

    prisma.news.count(),

    prisma.gallery.count(),

    prisma.auditLog.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 6,
    }),
  ]);

  const open = batches.filter(
    (b) => batchStatus(b) === "open"
  ).length;

  const kpis = [
    {
      label: "Program Aktif",
      value: programs,
      icon: GraduationCap,
      href: "/admin/program",
      desc: "Program pelatihan",
    },
    {
      label: "Batch 2026",
      value: batches.length,
      icon: CalendarDays,
      href: "/admin/jadwal",
      desc: "Total batch",
    },
    {
      label: "Batch Dibuka",
      value: open,
      icon: FolderOpen,
      href: "/admin/jadwal",
      desc: "Sedang dibuka",
    },
    {
      label: "Berita",
      value: news,
      icon: Newspaper,
      href: "/admin/berita",
      desc: "Konten berita",
    },
    {
      label: "Galeri",
      value: gallery,
      icon: Images,
      href: "/admin/galeri",
      desc: "Dokumentasi",
    },
  ];

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* HEADER */}
      <section className="rounded-2xl bg-navy px-4 py-5 sm:px-6 sm:py-6 text-white overflow-hidden">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8FB4DE]">
              Panel Pengelolaan
            </p>

            <h1 className="mt-1 text-2xl sm:text-3xl font-display font-extrabold">
              Dashboard
            </h1>

            <p className="mt-1.5 text-[12.5px] sm:text-sm text-[#B8CBE2] max-w-xl">
              Ringkasan pengelolaan pelatihan dan publikasi BPVP Kupang
              tahun 2026.
            </p>
          </div>

          <Link
            href="/"
            target="_blank"
            className="inline-flex w-fit items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-[12px] font-bold text-white hover:bg-white/15"
          >
            Lihat Situs Publik
            <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* KPI */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-display font-extrabold text-navy">
              Ringkasan
            </h2>
            <p className="text-mut text-[11.5px] sm:text-xs mt-0.5">
              Data utama sistem saat ini
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {kpis.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.label}
                href={item.href}
                className="group card p-4 sm:p-4.5 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="w-10 h-10 rounded-xl bg-sky2 text-navy grid place-items-center shrink-0">
                    <Icon size={19} />
                  </div>

                  <ArrowRight
                    size={15}
                    className="text-mut opacity-60 transition group-hover:translate-x-0.5"
                  />
                </div>

                <p className="mt-4 text-[11px] font-bold uppercase tracking-wide text-mut">
                  {item.label}
                </p>

                <b className="block mt-1 text-2xl sm:text-[28px] leading-none font-display font-extrabold text-navy">
                  {item.value.toLocaleString("id-ID")}
                </b>

                <p className="mt-1.5 text-[11px] text-mut">
                  {item.desc}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* JADWAL */}
      <section className="card overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-line">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base sm:text-lg font-display font-extrabold text-navy">
                Jadwal Pelatihan 2026
              </h2>

              <p className="text-mut text-[11.5px] sm:text-xs mt-1">
                Daftar batch pelatihan yang terdaftar pada sistem.
              </p>
            </div>

            <Link
              href="/admin/jadwal"
              className="shrink-0 inline-flex items-center gap-1.5 text-[11.5px] sm:text-xs font-bold text-navy hover:text-orange"
            >
              Lihat semua
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* DESKTOP TABLE */}
        <div className="hidden md:block overflow-x-auto">
          <table className="tbl">
            <thead>
              <tr>
                <th>Program</th>
                <th>Batch</th>
                <th>Pelatihan</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {batches.slice(0, 10).map((batch) => {
                const status = batchStatus(batch);

                return (
                  <tr key={batch.id}>
                    <td>
                      <b>{batch.program.name}</b>
                    </td>

                    <td>{batch.name}</td>

                    <td className="whitespace-nowrap text-mut">
                      {fmtD(batch.startDate)} – {fmtD(batch.endDate)}
                    </td>

                    <td>
                      <span
                        className={`badge ${
                          status === "open"
                            ? "bg-green-100 text-green-700"
                            : status === "soon"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {status === "open"
                          ? "Dibuka"
                          : status === "soon"
                          ? "Akan datang"
                          : "Selesai"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARDS */}
        <div className="md:hidden divide-y divide-line">
          {batches.slice(0, 10).map((batch) => {
            const status = batchStatus(batch);

            return (
              <div key={batch.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold text-navy leading-snug">
                      {batch.program.name}
                    </p>

                    <p className="mt-1 text-[11.5px] text-mut">
                      {batch.name}
                    </p>
                  </div>

                  <span
                    className={`badge shrink-0 ${
                      status === "open"
                        ? "bg-green-100 text-green-700"
                        : status === "soon"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {status === "open"
                      ? "Dibuka"
                      : status === "soon"
                      ? "Akan datang"
                      : "Selesai"}
                  </span>
                </div>

                <div className="mt-3 flex items-center gap-2 text-[11.5px] text-mut">
                  <Clock3 size={14} />
                  <span>
                    {fmtD(batch.startDate)} – {fmtD(batch.endDate)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {!batches.length && (
          <div className="p-6 text-center">
            <p className="text-mut text-sm">
              Belum ada jadwal pelatihan tahun 2026.
            </p>
          </div>
        )}
      </section>

      {/* AKTIVITAS */}
      <section className="card overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-line">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky2 text-navy grid place-items-center">
              <Activity size={17} />
            </div>

            <div>
              <h2 className="text-base sm:text-lg font-display font-extrabold text-navy">
                Aktivitas Terbaru
              </h2>

              <p className="text-mut text-[11.5px] sm:text-xs mt-0.5">
                Riwayat aktivitas terakhir di panel admin.
              </p>
            </div>
          </div>
        </div>

        <div className="divide-y divide-line">
          {audit.map((a) => (
            <div
              key={a.id}
              className="p-4 sm:px-5 flex gap-3"
            >
              <div className="mt-1.5 w-2 h-2 rounded-full bg-orange shrink-0" />

              <div className="min-w-0 flex-1">
                <p className="text-[12.5px] sm:text-[13px] text-navy leading-relaxed">
                  <b>{a.actor}</b>{" "}
                  <span className="text-mut">— {a.action}:</span>{" "}
                  {a.detail}
                </p>

                <p className="mt-1 text-[10.5px] sm:text-[11px] text-mut">
                  {new Date(a.createdAt).toLocaleString("id-ID")}
                </p>
              </div>
            </div>
          ))}

          {!audit.length && (
            <div className="p-6 text-center">
              <p className="text-mut text-sm">
                Belum ada aktivitas.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
