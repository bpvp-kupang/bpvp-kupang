"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, Lock, Search } from "lucide-react";
import SearchDialog from "./SearchDialog";

const LINKS = [["/", "Beranda"], ["/profil", "Profil"], ["/program", "Program"], ["/jadwal", "Jadwal"], ["/alumni", "Alumni"], ["/berita", "Berita"], ["/kontak", "Kontak"]];
const ALL = [["/", "Beranda"], ["/profil", "Profil BPVP"], ["/program", "Program Pelatihan"], ["/jadwal", "Jadwal Pelatihan"], ["/pendaftaran", "Pendaftaran"], ["/cek-status", "Cek Status Pendaftaran"], ["/rekomendasi", "Cari Pelatihan"], ["/alumni", "Alumni"], ["/dunia-kerja", "Dunia Kerja"], ["/lowongan", "Lowongan Kerja/Magang"], ["/mitra", "Mitra"], ["/instruktur", "Instruktur"], ["/berita", "Berita & Kegiatan"], ["/galeri", "Galeri"], ["/faq", "FAQ"], ["/kontak", "Kontak"]];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(false);
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-line">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center gap-7 h-[74px]">
        <Link href="/" className="flex items-center gap-3 shrink-0" aria-label="Beranda BPVP Kupang">
          <div className="w-11 h-11 rounded-xl bg-navy grid place-items-center text-orange font-display font-extrabold text-xl">B</div>
          <div className="hidden sm:block leading-tight">
            <b className="block font-display font-extrabold text-[17px] text-navy">BPVP KUPANG</b>
            <span className="text-[10.5px] font-semibold text-mut">Balai Pelatihan Vokasi dan Produktivitas</span>
          </div>
        </Link>
        <nav className="hidden lg:flex gap-0.5 flex-1" aria-label="Menu utama">
          {LINKS.map(([href, label]) => <Link key={href} href={href} className="font-semibold text-[13.5px] px-3 py-2.5 rounded-lg hover:bg-sky hover:text-blue">{label}</Link>)}
        </nav>
        <div className="flex items-center gap-2.5 ml-auto lg:ml-0">
          <button onClick={() => setSearch(true)} aria-label="Pencarian situs" title="Pencarian situs" className="w-[42px] h-[42px] grid place-items-center rounded-lg border border-line hover:border-blue hover:text-blue text-mut"><Search size={18} /></button>
          <Link href="/admin" aria-label="Login Admin" title="Login Admin" className="w-[42px] h-[42px] grid place-items-center rounded-lg border border-line hover:border-blue hover:text-blue text-mut"><Lock size={18} /></Link>
          <Link href="/pendaftaran" className="btn-o btn-sm hidden sm:inline-flex">Daftar Pelatihan</Link>
          <button className="lg:hidden w-[42px] h-[42px] grid place-items-center rounded-lg border border-line" onClick={() => setOpen(true)} aria-label="Buka menu"><Menu size={20} /></button>
        </div>
      </div>
      {open && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-navy/50" onClick={() => setOpen(false)} />
          <nav className="absolute right-0 top-0 bottom-0 w-[min(330px,86vw)] bg-white p-5 overflow-auto" aria-label="Menu lengkap">
            <div className="flex items-center justify-between mb-3">
              <b className="font-display text-[16px] text-navy">Menu</b>
              <button className="w-10 h-10 grid place-items-center rounded-lg border border-line" onClick={() => setOpen(false)} aria-label="Tutup menu"><X size={18} /></button>
            </div>
            {ALL.map(([href, label]) => <Link key={href} href={href} onClick={() => setOpen(false)} className="block font-semibold px-3 py-3.5 rounded-lg hover:bg-sky">{label}</Link>)}
            <Link href="/pendaftaran" onClick={() => setOpen(false)} className="btn-o w-full mt-4">Daftar Pelatihan</Link>
          </nav>
        </div>
      )}
      <SearchDialog open={search} onClose={() => setSearch(false)} />
    </header>
  );
}