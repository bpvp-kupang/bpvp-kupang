import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { can } from "@/lib/perms";

const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;

export async function GET(req: NextRequest) {
  const s = getSession();
  if (!s || !can(s.role, "applications"))
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 403 });
  const type = req.nextUrl.searchParams.get("type") || "applications";
  const rows = type === "participants"
    ? (await prisma.participant.findMany({ orderBy: { createdAt: "desc" } })).map((p) =>
        [p.name, p.nik, p.whatsapp, p.email, p.education, p.address, new Date(p.createdAt).toISOString().slice(0, 10)])
    : (await prisma.application.findMany({ include: { participant: true, program: true, batch: true }, orderBy: { submittedAt: "desc" } })).map((a) =>
        [a.registrationNo, a.participant.name, a.participant.nik, a.participant.whatsapp, a.program.name, a.batch.name, new Date(a.submittedAt).toISOString().slice(0, 10), a.status]);
  const head = type === "participants"
    ? ["Nama", "NIK", "WhatsApp", "Email", "Pendidikan", "Alamat", "Terdaftar"]
    : ["No. Registrasi", "Nama", "NIK", "WhatsApp", "Program", "Batch", "Tanggal", "Status"];
  const csv = "\uFEFF" + [head, ...rows].map((r) => r.map(esc).join(";")).join("\r\n");
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="bpvp-${type}-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}