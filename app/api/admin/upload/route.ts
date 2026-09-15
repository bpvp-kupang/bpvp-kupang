import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import crypto from "crypto";
import { getSession } from "@/lib/auth";
import { can } from "@/lib/perms";

export const runtime = "nodejs";

const MAX_SIZE = 2 * 1024 * 1024;

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: "Sesi berakhir, silakan masuk kembali." },
        { status: 401 }
      );
    }

    if (!can(session.role, "upload")) {
      return NextResponse.json(
        { error: "Anda tidak memiliki izin mengunggah gambar." },
        { status: 403 }
      );
    }

    const origin = req.headers.get("origin");

    if (origin) {
      try {
        const originHost = new URL(origin).host;
        const requestHost = req.headers.get("host");

        if (!requestHost || originHost !== requestHost) {
          return NextResponse.json(
            { error: "Origin tidak diizinkan." },
            { status: 403 }
          );
        }
      } catch {
        return NextResponse.json(
          { error: "Origin tidak valid." },
          { status: 403 }
        );
      }
    }

    const body = await req.json();

    if (!body?.data || typeof body.data !== "string") {
      return NextResponse.json(
        { error: "File gambar tidak ditemukan." },
        { status: 400 }
      );
    }

    const match = body.data.match(
      /^data:image\/(jpeg|jpg|png|webp);base64,(.+)$/
    );

    if (!match) {
      return NextResponse.json(
        {
          error:
            "Format gambar tidak valid. Gunakan JPG, JPEG, PNG, atau WEBP.",
        },
        { status: 400 }
      );
    }

    const mimeMap: Record<string, string> = {
      jpeg: "image/jpeg",
      jpg: "image/jpeg",
      png: "image/png",
      webp: "image/webp",
    };

    const extMap: Record<string, string> = {
      jpeg: "jpg",
      jpg: "jpg",
      png: "png",
      webp: "webp",
    };

    const format = match[1];
    const mime = mimeMap[format];
    const ext = extMap[format];

    if (!mime || !ext) {
      return NextResponse.json(
        { error: "Format gambar tidak didukung." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(match[2], "base64");

    if (!buffer.length) {
      return NextResponse.json(
        { error: "File gambar kosong." },
        { status: 400 }
      );
    }

    if (buffer.length > MAX_SIZE) {
      return NextResponse.json(
        { error: "Ukuran gambar maksimal 2 MB." },
        { status: 400 }
      );
    }

    const filename = `program/program-${Date.now()}-${crypto
      .randomBytes(8)
      .toString("hex")}.${ext}`;

    const blob = await put(
      filename,
      new Blob([buffer], { type: mime }),
      {
        access: "public",
        addRandomSuffix: false,
        contentType: mime,
      }
    );

    return NextResponse.json({
      ok: true,
      url: blob.url,
    });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);

    return NextResponse.json(
      {
        error:
          "Gagal mengunggah gambar. Pastikan Vercel Blob sudah terhubung.",
      },
      { status: 500 }
    );
  }
}
