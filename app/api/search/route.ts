import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("q") || "").trim();
  if (q.length < 2) return NextResponse.json({ programs: [], news: [], alumni: [], jobs: [], faq: [] });
  const c = { contains: q, mode: "insensitive" as const };
  const [programs, news, alumni, jobs, faq] = await Promise.all([
    prisma.trainingProgram.findMany({ where: { status: "aktif", OR: [{ name: c }, { description: c }, { field: c }] }, select: { id: true, name: true, field: true, duration: true }, take: 5 }),
    prisma.news.findMany({ where: { status: "publish", OR: [{ title: c }, { category: c }] }, select: { slug: true, title: true, category: true }, take: 4 }),
    prisma.alumni.findMany({ where: { published: true, OR: [{ name: c }, { story: c }] }, select: { name: true, job: true, business: true }, take: 3 }),
    prisma.jobOpportunity.findMany({ where: { status: "aktif", OR: [{ position: c }, { company: c }, { location: c }] }, select: { position: true, company: true, location: true }, take: 3 }),
    prisma.fAQ.findMany({ where: { status: "aktif", OR: [{ question: c }, { answer: c }] }, select: { question: true, category: true }, take: 3 }),
  ]);
  return NextResponse.json({ programs, news, alumni, jobs, faq });
}
