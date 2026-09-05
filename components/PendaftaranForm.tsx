// components/PendaftaranForm.tsx
"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Send, ShieldCheck } from "lucide-react";

type Prog = { id: string; name: string };
type OB = { id: string; programId: string; label: string };

const EDU = ["SD", "SMP", "SMA/SMK", "D1–D3", "S1", "S2+"];

export default function PendaftaranForm({ programs, openBatches, preselect }: { programs: Prog[]; openBatches: OB[]; preselect: string }) {
  const [prog, setProg] = useState(preselect);
  const batches = useMemo(() => openBatches.filter((b) => b.programId === prog), [openBatches, prog]);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<{ no: string } | null>(null);
  const [err, setErr] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr("");
    const f = new FormData(e.currentTarget);
    const d = Object.fromEntries(f.entries());
    // Validasi sisi klien (server tetap memvalidasi ulang)
    if (String(d.nama).trim().length < 3) return setErr("Nama minimal 3 huruf.");
    if (!/^\d{16}$/.test(String(d.nik))) return setErr("NIK harus 16 digit angka.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(d.email))) return setErr("Email tidak valid.");
    if (!/^(\+62|62|0)8\d{7,11}$/.test(String(d.whatsapp).replace(/[\s-]/g, ""))) return setErr("Nomor WhatsApp tidak valid.");
    if (!d.program_id || !d.batch_id) return setErr("Pilih program dan batch.");
    if (!d.setuju) return setErr("Centang pernyataan kebenaran data.");
    setBusy(true);
    try {
      const r = await fetch("/api/pendaftaran", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(d),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Gagal menyimpan.");
      setDone({ no: j.registrationNo });
      (e.target as HTMLFormElement).reset();
    } catch (e: any) {
      setErr(e.message);
    } finally { setBusy(false); }
  }

  if (done) return (
    <div className="card p-8 max-w-xl">
      <h3 className="text-2xl mb-2">Pendaftaran tercatat</h3>
      <p className="text-mut text-sm mb-5">Simpan nomor registrasi berikut — dibutuhkan untuk cek status.</p>
      <div className="bg-sky border-[1.5px] border-dashed border-blue2 rounded-xl py-4.5 px-5 text-center font-display font-extrabold text-2xl text-navy tracking-wider">{done.no}</div>
      <div className="flex gap-3 mt-6">
        <Link href="/cek-status" className="btn-b">Cek status sekarang</Link>
        <button onClick={() => setDone(null)} className="btn-out">Daftar peserta lain</button>
      </div>
    </div>
  );

  return (
    <form onSubmit={submit} className="card p-7 grid gap-4.5 max-w-2xl">
      <div className="grid sm:grid-cols-2 gap-4">
        <div><label className="label" htmlFor="nama">Nama lengkap <i className="text-bad not-italic">*</i></label><input id="nama" name="nama" className="input" autoComplete="name" required /></div>
        <div><label className="label" htmlFor="nik">NIK (16 digit) <i className="text-bad not-italic">*</i></label><input id="nik" name="nik" className="input" inputMode="numeric" pattern="\d{16}" maxLength={16} required /></div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div><label className="label" htmlFor="tempatLahir">Tempat lahir <i className="text-bad not-italic">*</i></label><input id="tempatLahir" name="tempatLahir" className="input" required /></div>
        <div><label className="label" htmlFor="tanggalLahir">Tanggal lahir <i className="text-bad not-italic">*</i></label><input id="tanggalLahir" name="tanggalLahir" type="date" className="input" required /></div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div><label className="label" htmlFor="gender">Jenis kelamin <i className="text-bad not-italic">*</i></label>
          <select id="gender" name="gender" className="input" required>
            <option value="">— pilih —</option><option value="L">Laki-laki</option><option value="P">Perempuan</option>
          </select>
        </div>
        <div><label className="label" htmlFor="pendidikan">Pendidikan terakhir <i className="text-bad not-italic">*</i></label>
          <select id="pendidikan" name="pendidikan" className="input" required>
            <option value="">— pilih —</option>{EDU.map((x) => <option key={x}>{x}</option>)}
          </select>
        </div>
      </div>
      <div><label className="label" htmlFor="alamat">Alamat domisili <i className="text-bad not-italic">*</i></label><input id="alamat" name="alamat" className="input" placeholder="Jalan, RT/RW, desa, kecamatan, kabupaten" required /></div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div><label className="label" htmlFor="whatsapp">Nomor WhatsApp <i className="text-bad not-italic">*</i></label><input id="whatsapp" name="whatsapp" className="input" inputMode="tel" placeholder="08xxxxxxxxxx" required /></div>
        <div><label className="label" htmlFor="email">Email <i className="text-bad not-italic">*</i></label><input id="email" name="email" type="email" className="input" autoComplete="email" required /></div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div><label className="label" htmlFor="program_id">Program pelatihan <i className="text-bad not-italic">*</i></label>
          <select id="program_id" name="program_id" className="input" value={prog} onChange={(e) => setProg(e.target.value)} required>
            <option value="">— pilih program —</option>
            {programs.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div><label className="label" htmlFor="batch_id">Batch / gelombang <i className="text-bad not-italic">*</i></label>
          <select id="batch_id" name="batch_id" className="input" required disabled={!batches.length}>
            <option value="">{batches.length ? "— pilih batch —" : "Tidak ada batch dibuka"}</option>
            {batches.map((b) => <option key={b.id} value={b.id}>{b.label}</option>)}
          </select>
        </div>
      </div>
      <label className="flex gap-2.5 items-start text-[13px] text-mut">
        <input type="checkbox" name="setuju" className="mt-1" />
        Data yang saya isikan benar dan saya bersedia dihubungi untuk verifikasi &amp; seleksi.
      </label>
      {err && <p className="text-bad font-semibold text-[13px]">{err}</p>}
      <button disabled={busy} className="btn-o w-full disabled:opacity-60">{busy ? "Mengirim…" : <>Kirim pendaftaran<Send size={17} /></>}</button>
      <p className="flex gap-2 items-start text-[12.5px] text-mut"><ShieldCheck size={16} className="text-blue shrink-0 mt-0.5" />Data pribadi Anda tersimpan di server BPVP Kupang, tidak dibagikan ke pihak lain, dan tidak ditampilkan di halaman publik.</p>
    </form>
  );
}