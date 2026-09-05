import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const row = await prisma.mediaFile.findUnique({ where: { id: params.id } });
  if (!row) return new NextResponse("Tidak ditemukan", { status: 404 });
  return new NextResponse(new Uint8Array(row.data), {
    headers: { "Content-Type": row.mime, "Cache-Control": "public, max-age=31536000, immutable" },
  });
}