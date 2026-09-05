// app/cek-status/page.tsx  (client)
"use client";
import { useState } from "react";
import { Search } from "lucide-react";

const STLBL: Record<string, [string, string]> = {
  SUBMITTED: ["bg-sky text-blue", "Pendaftaran Anda sudah masuk dan menunggu verifikasi petugas."],
  VERIFIED: ["bg-warnBg text-warn", "Data Anda terverifikasi. Menunggu jadwal seleksi."],
  SELECTED: ["bg-okBg text-ok", "Selamat! Anda dinyatakan diterima. Ikuti petunjuk selanjutnya via WhatsApp."],
  REJECTED: ["bg-badBg text-bad", "Pendaftaran belum lolos seleksi. Silakan coba batch berikutnya."],
  COMPLETED: ["bg-okBg text-ok", "Pelatihan Anda selesai. Terima kasih telah belajar bersama BPVP Kupang."],
};

export default function CekStatusPage() {
  const [no, setNo] = useState(""); const [res, setRes] = useState<any>(null); const [err, setErr] = useState("");

  async function cek(e: React.FormEvent) {
    e.preventDefault(); setErr(""); setRes(null);
    const r = await fetch(`/api/pendaftaran/status?no=${encodeURIComponent(no.trim())}`);
    const j = await r.json();
    if (!r.ok) return setErr(j.error);
    setRes(j);
  }

  return (
    <section className="max-w-xl mx-auto px-6 py-16">
      <p className="text-orange text-[12px] font-bold uppercase tracking-[.14em] mb-3.5">Cek Status Pendaftaran</p>
      <h1 className="text-[clamp(26px,4vw,36px)] mb-3">Masukkan nomor registrasi Anda</h1>
      <p className="text-mut mb-7">Nomor berformat <b>BPVP-2025-0001</b> yang Anda terima saat mendaftar.</p>
      <form onSubmit={cek} className="flex gap-2.5">
        <input value={no} onChange={(e) => setNo(e.target.value)} placeholder="BPVP-…" aria-label="Nomor registrasi" className="input flex-1 font-display font-bold tracking-wider" />
        <button className="btn-o"><Search size={17} />Cek</button>
      </form>
      {err && <p className="mt-4 text-bad font-semibold text-sm bg-badBg rounded-lg px-4 py-3">{err}</p>}
      {res && (
        <div className="card p-6 mt-6">
          <div className={`badge ${STLBL[res.status]?.[0] || "bg-sky text-blue"}`}>{res.status}</div>
          <h3 className="text-lg mt-3">{res.name}</h3>
          <p className="text-mut text-sm">Program: {res.program} · Batch: {res.batch}</p>
          <p className="text-sm mt-3">{STLBL[res.status]?.[1]}</p>
        </div>
      )}
    </section>
  );
}  