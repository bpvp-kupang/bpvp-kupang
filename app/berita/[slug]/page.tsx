import Link from "next/link";
import { ArrowLeft, CalendarDays, Newspaper } from "lucide-react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function BeritaDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const berita = await prisma.news.findFirst({
    where: {
      slug,
      status: "publish",
    },
  });

  if (!berita) {
    notFound();
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-navy text-white">
        <div className="container mx-auto px-5 py-14 md:px-8 md:py-20">
          <Link
            href="/berita"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-200 hover:text-white"
          >
            <ArrowLeft size={17} />
            Kembali ke Berita
          </Link>

          <div className="mt-8">
            <span className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-extrabold text-orange">
              {berita.category}
            </span>

            <h1 className="mt-5 max-w-4xl font-display text-3xl font-extrabold leading-tight md:text-5xl">
              {berita.title}
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-slate-300">
              <span className="inline-flex items-center gap-2">
                <CalendarDays size={16} />
                {new Date(berita.publishedAt).toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </span>

              <span>•</span>

              <span>{berita.author}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <main className="bg-sky2 py-12 md:py-16">
        <div className="container mx-auto max-w-4xl px-5 md:px-8">
          {berita.image ? (
            <div className="mb-10 overflow-hidden rounded-3xl bg-navy">
              <img
                src={berita.image}
                alt={berita.title}
                className="max-h-[520px] w-full object-cover"
              />
            </div>
          ) : (
            <div className="mb-10 grid h-64 place-items-center rounded-3xl bg-navy">
              <Newspaper className="text-orange" size={72} />
            </div>
          )}

          <article className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-line md:p-10">
            <div className="whitespace-pre-line text-base leading-8 text-slate-700">
              {berita.content}
            </div>
          </article>

          <div className="mt-8">
            <Link
              href="/berita"
              className="inline-flex items-center gap-2 rounded-xl bg-navy px-5 py-3 font-bold text-white hover:opacity-90"
            >
              <ArrowLeft size={18} />
              Semua Berita
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}