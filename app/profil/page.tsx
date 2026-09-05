
import { Building2, Target, Eye, Users, Award, BriefcaseBusiness } from "lucide-react";

const layanan = [
  {
    icon: Building2,
    title: "Pelatihan Vokasi",
    text: "Menyelenggarakan pelatihan berbasis kompetensi sesuai kebutuhan dunia kerja dan perkembangan industri.",
  },
  {
    icon: Users,
    title: "Pengembangan SDM",
    text: "Mendorong peningkatan keterampilan, produktivitas, dan daya saing tenaga kerja.",
  },
  {
    icon: Award,
    title: "Sertifikasi Kompetensi",
    text: "Mendukung peserta untuk memiliki kompetensi yang dapat dibuktikan dan diakui.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Kesiapan Kerja",
    text: "Membekali peserta dengan hard skill dan soft skill agar lebih siap memasuki dunia kerja.",
  },
];

export default function ProfilPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy text-white">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-blue/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-orange/20 blur-3xl" />

        <div className="container relative mx-auto px-5 py-20 md:px-8 md:py-28">
          <div className="max-w-3xl">
            <span className="mb-4 inline-block rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold">
              PROFIL BPVP KUPANG
            </span>

            <h1 className="font-display text-4xl font-extrabold leading-tight md:text-6xl">
              Membangun SDM NTT yang
              <span className="text-orange"> Kompeten dan Produktif</span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-200 md:text-lg">
              BPVP Kupang hadir sebagai bagian dari Kementerian Ketenagakerjaan
              Republik Indonesia untuk mendukung peningkatan kompetensi,
              produktivitas, dan daya saing tenaga kerja melalui pelatihan vokasi.
            </p>
          </div>
        </div>
      </section>

      {/* Tentang */}
      <section className="bg-white py-16 md:py-20">
        <div className="container mx-auto px-5 md:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
            <div>
              <span className="text-sm font-extrabold uppercase tracking-wider text-blue">
                Tentang Kami
              </span>

              <h2 className="mt-3 font-display text-3xl font-extrabold text-navy md:text-4xl">
                Balai Pelatihan Vokasi dan Produktivitas Kupang
              </h2>

              <p className="mt-5 leading-8 text-slate-600">
                BPVP Kupang merupakan satuan pelayanan pelatihan vokasi dan
                produktivitas yang memberikan layanan pengembangan kompetensi
                bagi masyarakat.
              </p>

              <p className="mt-4 leading-8 text-slate-600">
                Program pelatihan diarahkan agar peserta memiliki keterampilan
                yang relevan dengan kebutuhan pasar kerja, mampu berwirausaha,
                serta memiliki karakter dan soft skill yang mendukung keberhasilan
                di dunia kerja.
              </p>

              <div className="mt-7 rounded-2xl border border-line bg-sky2 p-5">
                <p className="font-display text-lg font-bold text-navy">
                  “Dari Belajar, Menjadi Kompeten, Siap Kerja dan Berwirausaha.”
                </p>
              </div>
            </div>

            <div className="rounded-3xl bg-sky2 p-7">
              <div className="rounded-2xl bg-navy p-7 text-white shadow-xl">
                <Building2 className="text-orange" size={42} />

                <h3 className="mt-5 font-display text-2xl font-bold">
                  Komitmen Kami
                </h3>

                <p className="mt-4 leading-7 text-slate-200">
                  Memberikan pelayanan pelatihan yang berkualitas, inklusif,
                  relevan dengan kebutuhan dunia kerja, dan berorientasi pada
                  peningkatan produktivitas masyarakat.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visi Misi */}
      <section className="bg-sky2 py-16 md:py-20">
        <div className="container mx-auto px-5 md:px-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl bg-navy p-8 text-white shadow-lg">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-orange">
                <Eye size={25} />
              </div>

              <h2 className="mt-5 font-display text-2xl font-extrabold">
                Visi
              </h2>

              <p className="mt-4 leading-8 text-slate-200">
                Terwujudnya tenaga kerja yang kompeten, produktif, berdaya
                saing, dan mampu beradaptasi dengan kebutuhan dunia kerja.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-lg">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-orange text-white">
                <Target size={25} />
              </div>

              <h2 className="mt-5 font-display text-2xl font-extrabold text-navy">
                Misi
              </h2>

              <ul className="mt-4 space-y-3 text-slate-600">
                <li>• Menyelenggarakan pelatihan berbasis kompetensi.</li>
                <li>• Meningkatkan kualitas dan produktivitas tenaga kerja.</li>
                <li>• Memperkuat hubungan dengan dunia kerja dan industri.</li>
                <li>• Mendorong kemandirian dan kewirausahaan masyarakat.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Layanan */}
      <section className="bg-white py-16 md:py-20">
        <div className="container mx-auto px-5 md:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-extrabold uppercase tracking-wider text-blue">
              Layanan
            </span>
            <h2 className="mt-3 font-display text-3xl font-extrabold text-navy md:text-4xl">
              Fokus Pelayanan BPVP Kupang
            </h2>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {layanan.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-3xl border border-line bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-orange text-white">
                    <Icon size={23} />
                  </div>

                  <h3 className="mt-5 font-display text-lg font-extrabold text-navy">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

