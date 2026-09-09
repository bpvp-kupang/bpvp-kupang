"use client";
import { useCallback, useEffect, useState } from "react";
import { Plus, Pencil, X, Trash2 } from "lucide-react";
import { useAdmin } from "@/components/admin/AdminShell";
import { can } from "@/lib/perms";
import { ROLES } from "@/lib/panels";

export default function PenggunaPage() {
  const s = useAdmin();
  const may = can(s.role, "users");
  const [rows, setRows] = useState<any[]>([]);
  const [form, setForm] = useState<{ id: string | null; v: any } | null>(null);
  const [err, setErr] = useState("");

  const reload = useCallback(async () => {
    const r = await fetch("/api/admin/users"); const j = await r.json();
    setRows(r.ok ? j.rows : []);
  }, []);
  useEffect(() => { reload(); }, [reload]);

  async function save() {
    if (!form) return;
    setErr("");
    if (String(form.v.name).trim().length < 3) return setErr("Nama minimal 3 huruf.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(form.v.email))) return setErr("Email tidak valid.");
    if (!form.id && String(form.v.password || "").length < 8) return setErr("Password minimal 8 karakter untuk pengguna baru.");
    const r = await fetch(form.id ? `/api/admin/users/${form.id}` : "/api/admin/users", {
      method: form.id ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form.v),
    });
    const j = await r.json();
    if (!r.ok) return setErr(j.error || "Gagal menyimpan.");
    setForm(null); reload();
  }

  async function del(u: any) {
    if (!confirm(`Nonaktifkan akses ${u.name}? (disarankan nonaktifkan, bukan hapus, agar jejak audit utuh)`)) return;
    const r = await fetch(`/api/admin/users/${u.id}`, { method: "DELETE" });
    if (r.ok) reload(); else { const j = await r.json().catch(() => ({})); alert(j.error || "Gagal."); }
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <div><h1 className="text-2xl">Pengguna</h1><p className="text-mut text-[13px] mt-1">{rows.length} akun · password tersimpan sebagai hash bcrypt</p></div>
        {may && <button onClick={() => setForm({ id: null, v: { name: "", email: "", role: "VIEWER", status: "aktif", password: "" } })} className="btn-b btn-sm ml-auto"><Plus size={15} />Tambah</button>}
      </div>
      <div className="card p-0 overflow-x-auto mb-6">
        <table className="tbl">
          <thead><tr><th>Nama</th><th>Email</th><th>Peran</th><th>Status</th>{may && <th className="text-right">Aksi</th>}</tr></thead>
          <tbody>{rows.map((u: any) => (
            <tr key={u.id}>
            <td><b>{u.name}</b>{u.email === (s as any).email && <span className="tag t-mut ml-2">Anda</span>}</td>
              <td>{u.email}</td>
              <td><span className={`tag ${u.role === "SUPER_ADMIN" ? "t-bad" : u.role === "VIEWER" ? "t-mut" : "t-ok"}`}>{u.role}</span></td>
              <td><span className={`tag ${u.status === "aktif" ? "t-ok" : "t-warn"}`}>{u.status}</span></td>
              {may && <td className="text-right whitespace-nowrap">
                <button onClick={() => setForm({ id: u.id, v: { ...u, password: "" } })} className="btn-out btn-xs mr-1.5"><Pencil size={13} /></button>
             {u.email !== (s as any).email && <button onClick={() => del(u)} className="btn-danger btn-xs"><Trash2 size={13} /></button>}
              </td>}
            </tr>
          ))}</tbody>
        </table>
      </div>
      <div className="card p-6">
        <h3 className="text-base mb-4">Matriks peran (RBAC — divalidasi di server)</h3>
        <table className="tbl">
          <thead><tr><th>Peran</th><th>Program/Jadwal</th><th>Berita/Galeri</th><th>Peserta/Pendaftaran</th><th>Pengguna</th><th>Backup</th></tr></thead>
          <tbody>{[
            ["SUPER_ADMIN", "Ya", "Ya", "Ya", "Ya", "Ya"], ["ADMIN", "Ya", "Ya", "Ya", "Tidak", "Tidak"],
            ["OPERATOR", "Tidak", "Tidak", "Ya", "Tidak", "Tidak"], ["EDITOR", "Program saja", "Ya", "Tidak", "Tidak", "Tidak"],
            ["VIEWER", "Tidak", "Tidak", "Tidak", "Tidak", "Tidak"],
          ].map((r) => <tr key={r[0]}><td><b>{r[0]}</b></td>{r.slice(1).map((c, i) => <td key={i}>{c}</td>)}</tr>)}</tbody>
        </table>
      </div>

      {form && (
        <div className="fixed inset-0 z-[100] bg-navy/55 grid place-items-center p-4" onClick={() => setForm(null)}>
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl">{form.id ? "Ubah" : "Tambah"} Pengguna</h2>
              <button onClick={() => setForm(null)} aria-label="Tutup" className="w-9 h-9 grid place-items-center rounded-lg border border-line"><X size={16} /></button>
            </div>
            <div className="grid gap-3.5">
              <div><label className="label">Nama *</label><input className="input" value={form.v.name} onChange={(e) => setForm({ ...form, v: { ...form.v, name: e.target.value } })} /></div>
              <div><label className="label">Email *</label><input type="email" className="input" value={form.v.email} onChange={(e) => setForm({ ...form, v: { ...form.v, email: e.target.value } })} /></div>
              <div><label className="label">Peran</label><select className="input" value={form.v.role} onChange={(e) => setForm({ ...form, v: { ...form.v, role: e.target.value } })}>{ROLES.map((r) => <option key={r}>{r}</option>)}</select></div>
              <div><label className="label">Status</label><select className="input" value={form.v.status} onChange={(e) => setForm({ ...form, v: { ...form.v, status: e.target.value } })}><option>aktif</option><option>nonaktif</option></select></div>
              <div><label className="label">Password {form.id && <span className="text-mut font-medium">(kosongkan bila tidak diubah)</span>}</label><input type="password" className="input" placeholder="minimal 8 karakter" value={form.v.password} onChange={(e) => setForm({ ...form, v: { ...form.v, password: e.target.value } })} /></div>
            </div>
            {err && <p className="text-bad font-semibold text-[13px] mt-4">{err}</p>}
            <div className="flex justify-end gap-2.5 mt-6">
              <button onClick={() => setForm(null)} className="btn-out btn-sm">Batal</button>
              <button onClick={save} className="btn-b btn-sm">Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}