// app/pendaftaran/page.tsx
import { prisma } from "@/lib/prisma";
import { batchStatus } from "@/lib/batch";
import { fmtD } from "@/lib/format";
import PendaftaranForm from "@/components/PendaftaranForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Pendaftaran Online", description: "Formulir pendaftaran online pelatihan BPVP Kupang." };

export default async function PendaftaranPage({ searchParams }: { searchParams: { program?: string } }) {
  const [programs, batches] = await Promise.all([
    prisma.trainingProgram.findMany({ where: { status: "aktif" }, select: { id: true, name: true } }),
    prisma.trainingBatch.findMany({ where: { /* filter lewat kode di bawah */ }, include: { program: true } }),
  ]);
  const open = batches.filter((b) => batchStatus(b) === "open")
    .map((b) => ({ id: b.id, programId: b.programId, label: `${b.name} · daftar s.d. ${fmtD(b.regEnd)}` }));

  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <p className="text-orange text-[12px] font-bold uppercase tracking-[.14em] mb-3.5">Pendaftaran Online</p>
      <h2 className="text-[clamp(26px,4vw,38px)] mb-3">Formulir pendaftaran peserta</h2>
      <p className="text-mut max-w-[640px] mb-9">Isi data dengan benar — data tersimpan di database resmi BPVP Kupang dan hanya digunakan untuk verifikasi &amp; seleksi (lihat halaman FAQ). Simpan nomor registrasi yang muncul setelah mengirim.</p>
      <div className="grid lg:grid-cols-[1fr_320px] gap-9 items-start">
        <PendaftaranForm programs={programs} openBatches={open} preselect={searchParams.program || ""} />
        <aside className="card p-6">
          <h3 className="flex items-center gap-2 text-base mb-4"><ClipboardListIco />Alur selanjutnya</h3>
          <ol className="ml-4 text-[13.5px] text-mut list-decimal space-y-2">
            {["Validasi data oleh petugas", "Seleksi berkas & wawancara", "Pengumuman diterima", "Pelatihan", "Ujian", "Kelulusan & sertifikat"].map((s) => <li key={s}><b className="text-ink">{s}</b></li>)}
          </ol>
          <p className="text-[12.5px] text-mut mt-5">Sudah punya nomor registrasi? <Link href="/cek-status" className="text-blue font-semibold">Cek status di sini</Link>.</p>
        </aside>
      </div>
    </section>
  );
}
function ClipboardListIco() { return <ClipboardList className="text-orange" size={18} />; }
import { ClipboardList } from "lucide-react"; import Link from "next/link";