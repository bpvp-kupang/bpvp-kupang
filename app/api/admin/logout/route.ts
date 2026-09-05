import { NextResponse } from "next/server";
import { clearCookie, getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const s = getSession();
  if (s) {
    await prisma.auditLog.create({
      data: { actor: s.name, action: "Logout Admin", detail: "Logout" },
    }).catch(() => {});
  }
  const response = NextResponse.json({ ok: true });
  response.headers.append("Set-Cookie", clearCookie());
  return response;
}
