
export default function GaleriPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold">Galeri</h1>
      <p className="mt-2 text-gray-600">
        Dokumentasi kegiatan dan pelatihan BPVP Kupang.
      </p>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="rounded-xl border p-6">
          <h2 className="font-semibold">Kegiatan Pelatihan</h2>
          <p className="mt-2 text-gray-600 text-sm">
            Dokumentasi kegiatan pelatihan vokasi.
          </p>
        </div>

        <div className="rounded-xl border p-6">
          <h2 className="font-semibold">Seleksi Peserta</h2>
          <p className="mt-2 text-gray-600 text-sm">
            Dokumentasi proses seleksi peserta pelatihan.
          </p>
        </div>

        <div className="rounded-xl border p-6">
          <h2 className="font-semibold">Kegiatan Balai</h2>
          <p className="mt-2 text-gray-600 text-sm">
            Dokumentasi kegiatan BPVP Kupang.
          </p>
        </div>
      </div>
    </main>
  );
}