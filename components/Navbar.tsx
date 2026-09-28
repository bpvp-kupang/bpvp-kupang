"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Lock, Search } from "lucide-react";
import SearchDialog from "./SearchDialog";

const LINKS = [
  ["/", "Beranda"],
  ["/profil", "Profil"],
  ["/program", "Program"],
  ["/jadwal", "Jadwal"],
  ["/berita", "Berita"],
  ["/galeri", "Galeri"],
  ["/kontak", "Kontak"],
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-line">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center gap-4 sm:gap-7 h-[74px]">

          <Link
            href="/"
            className="flex items-center gap-3 shrink-0"
            aria-label="Beranda BPVP Kupang"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-navy grid place-items-center text-orange font-display font-extrabold text-xl">
              B
            </div>

            <div className="leading-tight">
              <b className="block font-display font-extrabold text-[15px] sm:text-[17px] text-navy">
                BPVP KUPANG
              </b>
              <span className="hidden sm:block text-[10.5px] font-semibold text-mut">
                Balai Pelatihan Vokasi dan Produktivitas
              </span>
            </div>
          </Link>

          <nav
            className="hidden lg:flex gap-0.5 flex-1"
            aria-label="Menu utama"
          >
            {LINKS.map(([href, label]) => (
              <Link
                key={href}
                href={href}
                className="font-semibold text-[13.5px] px-3 py-2.5 rounded-lg hover:bg-sky hover:text-blue"
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 ml-auto">

            <button
              onClick={() => setSearch(true)}
              aria-label="Pencarian situs"
              title="Pencarian situs"
              className="w-[42px] h-[42px] grid place-items-center rounded-lg border border-line hover:border-blue hover:text-blue text-mut"
            >
              <Search size={18} />
            </button>

            <Link
              href="/admin"
              aria-label="Login Admin"
              title="Login Admin"
              className="w-[42px] h-[42px] grid place-items-center rounded-lg border border-line hover:border-blue hover:text-blue text-mut"
            >
              <Lock size={18} />
            </Link>

            <button
              type="button"
              className="lg:hidden w-[42px] h-[42px] grid place-items-center rounded-lg border border-line hover:border-blue hover:text-blue"
              onClick={() => setOpen(true)}
              aria-label="Buka menu"
              aria-expanded={open}
            >
              <Menu size={20} />
            </button>

          </div>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-[100] lg:hidden">

          <button
            type="button"
            className="absolute inset-0 bg-navy/50"
            onClick={() => setOpen(false)}
            aria-label="Tutup menu"
          />

          <aside
            className="absolute right-0 top-0 bottom-0 w-[min(330px,86vw)] bg-white shadow-2xl p-5 overflow-y-auto"
            aria-label="Menu mobile"
          >

            <div className="flex items-center justify-between pb-4 border-b border-line">
              <div>
                <b className="block font-display font-extrabold text-[17px] text-navy">
                  BPVP KUPANG
                </b>
                <span className="text-[10px] font-semibold text-mut">
                  Menu Utama
                </span>
              </div>

              <button
                type="button"
                className="w-10 h-10 grid place-items-center rounded-lg border border-line hover:border-blue hover:text-blue"
                onClick={() => setOpen(false)}
                aria-label="Tutup menu"
              >
                <X size={18} />
              </button>
            </div>

            <nav className="mt-4" aria-label="Menu mobile">
              {LINKS.map(([href, label]) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="flex items-center min-h-[48px] px-4 py-3 rounded-lg font-semibold text-navy hover:bg-sky hover:text-blue"
                >
                  {label}
                </Link>
              ))}
            </nav>

          </aside>
        </div>
      )}

      <SearchDialog
        open={search}
        onClose={() => setSearch(false)}
      />
    </>
  );
}