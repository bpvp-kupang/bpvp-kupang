"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2, X, Upload, Search } from "lucide-react";
import { useAdmin } from "./AdminShell";
import { can } from "@/lib/perms";
import { fmtD, badgeCls } from "@/lib/format";
import type { F, Col } from "@/lib/panels";

const get = (o: any, k: string) => k.split(".").reduce((a: any, c: string) => a?.[c], o);

export default function CrudPanel({ title, res, fields, cols }: { title: string; res: string; fields: F[]; cols: Col[] }) {
  const s = useAdmin();
  const may = can(s.role, res);
  const [rows, setRows] = useState<any[]>([]);
  const [q, setQ] = useState("");
  const [load, setLoad] = useState(true);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [form, setForm] = useState<{ id: string | null; v: Record<string, any> } | null>(null);
  const [progs, setProgs] = useState<{ id: string; name: string }[]>([]);

  const reload = useCallback(async () => {
    setLoad(true);
    try { const r = await fetch(`/api/admin/${res}`); const j = await r.json(); setRows(r.ok ? j.rows : []); }
    catch { setRows([]); }
    setLoad(false);
  }, [res]);

  useEffect(() => { reload(); }, [reload]);
  useEffect(() => {
    if (!fields.some((f) => f.t === "program")) return;
    fetch("/api/admin/programs").then((r) => r.json()).then((j) => setProgs(j.rows || [])).catch(() => {});
  }, [fields]);

  const filtered = useMemo(() => {
    if (!q) return rows;
    const qq = q.toLowerCase();
    return rows.filter((r) => JSON.stringify(r).toLowerCase().includes(qq));
  }, [rows, q]);

  function openCreate() {
    const v: Record<string, any> = {};
    for (const f of fields) v[f.k] = f.t === "check" ? false : "";
    setErr(""); setForm({ id: null, v });
  }
  function openEdit(row: any) {
    const v: Record<string, any> = {};
    for (const f of fields) {
      const val = get(row, f.k);
      if (f.t === "lines") v[f.k] = (val || []).join("\n");
      else if (f.t === "date") v[f.k] = val ? String(val).slice(0, 10) : "";
      else if (f.t === "check") v[f.k] = !!val;
      else v[f.k] = val ?? "";
    }
    setErr(""); setForm({ id: row.id, v });
  }

  async function submit() {
    if (!form) return;
    for (const f of fields) {
      if (!f.req) continue;
      const v = form.v[f.k];
      if (f.t === "check") continue;
      if (v === "" || v === null || v === undefined || (f.t === "lines" && !String(v).trim())) {
        setErr(`Kolom "${f.l}" wajib diisi.`); return;
      }
    }
    const payload: Record<string, any> = {};
    for (const f of fields) {
      let v = form.v[f.k];
      if (f.t === "num") v = v === "" ? null : Number(v);
      else if (f.t === "date") v = v ? new Date(v + "T00:00:00.000Z") : null;
      else if (f.t === "lines") v = String(v || "").split("\n").map((x: string) => x.trim()).filter(Boolean);
      else if (f.t === "check") v = !!v;
      payload[f.k] = v;
    }
    setBusy(true); setErr("");
    try {
      const r = await fetch(form.id ? `/api/admin/${res}/${form.id}` : `/api/admin/${res}`, {
        method: form.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Gagal menyimpan.");
      setForm(null); await reload();
    } catch (e: any) { setErr(e.message); }
    finally { setBusy(false); }
  }

  async function del(row: any) {
    const name = get(row, cols[0].k);
    if (!confirm(`Hapus "${name}"? Tindakan ini tercatat di audit log.`)) return;
    const r = await fetch(`/api/admin/${res}/${row.id}`, { method: "DELETE" });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) return alert(j.error || "Gagal menghapus.");
    reload();
  }

  async function uploadImg(file: File, k: string) {
    if (file.size > 2 * 1024 * 1024) { setErr("Ukuran gambar maksimal 2 MB."); return; }
    const data = await new Promise<string>((res) => { const fr = new FileReader(); fr.onload = () => res(String(fr.result)); fr.readAsDataURL(file); });
    try {
      const r = await fetch("/api/admin/upload", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ data }) });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error);
      setForm((f) => (f ? { ...f, v: { ...f.v, [k]: j.url } } : f));
    } catch (e: any) { setErr(e.message); }
  }

  const set = (k: string, v: any) => setForm((f) => (f ? { ...f, v: { ...f.v, [k]: v } } : f));

  function Cell({ row, c }: { row: any; c: Col }) {
    const v = get(row, c.k);
    if (c.t === "badge") return <span className={`badge ${badgeCls(v)}`}>{String(v ?? "-")}</span>;
    if (c.t === "date") return <span className="whitespace-nowrap text-mut">{fmtD(v)}</span>;
    if (c.t === "img") return v ? <img src={v} alt="" className="w-16 h-11 rounded-md object-cover" /> : <span className="text-mut">—</span>;
    if (c.t === "count") return <span className="text-mut">{(v || []).length} item</span>;
    if (c.t === "check") return v ? <span className="badge b-open">Ya</span> : <span className="badge t-mut">Tidak</span>;
    return <span className="line-clamp-2">{String(v ?? "-")}</span>;
  }

  function FieldInput({ f }: { f: F }) {
    const v = form?.v[f.k] ?? "";
    const lab = <label className="label">{f.l}{f.req ? " *" : ""}</label>;
    if (f.t === "area" || f.t === "lines")
      return <div><div className="flex items-baseline justify-between">{lab}{f.t === "lines" && <span className="text-[11px] text-mut">satu per baris</span>}</div>
        <textarea className="input min-h-[110px] resize-y" value={v} onChange={(e) => set(f.k, e.target.value)} placeholder={f.t === "lines" ? "Satu item per baris" : f.ph} /></div>;
    if (f.t === "sel")
      return <div>{lab}<select className="input" value={v} onChange={(e) => set(f.k, e.target.value)}>
        <option value="">— pilih —</option>{f.opts?.map((o) => <option key={o} value={o}>{o}</option>)}</select></div>;
    if (f.t === "num") return <div>{lab}<input type="number" className="input" value={v} onChange={(e) => set(f.k, e.target.value)} /></div>;
    if (f.t === "date") return <div>{lab}<input type="date" className="input" value={v} onChange={(e) => set(f.k, e.target.value)} /></div>;
    if (f.t === "check")
      return <label className="flex gap-2.5 items-center text-[13.5px] font-semibold py-2"><input type="checkbox" checked={!!v} onChange={(e) => set(f.k, e.target.checked)} className="w-4 h-4" />{f.l}</label>;
    if (f.t === "program")
      return <div>{lab}<select className="input" value={v} onChange={(e) => set(f.k, e.target.value)}>
        <option value="">— pilih program —</option>{progs.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>;
    if (f.t === "img")
      return <div>{lab}
        <div className="flex gap-2">
          <input className="input flex-1" value={v} placeholder="URL gambar (kosong = otomatis)" onChange={(e) => set(f.k, e.target.value)} />
          <label className="btn-out btn-sm cursor-pointer whitespace-nowrap"><Upload size={15} />Unggah
            <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => e.target.files?.[0] && uploadImg(e.target.files[0], f.k)} /></label>
        </div>
        {v && <img src={v} alt="Pratinjau" className="mt-2 h-24 rounded-lg object-cover" />}</div>;
    return <div>{lab}<input className="input" value={v} placeholder={f.ph} onChange={(e) => set(f.k, e.target.value)} /></div>;
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div>
          <h1 className="text-2xl">{title}</h1>
          <p className="text-mut text-[13px] mt-1">{rows.length} data · {may ? "Anda berhak menambah/mengubah" : "peran Anda hanya dapat melihat"}</p>
        </div>
        <div className="ml-auto flex gap-2.5">
          <div className="flex items-center gap-2 border-[1.5px] border-line rounded-lg px-3 bg-white">
            <Search size={15} className="text-mut" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari…" aria-label="Cari data" className="py-2 text-[13px] font-medium outline-none w-36 sm:w-48" />
          </div>
          {may && <button onClick={openCreate} className="btn-b btn-sm"><Plus size={15} />Tambah</button>}
        </div>
      </div>

      <div className="card p-0 overflow-x-auto">
        <table className="tbl">
          <thead><tr>
            {cols.map((c) => <th key={c.k}>{c.l}</th>)}
            {may && <th className="text-right">Aksi</th>}
          </tr></thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.id}>
                {cols.map((c) => <td key={c.k}><Cell row={row} c={c} /></td>)}
                {may && (
                  <td className="text-right whitespace-nowrap">
                    <button onClick={() => openEdit(row)} className="btn-out btn-xs mr-1.5" aria-label="Ubah"><Pencil size={13} /></button>
                    <button onClick={() => del(row)} className="btn-danger btn-xs" aria-label="Hapus"><Trash2 size={13} /></button>
                  </td>
                )}
              </tr>
            ))}
            {!load && !filtered.length && <tr><td colSpan={cols.length + 1} className="text-mut py-6 text-center">Belum ada data{q ? " untuk pencarian ini" : ""}.</td></tr>}
            {load && <tr><td colSpan={cols.length + 1} className="text-mut py-6 text-center">Memuat…</td></tr>}
          </tbody>
        </table>
      </div>

      {form && (
        <div className="fixed inset-0 z-[100] bg-navy/55 grid place-items-center p-4 overflow-auto" role="dialog" aria-modal="true">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-6 sm:p-7 max-h-[88vh] overflow-auto shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl">{form.id ? "Ubah" : "Tambah"} {title}</h2>
              <button onClick={() => setForm(null)} aria-label="Tutup" className="w-9 h-9 grid place-items-center rounded-lg border border-line"><X size={16} /></button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {fields.map((f) => <div key={f.k} className={f.t === "area" || f.t === "lines" || f.t === "img" || f.t === "check" ? "sm:col-span-2" : ""}><FieldInput f={f} /></div>)}
            </div>
            {err && <p className="text-bad font-semibold text-[13px] mt-4">{err}</p>}
            <div className="flex justify-end gap-2.5 mt-6">
              <button onClick={() => setForm(null)} className="btn-out btn-sm">Batal</button>
              <button onClick={submit} disabled={busy} className="btn-b btn-sm disabled:opacity-60">{busy ? "Menyimpan…" : "Simpan"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}