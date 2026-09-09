import {
  Mail,
  MapPin,
  Phone,
  Clock3,
  MessageCircle,
} from "lucide-react";

const kontak = [
  {
    icon: MapPin,
    title: "Alamat",
    text: "Jl. Thamrin No. 03, Kelurahan Kayu Putih, Kecamatan Oebobo, Kota Kupang, Nusa Tenggara Timur, Indonesia",
  },
  {
    icon: Phone,
    title: "Telepon",
    text: "Hubungi layanan BPVP Kupang melalui kanal resmi.",
  },
  {
    icon: Mail,
    title: "Email",
    text: "bpvpkupang@gmail.com",
    href: "mailto:bpvpkupang@gmail.com",
  },
  {
    icon: Clock3,
    title: "Jam Pelayanan",
    text: "Senin–Kamis: 08.00–16.00\nJumat: 08.00–16.30\nSabtu: 08.00–12.00",
  },
];

const GOOGLE_MAPS_URL =
  "https://maps.app.goo.gl/B2KwAfu8tBSZL2NbA";

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
            program pelatihan, layanan, dan informasi lainnya.
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

                  {item.href ? (
                    <a
                      href={item.href}
                      className="mt-3 block text-sm font-semibold leading-7 text-blue hover:underline"
                    >
                      {item.text}
                    </a>
                  ) : (
                    <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">
                      {item.text}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Lokasi Google Maps */}
      <section className="bg-sky2 py-16">
        <div className="container mx-auto px-5 md:px-8">
          <a
            href={GOOGLE_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group block overflow-hidden rounded-3xl bg-navy p-8 text-center text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl md:p-14"
          >
            <MapPin
              className="mx-auto text-orange transition-transform duration-300 group-hover:scale-110"
              size={45}
            />

            <h2 className="mt-5 font-display text-3xl font-extrabold">
              Satpel BPVP Kupang
            </h2>

            <p className="mx-auto mt-3 max-w-xl leading-7 text-slate-200">
              Jl. Thamrin No. 03, Kelurahan Kayu Putih,
              Kecamatan Oebobo, Kota Kupang,
              Nusa Tenggara Timur, Indonesia
            </p>

            <div className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange px-5 py-3 font-bold text-white transition-colors group-hover:bg-orange/90">
              <MapPin size={18} />
              Buka Lokasi di Google Maps
            </div>
          </a>
        </div>
      </section>
    </div>
  );
}