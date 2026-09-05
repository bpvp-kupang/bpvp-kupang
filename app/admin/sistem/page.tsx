import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function SistemPage() {
  const s = getSession();
  const [users, logs, media] = await Promise.all([
    prisma.user.count(),
    prisma.auditLog.count(),
    prisma.mediaFile.count(),
  ]);
  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl">Backup &amp; Security</h1>
      <p className="text-mut text-[13px] mt-1 mb-6">Ringkasan keamanan dan data sistem. Akses halaman ini hanya untuk SUPER_ADMIN.</p>
      <div className="grid sm:grid-cols-3 gap-3.5 mb-6">
        {[
          ["Akun pengguna", users],
          ["Audit log", logs],
          ["Media tersimpan", media],
        ].map(([label, value]) => (
          <div className="card p-5" key={String(label)}>
            <span className="text-mut text-[12px] font-semibold">{label}</span>
            <b className="block text-2xl mt-2">{Number(value).toLocaleString("id-ID")}</b>
          </div>
        ))}
      </div>
      <div className="card p-6">
        <h2 className="text-lg mb-3">Keamanan</h2>
        <ul className="space-y-2 text-[13.5px] leading-relaxed text-mut">
          <li>• Sesi admin menggunakan cookie HttpOnly dengan masa berlaku terbatas.</li>
          <li>• Password pengguna disimpan sebagai hash bcrypt, bukan teks biasa.</li>
          <li>• Perubahan data admin dicatat pada Audit Log.</li>
          <li>• Untuk produksi, isi <code>SESSION_SECRET</code> dengan nilai acak yang panjang dan rahasiakan file <code>.env</code>.</li>
        </ul>
        <p className="mt-5 text-[12px] text-mut">Login saat ini: {s?.name ?? "—"} ({s?.role ?? "—"})</p>
      </div>
    </div>
  );
}
