import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const metadata = { title: "Instruktur", description: "Instruktur pelatihan BPVP Kupang — praktisi industri berpengalaman." };

export default async function InstrukturPage() {
  const list = await prisma.instructor.findMany({ where: { status: "aktif" } });
  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <p className="text-orange text-[12px] font-bold uppercase tracking-[.14em] mb-3.5">Instruktur</p>
      <h1 className="text-[clamp(28px,4vw,40px)] mb-3">Dilatih oleh praktisi, bukan sekadar pengajar.</h1>
      <p className="text-mut mb-9">{list.length} instruktur aktif dengan pengalaman industri riil.</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {list.map((i) => (
          <div key={i.id} className="card overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={i.image || `https://picsum.photos/seed/inst-${i.id}/400/420`} alt={`Foto ${i.name}`} loading="lazy" className="w-full h-[230px] object-cover" />
            <div className="p-4">
              <span className="text-blue font-bold text-[12px]">{i.field}</span>
              <h3 className="text-[17px] mt-1">{i.name}</h3>
              <p className="text-mut text-[12.5px] mt-1.5 line-clamp-3">{i.bio}</p>
              <p className="text-orange font-bold text-[12px] mt-2.5">{i.experience}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}