"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Search, X, GraduationCap, Newspaper, Briefcase } from "lucide-react";

type Res = { programs: any[]; news: any[]; jobs: any[] };

export default function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const [res, setRes] = useState<Res | null>(null);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(async () => {
      if (q.trim().length < 2) { setRes(null); return; }
      try { const r = await fetch(`/api/search?q=${encodeURIComponent(q)}`); setRes(r.ok ? await r.json() : null); }
      catch { setRes(null); }
    }, 250);
    return () => clearTimeout(t);
  }, [q, open]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  if (!open) return null;
  const G = ({ t, icon: I, items }: any) => !items?.length ? null : (
    <div>
      <p className="px-5 pt-3 pb-1 text-[11px] font-bold uppercase tracking-widest text-mut">{t}</p>
      {items.map((x: any, i: number) => (
        <Link key={i} href={x.href} onClick={onClose} className="flex items-center gap-3 px-5 py-2.5 hover:bg-sky2">
          <I size={16} className="text-blue shrink-0" />
          <span className="text-sm font-semibold">{x.label}</span>
          <span className="text-[12px] text-mut">{x.sub}</span>
        </Link>
      ))}
    </div>
  );

  const items = res ? {
    program: res.programs.map((p: any) => ({ href: `/program/${p.id}`, label: p.name, sub: `${p.field} · ${p.duration}` })),
    news: res.news.map((n: any) => ({ href: `/berita/${n.slug}`, label: n.title, sub: n.category })),
    job: res.jobs.map((j: any) => ({ href: "/lowongan", label: j.position, sub: `${j.company} · ${j.location}` })),
  } : null;

  return (
    <div className="fixed inset-0 z-[110] bg-navy/60 backdrop-blur-sm flex justify-center pt-20 px-4" onClick={onClose} role="dialog" aria-label="Pencarian situs">
      <div className="bg-white rounded-2xl w-full max-w-2xl h-fit overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 px-5 py-4 border-b border-line">
          <Search size={20} className="text-orange" />
          <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Apa yang ingin Anda cari? (program, berita, lowongan…)" aria-label="Kata kunci" className="flex-1 text-lg font-semibold outline-none" />
          <button onClick={onClose} aria-label="Tutup" className="w-9 h-9 grid place-items-center rounded-lg border border-line"><X size={16} /></button>
        </div>
        <div className="max-h-[56vh] overflow-auto pb-3">
          {items && (
            <>
              <G t="Program" icon={GraduationCap} items={items.program} />
              <G t="Berita" icon={Newspaper} items={items.news} />
              <G t="Lowongan" icon={Briefcase} items={items.job} />
            </>
          )}
          {!items && <p className="px-5 py-4 text-mut text-sm">Coba: “barista”, “sertifikat”, “las”, “lowongan”… Tekan <b>Esc</b> untuk menutup.</p>}
          {items && !res?.programs?.length && !res?.news?.length && !res?.jobs?.length && (
            <p className="px-5 py-4 text-mut text-sm">Tidak ditemukan hasil. Coba kata kunci lain, atau tanya <b>Asisten BPVP</b> di pojok kanan bawah.</p>
          )}
        </div>
      </div>
    </div>
  );
}