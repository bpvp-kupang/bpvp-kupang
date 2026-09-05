
import Link from "next/link";
import { ArrowRight, CalendarDays, Newspaper } from "lucide-react";

const berita = [
  {
    title: "Pelatihan Vokasi untuk Meningkatkan Kompetensi Tenaga Kerja NTT",
    category: "Pelatihan",
    date: "Informasi BPVP Kupang",
    text: "Informasi terbaru mengenai kegiatan pelatihan vokasi dan pengembangan kompetensi masyarakat.",
  },
  {
    title: "Membangun SDM Kompeten, Produktif dan Siap Kerja",
    category: "Kegiatan",
    date: "Kegiatan BPVP Kupang",
    text: "Berbagai kegiatan BPVP Kupang dalam mendukung peningkatan kualitas sumber daya manusia.",
  },
  {
    title: "Kolaborasi dengan Dunia Kerja untuk Penguatan Pelatihan",
    category: "Kemitraan",
    date: "Informasi Kemitraan",
    text: "Kerja sama dengan dunia usaha dan dunia industri menjadi bagian penting dalam pengembangan pelatihan.",
  },
];

export default function BeritaPage() {
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
          <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <span className="text-sm font-extrabold uppercase tracking-wider text-blue">
                Update
              </span>

              <h2 className="mt-2 font-display text-3xl font-extrabold text-navy">
                Berita & Kegiatan
              </h2>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {berita.map((item, index) => (
              <article
                key={index}
                className="overflow-hidden rounded-3xl border border-line bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="grid h-52 place-items-center bg-navy">
                  <Newspaper className="text-orange" size={55} />
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
                    {item.date}
                  </div>

                  <p className="mt-4 text-sm leading-7 text-slate-600">
                    {item.text}
                  </p>

                  <button
                    type="button"
                    className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-blue hover:text-navy"
                  >
                    Baca selengkapnya
                    <ArrowRight size={16} />
                  </button>
                </div>
              </article>
            ))}
          </div>
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
              Dapatkan informasi mengenai pelatihan, kegiatan, peluang kerja,
              dan berbagai layanan BPVP Kupang.
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

