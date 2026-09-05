
export default function FAQPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold">FAQ</h1>
      <p className="mt-2 text-gray-600">
        Pertanyaan yang sering diajukan seputar pelatihan vokasi BPVP Kupang.
      </p>

      <div className="mt-8 space-y-4">
        <div className="rounded-xl border p-5">
          <h2 className="font-semibold">Apakah pelatihan di BPVP Kupang gratis?</h2>
          <p className="mt-2 text-gray-600">
            Informasi biaya dan ketentuan pelatihan dapat dilihat pada program
            pelatihan yang sedang dibuka.
          </p>
        </div>

        <div className="rounded-xl border p-5">
          <h2 className="font-semibold">Bagaimana cara mendaftar pelatihan?</h2>
          <p className="mt-2 text-gray-600">
            Pendaftaran dilakukan melalui halaman pendaftaran pada website.
          </p>
        </div>

        <div className="rounded-xl border p-5">
          <h2 className="font-semibold">Siapa yang dapat mengikuti pelatihan?</h2>
          <p className="mt-2 text-gray-600">
            Persyaratan peserta mengikuti ketentuan masing-masing program
            pelatihan.
          </p>
        </div>
      </div>
    </main>
  );
}
