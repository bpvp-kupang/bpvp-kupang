import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(req: Request) {
  const session = getSession();

  if (!session) {
    return NextResponse.json({ error: "Tidak berwenang." }, { status: 401 });
  }

  try {
    const { data: dataURL } = await req.json();

    if (!dataURL) {
      return NextResponse.json(
        { error: "Tidak ada berkas." },
        { status: 400 }
      );
    }

    const base64 = String(dataURL).split(",").pop() || "";
    const buf = Buffer.from(base64, "base64");

    if (buf.length < 100) {
      return NextResponse.json(
        { error: "Berkas tidak valid." },
        { status: 400 }
      );
    }

    if (buf.length > 2 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Ukuran maksimal 2 MB." },
        { status: 400 }
      );
    }

    const jpg = buf[0] === 0xff && buf[1] === 0xd8;

    if (!jpg) {
      return NextResponse.json(
        { error: "Format berkas harus JPG." },
        { status: 400 }
      );
    }

    const file = await prisma.mediaFile.create({
      data: {
        mime: "image/jpeg",
        size: buf.length,
        data: buf,
      },
    });

    return NextResponse.json({
      ok: true,
      id: file.id,
    });
  } catch {
    return NextResponse.json(
      { error: "Gagal memproses berkas." },
      { status: 500 }
    );
  }
}