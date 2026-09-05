// app/api/pendaftaran/status/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const no = (req.nextUrl.searchParams.get("no") || "").trim().toUpperCase();
  if (!/^BPVP-\d{4}-\d{4}$/.test(no)) return NextResponse.json({ error: "Format nomor registrasi tidak valid." }, { status: 400 });
  const a = await prisma.application.findUnique({
    where: { registrationNo: no },
    select: { status: true, participant: { select: { name: true } }, program: { select: { name: true } }, batch: { select: { name: true } } },
  });
  if (!a) return NextResponse.json({ error: "Nomor registrasi tidak ditemukan. Periksa kembali atau hubungi petugas." }, { status: 404 });
  return NextResponse.json({ status: a.status, name: a.participant.name, program: a.program.name, batch: a.batch.name });
}