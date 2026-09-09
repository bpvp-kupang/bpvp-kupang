import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

export const runtime = "nodejs";

const MAX_SIZE = 2 * 1024 * 1024; // 2 MB

export async function POST(req: Request) {
  try {
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

    const extMap: Record<string, string> = {
      jpeg: "jpg",
      jpg: "jpg",
      png: "png",
      webp: "webp",
    };

    const ext = extMap[match[1]];
    const buffer = Buffer.from(match[2], "base64");

    if (buffer.length > MAX_SIZE) {
      return NextResponse.json(
        { error: "Ukuran gambar maksimal 2 MB." },
        { status: 400 }
      );
    }

    const uploadDir = path.join(
      process.cwd(),
      "public",
      "program"
    );

    await fs.mkdir(uploadDir, { recursive: true });

    const filename = `program-${Date.now()}-${crypto
      .randomBytes(4)
      .toString("hex")}.${ext}`;

    const filepath = path.join(uploadDir, filename);

    await fs.writeFile(filepath, buffer);

    return NextResponse.json({
      ok: true,
      url: `/program/${filename}`,
    });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);

    return NextResponse.json(
      { error: "Gagal mengunggah gambar." },
      { status: 500 }
    );
  }
}