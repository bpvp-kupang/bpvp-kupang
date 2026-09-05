
export default function LowonganPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold">Lowongan & Magang</h1>
      <p className="mt-2 text-gray-600">
        Informasi lowongan kerja dan kesempatan pemagangan bagi alumni dan
        pencari kerja.
      </p>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="rounded-xl border p-6">
          <h2 className="font-semibold">Lowongan Kerja</h2>
          <p className="mt-2 text-gray-600 text-sm">
            Informasi lowongan kerja dari mitra industri.
          </p>
        </div>

        <div className="rounded-xl border p-6">
          <h2 className="font-semibold">Pemagangan</h2>
          <p className="mt-2 text-gray-600 text-sm">
            Informasi kesempatan pemagangan bagi peserta dan alumni.
          </p>
        </div>

        <div className="rounded-xl border p-6">
          <h2 className="font-semibold">Mitra Industri</h2>
          <p className="mt-2 text-gray-600 text-sm">
            Peluang kerja dan pengembangan karier bersama mitra industri.
          </p>
        </div>
      </div>
    </main>
  );
}
