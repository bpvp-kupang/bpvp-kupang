import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AuditPage() {
  const logs = await prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 150 });
  return (
    <div>
      <h1 className="text-2xl">Audit Log</h1>
      <p className="text-mut text-[13px] mt-1 mb-6">150 aktivitas terakhir — setiap tambah/ubah/hapus/login admin tercatat otomatis.</p>
      <div className="card p-0 overflow-x-auto">
        <table className="tbl">
          <thead><tr><th>Waktu</th><th>Pengguna</th><th>Aksi</th><th>Detail</th></tr></thead>
          <tbody>{logs.map((l) => (
            <tr key={l.id}>
              <td className="whitespace-nowrap text-mut">{new Date(l.createdAt).toLocaleString("id-ID")}</td>
              <td><b>{l.actor}</b></td>
              <td><span className="tag t-mut">{l.action}</span></td>
              <td>{l.detail}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}