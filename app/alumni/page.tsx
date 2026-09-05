
import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, GraduationCap, Quote } from "lucide-react";

const alumni = [
  {
    name: "Alumni Pelatihan Vokasi",
    program: "Pengelola Administrasi Perkantoran",
    status: "Bekerja",
    story:
      "Pelatihan membantu meningkatkan keterampilan administrasi, komunikasi, dan kesiapan menghadapi dunia kerja.",
  },
  {
    name: "Alumni Pelatihan Vokasi",
    program: "Peracikan Minuman Kopi",
    status: "Berwirausaha",
    story:
      "Kompetensi yang diperoleh menjadi bekal untuk mengembangkan usaha dan memberikan pelayanan yang lebih profesional.",
  },
  {
    name: "Alumni Pelatihan Vokasi",
    program: "Menjahit Pakaian",
    status: "Berwirausaha",
    story:
      "Keterampilan menjahit menjadi modal untuk menghasilkan produk dan membuka peluang usaha mandiri.",
  },
];

export default function AlumniPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-navy text-white">
        <div className="container mx-auto px-5 py-16 md:px-8 md:py-24">
          <div className="max-w-3xl">
            <span className="inline-block rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold">
              ALUMNI BPVP KUPANG
            </span>

            <h1 className="mt-5 font-display text-4xl font-extrabold md:text-5xl">
              Dari Pelatihan Menuju
              <span className="text-orange"> Masa Depan</span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-200 md:text-lg">
              Cerita dan perjalanan alumni BPVP Kupang setelah mengikuti
              pelatihan vokasi dan meningkatkan kompetensinya.
            </p>
          </div>
        </div>
      </section>

      {/* Statistik */}
      <section className="-mt-8">
        <div className="container mx-auto grid gap-4 px-5 sm:grid-cols-3 md:px-8">
          <div className="rounded-2xl bg-white p-6 text-center shadow-xl">
            <GraduationCap className="mx-auto text-blue" size={30} />
            <div className="mt-3 font-display text-3xl font-extrabold text-navy">
              Alumni
            </div>
            <p className="mt-1 text-sm text-slate-500">Lulusan pelatihan vokasi</p>
          </div>

          <div className="rounded-2xl bg-white p-6 text-center shadow-xl">
            <BriefcaseBusiness className="mx-auto text-orange" size={30} />
            <div className="mt-3 font-display text-3xl font-extrabold text-navy">
              Kerja
            </div>
            <p className="mt-1 text-sm text-slate-500">Siap memasuki dunia kerja</p>
          </div>

          <div className="rounded-2xl bg-white p-6 text-center shadow-xl">
            <ArrowRight className="mx-auto text-blue" size={30} />
            <div className="mt-3 font-display text-3xl font-extrabold text-navy">
              Usaha
            </div>
            <p className="mt-1 text-sm text-slate-500">Mendorong kewirausahaan</p>
          </div>
        </div>
      </section>

      {/* Alumni */}
      <section className="bg-sky2 py-16 md:py-20">
        <div className="container mx-auto px-5 md:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-extrabold uppercase tracking-wider text-blue">
              Cerita Alumni
            </span>

            <h2 className="mt-3 font-display text-3xl font-extrabold text-navy">
              Perjalanan Setelah Pelatihan
            </h2>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {alumni.map((item, index) => (
              <article
                key={index}
                className="rounded-3xl border border-line bg-white p-7 shadow-sm"
              >
                <Quote className="text-orange" size={30} />

                <p className="mt-5 leading-7 text-slate-600">
                  “{item.story}”
                </p>

                <div className="mt-7 border-t border-line pt-5">
                  <h3 className="font-display font-extrabold text-navy">
                    {item.name}
                  </h3>

                  <p className="mt-1 text-sm font-semibold text-blue">
                    {item.program}
                  </p>

                  <span className="mt-3 inline-block rounded-full bg-sky2 px-3 py-1 text-xs font-bold text-navy">
                    {item.status}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-5 md:px-8">
          <div className="rounded-3xl bg-navy p-8 text-center text-white md:p-12">
            <h2 className="font-display text-3xl font-extrabold">
              Ingin menjadi bagian dari alumni BPVP Kupang?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-200">
              Temukan program pelatihan yang sesuai dan tingkatkan kompetensi
              Anda untuk menghadapi dunia kerja.
            </p>

            <Link
              href="/program"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-orange px-6 py-3 font-bold text-white transition hover:opacity-90"
            >
              Lihat Program Pelatihan
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

