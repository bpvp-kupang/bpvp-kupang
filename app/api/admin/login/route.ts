import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { sessionCookie } from "@/lib/auth";

const fail = () => NextResponse.json({ error: "Email atau password salah." }, { status: 401 });

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const normalized = String(email ?? "").trim().toLowerCase();
    if (!normalized || !password) return fail();

    const user = await prisma.user.findUnique({ where: { email: normalized } });
    if (!user || user.status !== "aktif") return fail();

    const ok = await bcrypt.compare(String(password), user.passwordHash);
    if (!ok) return fail();

    const response = NextResponse.json({ ok: true });
    response.headers.append("Set-Cookie", sessionCookie({
      id: user.id, name: user.name, email: user.email, role: user.role,
    }));
    await prisma.auditLog.create({
      data: { actor: user.name, action: "Login Admin", detail: "Login berhasil" },
    });
    return response;
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Layanan login belum siap. Pastikan database sudah aktif." }, { status: 500 });
  }
}
