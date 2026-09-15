import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { RES } from "@/lib/resources";
import { can, canRead } from "@/lib/perms";

const jerr = (msg: string, code: number) =>
  NextResponse.json({ error: msg }, { status: code });

const sameOrigin = (req: NextRequest) => {
  const o = req.headers.get("origin");

  if (!o) return true;

  try {
    return new URL(o).host === req.headers.get("host");
  } catch {
    return false;
  }
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ resource: string }> }
) {
  const { resource } = await params;

  const s = await getSession();

  if (!s) {
    return jerr("Sesi berakhir, silakan masuk kembali.", 401);
  }

  const cfg = RES[resource];

  if (!cfg) {
    return jerr("Koleksi tidak dikenal.", 404);
  }

  if (!canRead(s.role, resource)) {
    return jerr(
      "Peran Anda tidak berhak membaca data ini.",
      403
    );
  }

  try {
    const rows = await (prisma as any)[cfg.model].findMany({
      where: cfg.where,
      include: cfg.include,
      orderBy: cfg.order,
    });

    return NextResponse.json({
      rows: rows.map((r: any) =>
        cfg.strip ? cfg.strip(r) : r
      ),
    });
  } catch (e) {
    console.error(e);

    return jerr("Gagal mengambil data.", 500);
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ resource: string }> }
) {
  const { resource: res } = await params;

  const s = await getSession();

  if (!s) {
    return jerr("Sesi berakhir.", 401);
  }

  if (!sameOrigin(req)) {
    return jerr(
      "Origin tidak diizinkan (proteksi CSRF).",
      403
    );
  }

  const cfg = RES[res];

  if (!cfg) {
    return jerr("Koleksi tidak dikenal.", 404);
  }

  if (!can(s.role, res)) {
    return jerr(
      "Peran Anda tidak berhak mengubah data ini.",
      403
    );
  }

  try {
    const body = await req.json();

    const picked: Record<string, unknown> = {};

    for (const k of cfg.allow) {
      if (body[k] !== undefined) {
        picked[k] = body[k];
      }
    }

    if (!Object.keys(picked).length) {
      return jerr("Tidak ada data yang dikirim.", 400);
    }

    const data =
      (await cfg.before?.(picked, true)) ?? picked;

    const row = await (prisma as any)[cfg.model].create({
      data,
    });

    await prisma.auditLog.create({
      data: {
        actor: s.name,
        action: `Tambah ${res}`,
        detail: cfg.label(row),
      },
    });

    return NextResponse.json({
      ok: true,
      row: cfg.strip ? cfg.strip(row) : row,
    });
  } catch (e: any) {
    if (String(e?.code) === "P2002") {
      return jerr(
        "Data dengan nama/email tersebut sudah ada.",
        400
      );
    }

    console.error(e);

    return jerr("Gagal menyimpan data.", 500);
  }
}
