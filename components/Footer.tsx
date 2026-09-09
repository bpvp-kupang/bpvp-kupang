import Link from "next/link";
import { Instagram, Facebook, Youtube, Music2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-navy2 text-[#B8CBE2] mt-20">
      <div className="max-w-6xl mx-auto px-6 grid gap-9 md:grid-cols-4 py-14">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl bg-white/10 grid place-items-center text-orange font-display font-extrabold text-xl">B</div>
            <div><b className="block text-white font-display font-extrabold text-[17px]">BPVP KUPANG</b><span className="text-[11px] text-[#8FB4DE]">www.bpvpkupang.com</span></div>
          </div>
          <p className="text-[13px] max-w-[280px]">Balai Pelatihan Vokasi dan Produktivitas Kupang — pusat informasi dan layanan vokasi untuk masyarakat Nusa Tenggara Timur.</p>
          <div className="flex gap-2.5 mt-4">
            {[[Instagram, "https://instagram.com"], [Facebook, "https://facebook.com"], [Youtube, "https://youtube.com"], [Music2, "https://tiktok.com"]].map(([Icon, href]: any, i) => (
              <a key={i} href={href} target="_blank" rel="noopener" aria-label="Media sosial BPVP Kupang" className="w-[38px] h-[38px] grid place-items-center rounded-lg border border-white/20 text-white hover:bg-orange hover:border-orange"><Icon size={17} /></a>
            ))}
          </div>
        </div>
        <div><h4 className="text-white text-[15px] font-display mb-4">Layanan</h4>
          <Link className="block py-1 text-[13.5px] hover:text-white" href="/program">Program Pelatihan</Link>
          <Link className="block py-1 text-[13.5px] hover:text-white" href="/jadwal">Jadwal & Pendaftaran</Link>
          <Link className="block py-1 text-[13.5px] hover:text-white" href="/pendaftaran">Pendaftaran Online</Link>
          <Link className="block py-1 text-[13.5px] hover:text-white" href="/cek-status">Cek Status Pendaftaran</Link>
          <Link className="block py-1 text-[13.5px] hover:text-white" href="/lowongan">Lowongan & Magang</Link>
        </div>
        <div><h4 className="text-white text-[15px] font-display mb-4">Informasi</h4>
          <Link className="block py-1 text-[13.5px] hover:text-white" href="/profil">Mengenal BPVP</Link>
          <Link className="block py-1 text-[13.5px] hover:text-white" href="/berita">Berita</Link>
          <Link className="block py-1 text-[13.5px] hover:text-white" href="/galeri">Galeri</Link>
          <Link className="block py-1 text-[13.5px] hover:text-white" href="/admin">Login Admin</Link>
        </div>
        <div><h4 className="text-white text-[15px] font-display mb-4">Kontak</h4>
          <p className="text-[13px]">Jl. Penfui Timur, Kota Kupang, Nusa Tenggara Timur</p>
          <p className="text-[13px] mt-2">(0380) 000-0000<br />info@bpvpkupang.com</p>
          <p className="text-[13px] mt-2">Senin–Jumat · 08.00–16.00 WITA</p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-wrap justify-between gap-3 text-[12.5px]">
          <span>© {new Date().getFullYear()} BPVP Kupang — UPT di bawah Kementerian Ketenagakerjaan RI.</span>
          <span>Dari belajar, menjadi kompeten, siap kerja &amp; berwirausaha.</span>
        </div>
      </div>
    </footer>
  );
}