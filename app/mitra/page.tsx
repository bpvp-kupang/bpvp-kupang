
export default function MitraPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold">Mitra Industri</h1>
      <p className="mt-2 text-gray-600">
        Informasi mitra industri dan dunia kerja yang bekerja sama dengan
        BPVP Kupang.
      </p>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="rounded-xl border p-6">
          <h2 className="font-semibold">Mitra Industri</h2>
          <p className="mt-2 text-gray-600 text-sm">
            Daftar perusahaan dan industri mitra BPVP Kupang.
          </p>
        </div>

        <div className="rounded-xl border p-6">
          <h2 className="font-semibold">Kerja Sama</h2>
          <p className="mt-2 text-gray-600 text-sm">
            Informasi bentuk kerja sama dalam pengembangan kompetensi tenaga
            kerja.
          </p>
        </div>

        <div className="rounded-xl border p-6">
          <h2 className="font-semibold">Peluang Kerja</h2>
          <p className="mt-2 text-gray-600 text-sm">
            Hubungan antara pelatihan vokasi dan kebutuhan dunia kerja.
          </p>
        </div>
      </div>
    </main>
  );
}
