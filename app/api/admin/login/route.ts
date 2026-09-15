import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { sessionCookie } from "@/lib/auth";
import { limited } from "@/lib/rate-limit";

const fail = () =>
  NextResponse.json(
    { error: "Email atau password salah." },
    { status: 401 }
  );

const getClientIp = (req: NextRequest) => {
  const forwarded = req.headers.get("x-forwarded-for");

  if (forwarded) {
    return forwarded.split(",")[0].trim().slice(0, 100);
  }

  return req.headers.get("x-real-ip")?.trim().slice(0, 100) || "unknown";
};

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);

  if (limited(`login:ip:${ip}`, 5, 15 * 60 * 1000)) {
    return NextResponse.json(
      {
        error:
          "Terlalu banyak percobaan login. Silakan coba lagi beberapa menit kemudian.",
      },
      { status: 429 }
    );
  }

  try {
    const { email, password } = await req.json();

    const normalized = String(email ?? "")
      .trim()
      .toLowerCase()
      .slice(0, 150);

    if (!normalized || !password) {
      return fail();
    }

    if (limited(`login:email:${normalized}`, 10, 15 * 60 * 1000)) {
      return NextResponse.json(
        {
          error:
            "Terlalu banyak percobaan login. Silakan coba lagi beberapa menit kemudian.",
        },
        { status: 429 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: normalized },
    });

    if (!user || user.status !== "aktif") {
      return fail();
    }

    const ok = await bcrypt.compare(
      String(password),
      user.passwordHash
    );

    if (!ok) {
      return fail();
    }

    const response = NextResponse.json({ ok: true });

    response.headers.append(
      "Set-Cookie",
      sessionCookie({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      })
    );

    await prisma.auditLog.create({
      data: {
        actor: user.name,
        action: "Login Admin",
        detail: "Login berhasil",
        ip,
      },
    });

    return response;
  } catch (e) {
    console.error(e);

    return NextResponse.json(
      {
        error:
          "Layanan login belum siap. Pastikan database sudah aktif.",
      },
      { status: 500 }
    );
  }
}
