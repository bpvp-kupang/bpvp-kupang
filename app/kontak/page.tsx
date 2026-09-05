
import { Mail, MapPin, Phone, Clock3, MessageCircle } from "lucide-react";

const kontak = [
  {
    icon: MapPin,
    title: "Alamat",
    text: "Kupang, Nusa Tenggara Timur, Indonesia",
  },
  {
    icon: Phone,
    title: "Telepon",
    text: "Hubungi layanan BPVP Kupang melalui kanal resmi.",
  },
  {
    icon: Mail,
    title: "Email",
    text: "Gunakan email resmi BPVP Kupang untuk kebutuhan informasi dan layanan.",
  },
  {
    icon: Clock3,
    title: "Jam Pelayanan",
    text: "Senin–Jumat, mengikuti jam pelayanan kerja.",
  },
];

export default function KontakPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-navy text-white">
        <div className="container mx-auto px-5 py-16 md:px-8 md:py-24">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold">
            <MessageCircle size={16} />
            KONTAK BPVP KUPANG
          </span>

          <h1 className="mt-5 max-w-3xl font-display text-4xl font-extrabold md:text-5xl">
            Kami Siap Membantu
            <span className="text-orange"> Anda</span>
          </h1>

          <p className="mt-5 max-w-2xl leading-8 text-slate-200">
            Silakan hubungi BPVP Kupang untuk mendapatkan informasi mengenai
            pelatihan, pendaftaran, kerja sama, dan layanan lainnya.
          </p>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="bg-sky2 py-16 md:py-20">
        <div className="container mx-auto px-5 md:px-8">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {kontak.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-3xl border border-line bg-white p-6 shadow-sm"
                >
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-orange text-white">
                    <Icon size={22} />
                  </div>

                  <h2 className="mt-5 font-display text-lg font-extrabold text-navy">
                    {item.title}
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="bg-white py-16 md:py-20">
        <div className="container mx-auto px-5 md:px-8">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <span className="text-sm font-extrabold uppercase tracking-wider text-blue">
                Hubungi Kami
              </span>

              <h2 className="mt-3 font-display text-3xl font-extrabold text-navy md:text-4xl">
                Sampaikan Pertanyaan Anda
              </h2>

              <p className="mt-5 leading-8 text-slate-600">
                Gunakan formulir ini untuk menyampaikan pertanyaan atau
                permintaan informasi. Tim BPVP Kupang dapat menindaklanjuti
                sesuai kebutuhan layanan.
              </p>

              <div className="mt-7 rounded-3xl bg-navy p-7 text-white">
                <MessageCircle className="text-orange" size={34} />

                <h3 className="mt-4 font-display text-xl font-bold">
                  Informasi Pelatihan
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-200">
                  Untuk informasi program dan pendaftaran pelatihan, silakan
                  gunakan menu Program Pelatihan dan Pendaftaran pada website.
                </p>
              </div>
            </div>

            <form className="rounded-3xl border border-line bg-white p-6 shadow-lg md:p-8">
              <div className="grid gap-5">
                <div>
                  <label className="mb-2 block text-sm font-bold text-navy">
                    Nama
                  </label>
                  <input
                    type="text"
                    placeholder="Nama lengkap"
                    className="w-full rounded-xl border border-line px-4 py-3 text-sm outline-none focus:border-blue"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-navy">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="nama@email.com"
                    className="w-full rounded-xl border border-line px-4 py-3 text-sm outline-none focus:border-blue"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-navy">
                    Subjek
                  </label>
                  <input
                    type="text"
                    placeholder="Perihal"
                    className="w-full rounded-xl border border-line px-4 py-3 text-sm outline-none focus:border-blue"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-navy">
                    Pesan
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Tulis pertanyaan atau pesan Anda..."
                    className="w-full resize-none rounded-xl border border-line px-4 py-3 text-sm outline-none focus:border-blue"
                  />
                </div>

                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange px-6 py-3 font-bold text-white transition hover:opacity-90"
                >
                  <Mail size={18} />
                  Kirim Pesan
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="bg-sky2 py-16">
        <div className="container mx-auto px-5 md:px-8">
          <div className="overflow-hidden rounded-3xl bg-navy p-8 text-center text-white md:p-14">
            <MapPin className="mx-auto text-orange" size={45} />

            <h2 className="mt-5 font-display text-3xl font-extrabold">
              BPVP Kupang
            </h2>

            <p className="mx-auto mt-3 max-w-xl leading-7 text-slate-200">
              Kupang, Nusa Tenggara Timur, Indonesia
            </p>

            <p className="mt-5 text-sm text-slate-300">
              Peta lokasi dapat diintegrasikan setelah alamat resmi BPVP
              ditetapkan pada data website.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

