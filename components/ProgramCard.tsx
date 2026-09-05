import Link from "next/link";
import { Clock3, Users } from "lucide-react";
import FieldChip from "./FieldChip";
import { batchStatus, ST, BatchLike } from "@/lib/batch";

type P = { id: string; name: string; field: string; description: string; duration: string; quota: number; image?: string | null };

export default function ProgramCard({ p, batch, wide = false }: { p: P; batch?: (BatchLike & { quota: number }) | null; wide?: boolean }) {
  const st = batch ? batchStatus(batch) : null;
  return (
    <Link href={`/program/${p.id}`} className={`card overflow-hidden flex flex-col hover:-translate-y-1 hover:shadow-xl transition ${wide ? "sm:col-span-2" : ""}`}>
      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={p.image || `https://picsum.photos/seed/bpvp-${p.id}/900/600`} alt={`Pelatihan ${p.name}`} loading="lazy" className={`w-full object-cover ${wide ? "h-[230px]" : "h-[190px]"}`} />
        <div className="absolute top-3 left-3"><FieldChip field={p.field} /></div>
        {st && <div className="absolute top-3 right-3"><span className={`badge ${ST[st].cls}`}>{ST[st].label}</span></div>}
      </div>
      <div className="p-4.5 flex flex-col gap-2 flex-1">
        <h3 className="text-xl">{p.name}</h3>
        <p className="text-mut text-[13.5px] line-clamp-2">{p.description}</p>
        <div className="mt-auto flex gap-4 text-mut text-[12.5px] font-semibold">
          <span className="inline-flex items-center gap-1.5"><Clock3 size={14} className="text-blue" />{p.duration}</span>
          <span className="inline-flex items-center gap-1.5"><Users size={14} className="text-blue" />Kuota {batch?.quota ?? p.quota}</span>
        </div>
      </div>
    </Link>
  );
}