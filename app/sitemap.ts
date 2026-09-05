
// app/sitemap.ts
import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { SITE } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [programs, news] = await Promise.all([
    prisma.trainingProgram.findMany({
      where: { status: "aktif" },
      select: { id: true },
    }),
    prisma.news.findMany({
      where: { status: "publish" },
      select: { slug: true },
    }),
  ]);

  const statik = [
    "",
    "/profil",
    "/program",
    "/jadwal",
    "/pendaftaran",
    "/cek-status",
    "/rekomendasi",
    "/alumni",
    "/dunia-kerja",
    "/lowongan",
    "/mitra",
    "/instruktur",
    "/berita",
    "/galeri",
    "/faq",
    "/kontak",
  ];

  return [
    ...statik.map((s) => ({
      url: `${SITE}${s || "/"}`,
      priority: s === "" ? 1 : 0.8,
    })),
    ...programs.map((p) => ({
      url: `${SITE}/program/${p.id}`,
    })),
    ...news.map((n) => ({
      url: `${SITE}/berita/${n.slug}`,
    })),
  ];
}
