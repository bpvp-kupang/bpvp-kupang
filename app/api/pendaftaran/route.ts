import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { batchStatus } from "@/lib/batch";
import { limited } from "@/lib/rate-limit";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const WA = /^(\+62|62|0)8\d{7,11}$/;
const s = (v: unknown, max = 300) => String(v ?? "").trim().slice(0, max);

export async function POST(req: NextRequest) {
  if (limited("reg:" + (req.headers.get("x-forwarded-for") || "local"), 5, 3600e3))
    return NextResponse.json({ error: "Terlalu banyak pendaftaran dari jaringan ini. Hubungi kami via WhatsApp." }, { status: 429 });
  try {
    const b = await req.json();
    const nama = s(b.nama, 100), nik = s(b.nik, 16), email = s(b.email, 100).toLowerCase(), wa = s(b.whatsapp, 16).replace(/[\s-]/g, "");
    if (nama.length < 3) return NextResponse.json({ error: "Nama minimal 3 huruf." }, { status: 400 });
    if (!/^\d{16}$/.test(nik)) return NextResponse.json({ error: "NIK harus 16 digit." }, { status: 400 });
    if (!b.tanggalLahir) return NextResponse.json({ error: "Tanggal lahir wajib diisi." }, { status: 400 });
    if (b.gender !== "L" && b.gender !== "P") return NextResponse.json({ error: "Pilih jenis kelamin." }, { status: 400 });
    if (s(b.alamat, 300).length < 4) return NextResponse.json({ error: "Alamat wajib diisi." }, { status: 400 });
    if (!EMAIL.test(email)) return NextResponse.json({ error: "Email tidak valid." }, { status: 400 });
    if (!WA.test(wa)) return NextResponse.json({ error: "Nomor WhatsApp tidak valid." }, { status: 400 });
    if (!b.pendidikan) return NextResponse.json({ error: "Pilih pendidikan terakhir." }, { status: 400 });

    const batch = await prisma.trainingBatch.findUnique({ where: { id: s(b.batch_id, 40) }, include: { program: true } });
    if (!batch || batch.programId !== b.program_id || batchStatus(batch) !== "open")
      return NextResponse.json({ error: "Batch tidak ditemukan atau pendaftarannya sedang tidak dibuka." }, { status: 400 });

    const dup = await prisma.application.findFirst({ where: { participant: { nik }, batchId: batch.id } });
    if (dup) return NextResponse.json({ error: `NIK ini sudah terdaftar di batch ini (nomor ${dup.registrationNo}).` }, { status: 409 });

    const result = await prisma.$transaction(async (tx) => {
      const participant = await tx.participant.upsert({
        where: { nik },
        update: { name: nama, birthPlace: s(b.tempatLahir, 80), birthDate: new Date(b.tanggalLahir), gender: b.gender, address: s(b.alamat), whatsapp: wa, email, education: s(b.pendidikan, 20) },
        create: { nik, name: nama, birthPlace: s(b.tempatLahir, 80), birthDate: new Date(b.tanggalLahir), gender: b.gender, address: s(b.alamat), whatsapp: wa, email, education: s(b.pendidikan, 20), notes: s(b.catatan, 500) || null },
      });
      const count = await tx.application.count();
      const no = `BPVP-${new Date().getFullYear()}-${String(count + 1).padStart(4, "0")}`;
      const app = await tx.application.create({ data: { registrationNo: no, participantId: participant.id, programId: batch.programId, batchId: batch.id } });
      await tx.auditLog.create({ data: { actor: "Pendaftar", action: "Pendaftaran baru", detail: `${no} — ${nama} (${batch.program.name})`, ip: req.headers.get("x-forwarded-for") || undefined } });
      return app;
    });
    return NextResponse.json({ ok: true, registrationNo: result.registrationNo });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: "Gagal menyimpan pendaftaran." }, { status: 500 });
  }
}