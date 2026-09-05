import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { RES } from "@/lib/resources";
import { can } from "@/lib/perms";

const jerr = (msg: string, code: number) => NextResponse.json({ error: msg }, { status: code });
const sameOrigin = (req: NextRequest) => {
  const o = req.headers.get("origin");
  if (!o) return true;
  try { return new URL(o).host === req.headers.get("host"); } catch { return false; }
};

export async function PUT(req: NextRequest, { params }: { params: { resource: string; id: string } }) {
  const s = getSession();
  if (!s) return jerr("Sesi berakhir.", 401);
  if (!sameOrigin(req)) return jerr("Origin tidak diizinkan (proteksi CSRF).", 403);
  const { resource: res, id } = params, cfg = RES[res];
  if (!cfg) return jerr("Koleksi tidak dikenal.", 404);
  if (!can(s.role, res)) return jerr("Peran Anda tidak berhak mengubah data ini.", 403);
  try {
    const body = await req.json();
    const picked: Record<string, unknown> = {};
    for (const k of cfg.allow) if (body[k] !== undefined) picked[k] = body[k];
    if (!Object.keys(picked).length) return jerr("Tidak ada perubahan.", 400);
    const data = (await cfg.before?.(picked, false)) ?? picked;
    const row = await (prisma as any)[cfg.model].update({ where: { id }, data });
    await prisma.auditLog.create({ data: { actor: s.name, action: `Ubah ${res}`, detail: cfg.label(row) } });
    return NextResponse.json({ ok: true, row: cfg.strip ? cfg.strip(row) : row });
  } catch (e: any) {
    if (String(e?.code) === "P2025") return jerr("Data tidak ditemukan.", 404);
    if (String(e?.code) === "P2002") return jerr("Nama/email tersebut sudah digunakan.", 400);
    console.error(e);
    return jerr("Gagal menyimpan perubahan.", 500);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { resource: string; id: string } }) {
  const s = getSession();
  if (!s) return jerr("Sesi berakhir.", 401);
  if (!sameOrigin(req)) return jerr("Origin tidak diizinkan (proteksi CSRF).", 403);
  const { resource: res, id } = params, cfg = RES[res];
  if (!cfg) return jerr("Koleksi tidak dikenal.", 404);
  if (!can(s.role, res)) return jerr("Peran Anda tidak berhak menghapus data ini.", 403);
  if (res === "users" && id === s.id) return jerr("Tidak dapat menghapus akun sendiri.", 400);
  try {
    const row = await (prisma as any)[cfg.model].delete({ where: { id } });
    await prisma.auditLog.create({ data: { actor: s.name, action: `Hapus ${res}`, detail: cfg.label(row) } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    if (String(e?.code) === "P2003")
      return jerr("Data ini masih terhubung dengan data lain (mis. batch/pendaftar). Nonaktifkan atau hapus data terkait lebih dulu.", 400);
    console.error(e);
    return jerr("Gagal menghapus.", 500);
  }
}