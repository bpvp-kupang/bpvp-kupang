"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Download, Eye, X, Search } from "lucide-react";
import { useAdmin } from "@/components/admin/AdminShell";
import { can } from "@/lib/perms";
import { fmtD, badgeCls } from "@/lib/format";

const STATUSES = ["SUBMITTED", "VERIFIED", "SELECTED", "REJECTED", "COMPLETED"];

export default function PesertaPage() {
  const s = useAdmin();
  const may = can(s.role, "applications");
  const [rows, setRows] = useState<any[]>([]);
  const [q, setQ] = useState("");
  const [det, setDet] = useState<any>(null);
  const [err, setErr] = useState("");

  const reload = useCallback(async () => {
    const r = await fetch("/api/admin/applications");
    const j = await r.json();
    setRows(r.ok ? j.rows : []);
  }, []);
  useEffect(() => { reload(); }, [reload]);

  const filtered = useMemo(() => {
    if (!q) return rows;
    const qq = q.toLowerCase();
    return rows.filter((r: any) => JSON.stringify(r).toLowerCase().includes(qq));
  }, [rows, q]);

  async function setStat(id: string, status: string) {
    setErr("");
    const r = await fetch(`/api/admin/applications/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    if (!r.ok) { const j = await r.json().catch(() => ({})); setErr(j.error || "Gagal mengubah status."); return; }
    setRows((rs) => rs.map((x: any) => (x.id === id ? { ...x, status } : x)));
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div>
          <h1 className="text-2xl">Peserta &amp; Pendaftaran</h1>
          <p className="text-mut text-[13px] mt-1">{rows.length} pendaftar · data pribadi, tidak untuk publik{!may && " · peran Anda hanya dapat melihat"}</p>
        </div>
        <div className="ml-auto flex gap-2.5">
          <div className="flex items-center gap-2 border-[1.5px] border-line rounded-lg px-3 bg-white">
            <Search size={15} className="text-mut" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari nama / no. registrasi…" aria-label="Cari pendaftar" className="py-2 text-[13px] font-medium outline-none w-44 sm:w-56" />
          </div>
          <a href="/api/admin/exsport?type=applications" className="btn-b btn-sm"><Download size={15} />Export CSV</a>
        </div>
      </div>
      {err && <p className="text-bad font-semibold text-[13px] mb-4">{err}</p>}
      <div className="card p-0 overflow-x-auto">
        <table className="tbl">
          <thead><tr><th>No. Registrasi</th><th>Nama</th><th>Program</th><th>Batch</th><th>Tanggal</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {filtered.map((a: any) => (
              <tr key={a.id}>
                <td><b>{a.registrationNo}</b></td>
                <td>{a.participant?.name}</td>
                <td>{a.program?.name}</td>
                <td>{a.batch?.name}</td>
                <td className="whitespace-nowrap text-mut">{fmtD(a.submittedAt)}</td>
                <td>
                  <select value={a.status} disabled={!may} onChange={(e) => setStat(a.id, e.target.value)}
                    className="border border-line rounded-md px-2 py-1 text-[12px] font-semibold bg-white disabled:opacity-70">
                    {STATUSES.map((st) => <option key={st}>{st}</option>)}
                  </select>
                </td>
                <td><button onClick={() => setDet(a)} className="btn-out btn-xs" aria-label="Detail"><Eye size={13} /></button></td>
              </tr>
            ))}
            {!filtered.length && <tr><td colSpan={7} className="text-center text-mut py-6">Belum ada pendaftar.</td></tr>}
          </tbody>
        </table>
      </div>

      {det && (
        <div className="fixed inset-0 z-[100] bg-navy/55 grid place-items-center p-4" onClick={() => setDet(null)} role="dialog" aria-modal="true">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 max-h-[88vh] overflow-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl">Detail Pendaftar</h2>
              <button onClick={() => setDet(null)} aria-label="Tutup" className="w-9 h-9 grid place-items-center rounded-lg border border-line"><X size={16} /></button>
            </div>
            <div className="space-y-2.5">
              {[
                ["No. registrasi", det.registrationNo], ["Status", det.status], ["Nama", det.participant?.name],
                ["NIK", det.participant?.nik], ["Tempat/tgl lahir", `${det.participant?.birthPlace ?? "-"}, ${fmtD(det.participant?.birthDate)}`],
                ["Jenis kelamin", det.participant?.gender === "L" ? "Laki-laki" : det.participant?.gender === "P" ? "Perempuan" : "-"],
                ["Alamat", det.participant?.address], ["WhatsApp", det.participant?.whatsapp], ["Email", det.participant?.email],
                ["Pendidikan", det.participant?.education], ["Program", det.program?.name], ["Batch", det.batch?.name],
              ].map(([k, v]) => (
                <div key={k as string} className="flex justify-between gap-3 text-[13.5px] border-b border-dashed border-line pb-2">
                  <span className="text-mut">{k}</span><b className="text-right">{String(v ?? "-")}</b>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}