import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, clearCookie } from "@/lib/auth";
import { can } from "@/lib/perms";

const TABLES = [
  "user", "mediaFile", "auditLog", "jobOpportunity", "fAQ", "gallery", "news",
  "partner", "instructor", "alumni", "trainingProgram", "participant", "trainingBatch", "application",
];
const MODELS: Record<string, string> = {
  user: "user", mediaFile: "mediaFile", auditLog: "auditLog", jobOpportunity: "jobOpportunity",
  fAQ: "fAQ", gallery: "gallery", news: "news", partner: "partner", instructor: "instructor",
  alumni: "alumni", trainingProgram: "trainingProgram", participant: "participant",
  trainingBatch: "trainingBatch", application: "application",
};

export async function GET() {
  const s = getSession();
  if (!s || !can(s.role, "backup")) return NextResponse.json({ error: "Hanya Super Admin." }, { status: 403 });
  const dump: any = { generated_at: new Date().toISOString(), tables: {} };
  for (const t of [...TABLES].reverse()) {
    const rows = await (prisma as any)[MODELS[t]].findMany();
    dump.tables[t] = t === "mediaFile"
      ? rows.map(({ data, ...r }: any) => ({ ...r, data: Buffer.from(data).toString("base64") }))
      : rows;
  }
  await prisma.auditLog.create({ data: { actor: s.name, action: "Backup", detail: "Unduh snapshot JSON" } });
  return new NextResponse(JSON.stringify(dump, null, 2), {
    headers: { "Content-Type": "application/json", "Content-Disposition": `attachment; filename="bpvpkupang-backup-${new Date().toISOString().slice(0, 10)}.json"` },
  });
}

export async function POST(req: NextRequest) {
  const s = getSession();
  if (!s || !can(s.role, "backup")) return NextResponse.json({ error: "Hanya Super Admin." }, { status: 403 });
  let dump: any;
  try { dump = await req.json(); } catch { return NextResponse.json({ error: "Body JSON tidak valid." }, { status: 400 }); }
  if (!dump?.tables?.user || !dump?.tables?.trainingProgram)
    return NextResponse.json({ error: "Struktur file backup tidak dikenal." }, { status: 400 });
  try {
    await prisma.$transaction(async (tx: any) => {
      for (const t of TABLES) await tx[MODELS[t]].deleteMany();
      for (const t of [...TABLES].reverse()) {
        for (const row of dump.tables[t] || []) {
          const data = t === "mediaFile" ? { ...row, data: Buffer.from(row.data, "base64") } : row;
          await tx[MODELS[t]].create({ data });
        }
      }
    });
    await prisma.auditLog.create({ data: { actor: s.name, action: "Restore", detail: "Memuat data dari file backup" } });
    const res = NextResponse.json({ ok: true });
    res.headers.set("Set-Cookie", clearCookie()); // paksa login ulang setelah restore
    return res;
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: "Gagal restore: " + (e?.message || "kesalahan data.") }, { status: 500 });
  }
}