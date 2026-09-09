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

  const kpis: [string, number][] = [
    ["Program aktif", programs],
    ["Batch 2026", batches.length],
    ["Batch dibuka", open],
    ["Berita", news],
    ["Galeri", gallery],
  ];

  return (
    <div>
      <h1 className="text-2xl">Dashboard</h1>

      <p className="text-mut text-[13px] mt-1 mb-6">
        Ringkasan pengelolaan pelatihan BPVP Kupang tahun 2026
      </p>

      {/* KPI */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 mb-6">
        {kpis.map(([label, value]) => (
          <div key={label} className="card p-4.5">
            <span className="text-mut font-semibold text-[11.5px]">
              {label}
            </span>

            <b className="stat-num text-2xl block mt-2">
              {value.toLocaleString("id-ID")}
            </b>
          </div>
        ))}
      </div>

      {/* Jadwal Pelatihan */}
      <div className="card p-6 mb-6">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base">
              Jadwal Pelatihan 2026
            </h3>

            <p className="text-mut text-[12px] mt-1">
              Daftar batch pelatihan tahun 2026
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
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
                      {fmtD(batch.startDate)} –{" "}
                      {fmtD(batch.endDate)}
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

        {!batches.length && (
          <p className="text-mut text-sm">
            Belum ada jadwal pelatihan tahun 2026.
          </p>
        )}
      </div>

      {/* Audit Log */}
      <div className="card p-6">
        <h3 className="text-base mb-4">
          Aktivitas terbaru
        </h3>

        {audit.map((a) => (
          <div
            key={a.id}
            className="text-[13px] py-2 border-b border-sky last:border-0"
          >
            <b>{a.actor}</b> — {a.action}: {a.detail}

            <span className="block text-mut text-[11.5px]">
              {new Date(a.createdAt).toLocaleString("id-ID")}
            </span>
          </div>
        ))}

        {!audit.length && (
          <p className="text-mut text-sm">
            Belum ada aktivitas.
          </p>
        )}
      </div>
    </div>
  );
}