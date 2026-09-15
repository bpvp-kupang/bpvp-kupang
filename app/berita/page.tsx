import Link from "next/link";
import { ArrowRight, CalendarDays, Newspaper } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function BeritaPage() {
  const berita = await prisma.news.findMany({
    where: {
      status: "publish",
    },
    orderBy: {
      publishedAt: "desc",
    },
  });

  return (
    <div>
      {/* Hero */}
      <section className="bg-navy text-white">
        <div className="container mx-auto px-5 py-16 md:px-8 md:py-24">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold">
            <Newspaper size={16} />
            BERITA & KEGIATAN
          </span>

          <h1 className="mt-5 max-w-3xl font-display text-4xl font-extrabold md:text-5xl">
            Informasi Terbaru
            <span className="text-orange"> BPVP Kupang</span>
          </h1>

          <p className="mt-5 max-w-2xl leading-8 text-slate-200">
            Ikuti berita, kegiatan, program, dan informasi terbaru seputar
            pelayanan pelatihan vokasi dan produktivitas.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="bg-sky2 py-16 md:py-20">
        <div className="container mx-auto px-5 md:px-8">
          <div className="mb-10">
            <span className="text-sm font-extrabold uppercase tracking-wider text-blue">
              Update
            </span>

            <h2 className="mt-2 font-display text-3xl font-extrabold text-navy">
              Berita & Kegiatan
            </h2>
          </div>

          {berita.length === 0 ? (
            <div className="rounded-3xl border border-line bg-white p-10 text-center">
              <Newspaper className="mx-auto text-slate-400" size={50} />

              <h3 className="mt-4 font-display text-xl font-extrabold text-navy">
                Belum ada berita
              </h3>

              <p className="mt-2 text-sm text-slate-600">
                Informasi terbaru BPVP Kupang akan ditampilkan di halaman ini.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-3">
              {berita.map((item) => (
                <article
                  key={item.id}
                  className="overflow-hidden rounded-3xl border border-line bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="grid h-52 place-items-center bg-navy">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Newspaper className="text-orange" size={55} />
                    )}
                  </div>

                  <div className="p-6">
                    <span className="rounded-full bg-sky2 px-3 py-1 text-xs font-extrabold text-blue">
                      {item.category}
                    </span>

                    <h3 className="mt-4 font-display text-xl font-extrabold leading-snug text-navy">
                      {item.title}
                    </h3>

                    <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-slate-500">
                      <CalendarDays size={15} />
                      {new Date(item.publishedAt).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </div>

                    <p className="mt-4 text-sm leading-7 text-slate-600">
                      {item.content.length > 180
                        ? `${item.content.substring(0, 180)}...`
                        : item.content}
                    </p>

                    <Link
                      href={`/berita/${item.slug}`}
                      className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-blue hover:text-navy"
                    >
                      Baca selengkapnya
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-5 md:px-8">
          <div className="rounded-3xl bg-white p-8 text-center shadow-lg ring-1 ring-line md:p-12">
            <h2 className="font-display text-3xl font-extrabold text-navy">
              Tetap ikuti informasi BPVP Kupang
            </h2>

            <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-600">
              Dapatkan informasi mengenai pelatihan, kegiatan, dan berbagai
              layanan BPVP Kupang.
            </p>

            <Link
              href="/kontak"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-navy px-6 py-3 font-bold text-white"
            >
              Hubungi Kami
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}