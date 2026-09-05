import { prisma } from "@/lib/prisma";
import { batchStatus } from "@/lib/batch";
import { fmtD } from "@/lib/format";
import BarChart from "@/components/admin/Charts";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [programs, batches, apps, participants, alumni, jobs, partners, audit] = await Promise.all([
    prisma.trainingProgram.count({ where: { status: "aktif" } }),
    prisma.trainingBatch.findMany({}),
    prisma.application.findMany({ include: { participant: true, program: true }, orderBy: { submittedAt: "desc" } }),
    prisma.participant.count(), prisma.alumni.count(),
    prisma.jobOpportunity.count({ where: { status: "aktif" } }), prisma.partner.count(),
    prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
  ]);
  const open = batches.filter((b) => batchStatus(b) === "open").length;

  const now = new Date();
  const months: { label: string; value: number }[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ label: d.toLocaleDateString("id-ID", { month: "short" }), value: 0 });
  }
  for (const a of apps) {
    const d = new Date(a.submittedAt);
    const idx = (now.getFullYear() - d.getFullYear()) * 12 + now.getMonth() - d.getMonth();
    if (idx >= 0 && idx < 12) months[11 - idx].value++;
  }
  const statuses = ["SUBMITTED", "VERIFIED", "SELECTED", "REJECTED", "COMPLETED"].map((st) => ({
    label: st.slice(0, 4), value: apps.filter((a) => a.status === st).length,
  }));

  const kpis: [string, number | string][] = [
    ["Program aktif", programs], ["Batch dibuka", open], ["Total pendaftar", apps.length],
    ["Peserta terdata", participants], ["Alumni terdata", alumni], ["Lowongan aktif", jobs],
  ];

  return (
    <div>
      <h1 className="text-2xl">Dashboard</h1>
      <p className="text-mut text-[13px] mt-1 mb-6">Ringkasan data langsung dari MySQL · {partners} mitra terjaring</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 mb-6">
        {kpis.map(([l, v]) => (
          <div key={l} className="card p-4.5">
            <span className="text-mut font-semibold text-[11.5px]">{l}</span>
            <b className="stat-num text-2xl block mt-2">{typeof v === "number" ? v.toLocaleString("id-ID") : v}</b>
          </div>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-5 mb-6">
        <div className="card p-6"><h3 className="text-base mb-4">Pendaftaran 12 bulan terakhir</h3><BarChart data={months} /></div>
        <div className="card p-6"><h3 className="text-base mb-4">Status pendaftaran</h3><BarChart data={statuses} color="#F26A21" /></div>
      </div>
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="card p-6">
          <h3 className="text-base mb-4">Pendaftar terbaru — data pribadi, tidak untuk publik</h3>
          <div className="overflow-x-auto"><table className="tbl">
            <thead><tr><th>No. Registrasi</th><th>Nama</th><th>Program</th><th>Tanggal</th></tr></thead>
            <tbody>{apps.slice(0, 6).map((a) => (
              <tr key={a.id}><td><b>{a.registrationNo}</b></td><td>{a.participant.name}</td><td>{a.program.name}</td><td className="whitespace-nowrap text-mut">{fmtD(a.submittedAt)}</td></tr>
            ))}</tbody>
          </table></div>
          {!apps.length && <p className="text-mut text-sm">Belum ada pendaftar.</p>}
        </div>
        <div className="card p-6">
          <h3 className="text-base mb-4">Aktivitas terbaru (audit log)</h3>
          {audit.map((a) => (
            <div key={a.id} className="text-[13px] py-2 border-b border-sky last:border-0">
              <b>{a.actor}</b> — {a.action}: {a.detail}
              <span className="block text-mut text-[11.5px]">{new Date(a.createdAt).toLocaleString("id-ID")}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}