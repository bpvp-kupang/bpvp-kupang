import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function GaleriPage() {
  const galeri = await prisma.gallery.findMany({
    orderBy: { date: "desc" },
  });

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold">Galeri</h1>

      <p className="mt-2 text-gray-600">
        Dokumentasi kegiatan dan pelatihan BPVP Kupang.
      </p>

      {galeri.length === 0 ? (
        <div className="mt-8 rounded-xl border p-8 text-center text-gray-500">
          Belum ada dokumentasi galeri.
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galeri.map((item) => (
            <article
              key={item.id}
              className="overflow-hidden rounded-xl border bg-white shadow-sm"
            >
              <div className="aspect-video bg-gray-100">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-blue-700">
                    {item.category}
                  </span>

                  <time
                    dateTime={item.date.toISOString()}
                    className="text-xs text-gray-500"
                  >
                    {item.date.toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </time>
                </div>

                <h2 className="mt-2 text-lg font-semibold">
                  {item.title}
                </h2>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
