"use client";

import { FormEvent, useState } from "react";
import { LockKeyhole, LogIn, ShieldCheck } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    setErr("");
    setBusy(true);
    try {
      const r = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.error || "Email atau password salah.");
      window.location.href = "/admin";
    } catch (e: any) {
      setErr(e?.message || "Gagal masuk.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-sky2 grid place-items-center p-5">
      <div className="w-full max-w-md">
        <div className="card p-7 sm:p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-navy text-white">
              <ShieldCheck size={24} />
            </div>
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[.16em] text-orange">BPVP KUPANG</p>
              <h1 className="text-2xl">Login Admin</h1>
            </div>
          </div>
          <p className="text-mut text-[13px] leading-relaxed mb-6">
            Masuk untuk mengelola program pelatihan, jadwal, pendaftar, berita, alumni, dan data layanan BPVP Kupang.
          </p>
          <form onSubmit={submit} className="grid gap-4">
            <div>
              <label className="label">Email</label>
              <input className="input" type="email" autoComplete="username" required value={email}
                onChange={(e) => setEmail(e.target.value)} placeholder="admin@bpvpkupang.go.id" />
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <LockKeyhole size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-mut" />
                <input className="input pl-9" type="password" autoComplete="current-password" required value={password}
                  onChange={(e) => setPassword(e.target.value)} placeholder="Masukkan password" />
              </div>
            </div>
            {err && <div className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-[13px] font-semibold text-bad">{err}</div>}
            <button className="btn-b w-full justify-center mt-1" disabled={busy}>
              <LogIn size={16} />{busy ? "Memeriksa…" : "Masuk ke Dashboard"}
            </button>
          </form>
          <p className="text-mut text-[11.5px] mt-5 text-center">Akses terbatas untuk petugas yang berwenang.</p>
        </div>
        <a href="/" className="block text-center text-blue font-bold text-[13px] mt-4">← Kembali ke situs publik</a>
      </div>
    </main>
  );
}
