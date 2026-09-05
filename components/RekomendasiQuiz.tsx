// components/RekomendasiQuiz.tsx
"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Compass, Sparkles } from "lucide-react";

type P = { id: string; name: string; field: string; description: string; duration: string; minEducation: string; jobProspects: string[]; businessProspects: string[] };

const EDU_RANK: Record<string, number> = { SD: 1, SMP: 2, "SMA/SMK": 3, "D1–D3": 4, S1: 5, "S2+": 6 };
const FIELDS = ["Digital & Perkantoran", "Pariwisata & Hospitality", "Fashion", "Otomotif", "Teknik"];

const QS: { k: string; l: string; opts: string[] }[] = [
  { k: "bidang", l: "Bidang yang saya sukai", opts: FIELDS },
  { k: "pendidikan", l: "Pendidikan terakhir saya", opts: ["SD", "SMP", "SMA/SMK", "D1–D3", "S1", "S2+"] },
  { k: "tujuan", l: "Tujuan saya mengikuti pelatihan", opts: ["Mencari pekerjaan", "Membuka usaha", "Meningkatkan keterampilan"] },
  { k: "pengalaman", l: "Pengalaman saya di bidang ini", opts: ["Pemula", "Sedikit pengalaman", "Berpengalaman"] },
];

export default function RekomendasiQuiz({ programs }: { programs: P[] }) {
  const [step, setStep] = useState(0);
  const [ans, setAns] = useState<Record<string, number>>({});
  const done = step >= QS.length;

  const results = useMemo(() => {
    if (!done) return [];
    const jp = (d: string) => parseInt(d) || 300;
    return programs
      .filter((p) => (EDU_RANK[QS[1].opts[ans.pendidikan]] ?? 3) >= (EDU_RANK[p.minEducation] ?? 3))
      .map((p) => {
        let s = 30;
        if (p.field === QS[0].opts[ans.bidang]) s += 34;
        if (ans.tujuan === 0 && p.jobProspects.length >= 3) s += 10;
        if (ans.tujuan === 1 && p.businessProspects.length >= 3) s += 10;
        if (ans.tujuan === 2) s += 6;
        if (ans.pengalaman === 0 && jp(p.duration) <= 300) s += 8;
        if (ans.pengalaman === 2 && jp(p.duration) > 300) s += 8;
        return { p, score: Math.min(98, s) };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);
  }, [done, ans, programs]);

  if (done) {
    return (
      <div>
        <h2 className="text-2xl text-center mb-1.5">Rekomendasi Pelatihan Untuk Anda</h2>
        <p className="text-mut text-center text-sm mb-8">Berdasarkan minat <b>{QS[0].opts[ans.bidang]?.toLowerCase()}</b>, pendidikan {QS[1].opts[ans.pendidikan]}, dan tujuan Anda.</p>
        {results.length ? results.map(({ p, score }) => (
          <Link key={p.id} href={`/program/${p.id}`} className="card flex gap-4 items-center p-4.5 mb-3.5 hover:border-blue2">
            <div className={`w-14 h-14 rounded-full border-[5px] grid place-items-center font-display font-extrabold text-[15px] shrink-0 ${score >= 85 ? "border-ok text-ok" : "border-sky text-navy"}`}>{score}%</div>
            <div className="flex-1">
              <span className="text-blue font-bold text-[11.5px]">{p.field} · {p.duration}</span>
              <h3 className="text-[19px]">{p.name}</h3>
              <p className="text-mut text-[13px] line-clamp-1">{p.description}</p>
            </div>
            <ArrowRight size={18} className="text-mut" />
          </Link>
        )) : <p className="text-mut">Tidak ada program yang sesuai kriteria Anda — coba ubah jawaban pendidikan.</p>}
        <button onClick={() => { setStep(0); setAns({}); }} className="btn-out mt-4">Ulangi pencarian</button>
      </div>
    );
  }

  const q = QS[step];
  return (
    <div className="card p-8">
      <div className="flex gap-2 mb-6">{QS.map((_, i) => <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-orange" : "bg-line"}`} />)}</div>
      <h2 className="text-xl mb-5">{q.l}</h2>
      <div className="grid sm:grid-cols-2 gap-3">
        {q.opts.map((o, i) => (
          <button key={o} onClick={() => { setAns({ ...ans, [q.k]: i }); setStep(step + 1); }}
            className="border-[1.5px] border-line rounded-xl px-4.5 py-4 font-bold text-[15px] text-left hover:border-orange hover:bg-[#FFF6F0] transition">
            {o}
          </button>
        ))}
      </div>
      {step > 0 && <button onClick={() => setStep(step - 1)} className="btn-out btn-sm mt-5">Kembali</button>}
      <p className="flex gap-2 items-center text-[12.5px] text-mut mt-5"><Compass size={15} className="text-orange" />Rekomendasi hanya saran — keputusan akhir tetap pertimbangan Anda.</p>
    </div>
  );
}