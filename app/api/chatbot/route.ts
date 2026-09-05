import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { batchStatus } from "@/lib/batch";
import { limited } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  if (limited("chat:" + (req.headers.get("x-forwarded-for") || "local"), 30, 60e3))
    return NextResponse.json({ reply: "Sedang banyak pertanyaan. Mohon tunggu sebentar." });
  const { message = "" } = await req.json().catch(() => ({}));
  const q = String(message).toLowerCase();
  const [batches, jobsCount, faqs] = await Promise.all([
    prisma.trainingBatch.findMany({ include: { program: true } }),
    prisma.jobOpportunity.count({ where: { status: "aktif" } }),
    prisma.fAQ.findMany({ where: { status: "aktif" } }),
  ]);
  const open = batches.filter((b) => batchStatus(b) === "open");
  const R = (reply: string, link?: { href: string; label: string }) => NextResponse.json({ reply, link });

  if (/(^|\s)(hai|halo|hello)/.test(q)) return R("Halo! Saya Asisten BPVP Kupang. Saya bisa membantu soal program, jadwal, syarat, cara daftar, sertifikat, status pendaftaran, dan peluang kerja.");
  if (/apa itu|tentang bpvp|siapa bpvp/.test(q)) return R("BPVP Kupang adalah Balai Pelatihan Vokasi dan Produktivitas di bawah Kementerian Ketenagakerjaan RI untuk wilayah NTT — pelatihan kerja di bidang digital, pariwisata, fashion, otomotif, dan teknik.");
  if (/jadwal|batch|gelombang|kapan/.test(q)) {
    const names = open.slice(0, 3).map((b) => b.program.name).join(", ");
    return R(`Saat ini ada ${open.length} batch dengan pendaftaran dibuka${names ? ", antara lain: " + names : ""}.`, { href: "/jadwal", label: "Buka halaman Jadwal" });
  }
  if (/status|cek/.test(q)) return R("Untuk mengecek status pendaftaran, buka halaman Cek Status lalu masukkan nomor registrasi Anda (format BPVP-2025-0001).", { href: "/cek-status", label: "Cek status sekarang" });
  if (/daftar|mendaftar|registrasi|caranya/.test(q)) return R("Cara mendaftar: buka halaman Pendaftaran, pilih program yang batch-nya berstatus 'pendaftaran dibuka', isi formulir, lalu simpan nomor registrasi yang muncul. Pendaftaran resmi juga tersedia di platform pelatihan Kemnaker.", { href: "/pendaftaran", label: "Buka halaman Pendaftaran" });
  if (/syarat|persyaratan|umur|usia/.test(q)) return R("Persyaratan umum: usia minimal 18 tahun, pendidikan sesuai ketentuan program, sehat jasmani, tidak sedang mengikuti pelatihan lain, dan data pendaftaran benar. Rincian tiap program ada di halaman detailnya.");
  if (/sertifik/.test(q)) return R("Peserta yang lulus menerima sertifikat pelatihan. Uji sertifikasi kompetensi tersedia bagi lulusan tertentu sesuai skema dan persyaratan program.");
  if (/gratis|biaya|bayar/.test(q)) return R("Pelatihan di BPVP umumnya tidak dipungut biaya bagi peserta yang lolos seleksi dan didanai program pemerintah. Informasi resmi terbaru diumumkan melalui kanal resmi BPVP Kupang.");
  if (/kerja|lowongan|magang/.test(q)) return R(`Saat ini tersedia ${jobsCount} peluang kerja/magang dari mitra industri.`, { href: "/lowongan", label: "Lihat lowongan" });
  if (/kontak|alamat|telepon|lokasi/.test(q)) return R("BPVP Kupang: Jl. Penfui Timur, Kota Kupang, NTT. Telepon (0380) 000-0000, email info@bpvpkupang.com, layanan Senin–Jumat 08.00–16.00 WITA.", { href: "/kontak", label: "Halaman kontak" });
  if (/otomatis.*(kerja|pekerjaan)|langsung.*pekerjaan/.test(q)) return R("BPVP tidak menjanjikan pekerjaan otomatis setelah lulus. Peserta dibekali kompetensi terukur, sertifikat, jejaring mitra, dan informasi lowongan/magang.");

  // fallback: jawaban FAQ terdekat berdasarkan skor kata
  const words = q.split(/\W+/).filter((w) => w.length > 3);
  let best: { a: string; score: number } | null = null;
  for (const f of faqs) {
    const t = (f.question + " " + f.answer).toLowerCase();
    const score = words.reduce((n, w) => n + (t.includes(w) ? 1 : 0), 0);
    if (score > 0 && (!best || score > best.score)) best = { a: f.answer, score };
  }
  if (best) return R(best.a);
  return R("Maaf, informasi tersebut belum tersedia. Silakan hubungi BPVP Kupang melalui kanal resmi.", { href: "/kontak", label: "Hubungi BPVP Kupang" });
}