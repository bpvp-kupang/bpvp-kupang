"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useState } from "react";
import {
  LayoutDashboard,
  GraduationCap,
  CalendarDays,
  Newspaper,
  Image as ImageIcon,
  UserCog,
  ScrollText,
  ShieldCheck,
  LogOut,
  Globe,
  Menu,
} from "lucide-react";

const SessionCtx = createContext<{ name: string; role: string } | null>(null);

export const useAdmin = () => useContext(SessionCtx)!;

const NAV = [
  {
    grp: "Utama",
    items: [
      { href: "/admin", l: "Dashboard", i: LayoutDashboard },
    ],
  },
  {
    grp: "Pelatihan",
    items: [
      { href: "/admin/program", l: "Program Pelatihan", i: GraduationCap },
      { href: "/admin/jadwal", l: "Jadwal / Batch", i: CalendarDays },
    ],
  },
  {
    grp: "Publikasi",
    items: [
      { href: "/admin/berita", l: "Berita", i: Newspaper },
      { href: "/admin/galeri", l: "Galeri", i: ImageIcon },
    ],
  },
  {
    grp: "Sistem",
    items: [
      { href: "/admin/pengguna", l: "Pengguna", i: UserCog, only: ["SUPER_ADMIN"] },
      {
        href: "/admin/audit",
        l: "Audit Log",
        i: ScrollText,
        only: ["SUPER_ADMIN", "ADMIN", "OPERATOR"],
      },
      {
        href: "/admin/sistem",
        l: "Backup & Security",
        i: ShieldCheck,
        only: ["SUPER_ADMIN"],
      },
    ],
  },
];

export default function AdminShell({
  session,
  children,
}: {
  session: { name: string; role: string };
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
    router.refresh();
  }

  const NavList = (
    <>
      <div className="flex items-center gap-2.5 px-2.5 pb-5 border-b border-white/10 mb-3.5">
        <div className="w-9 h-9 rounded-lg bg-white/10 grid place-items-center text-orange font-display font-extrabold">
          B
        </div>

        <div>
          <b className="block text-white font-display font-extrabold text-[14px]">
            BPVP KUPANG
          </b>
          <span className="text-[10px] text-[#8FB4DE]">
            Panel Pengelolaan
          </span>
        </div>
      </div>

      {NAV.map((g) => (
        <div key={g.grp} className="mb-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#5F7CA0] px-3 pt-4 pb-1.5">
            {g.grp}
          </p>

          {g.items
            .filter(
              (it: any) =>
                !it.only || it.only.includes(session.role)
            )
            .map((it: any) => (
              <Link
                key={it.href}
                href={it.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg font-semibold text-[13.5px] mb-0.5 ${
                  path === it.href
                    ? "bg-orange text-white"
                    : "text-[#B8CBE2] hover:bg-white/10 hover:text-white"
                }`}
              >
                <it.i size={16} />
                {it.l}
              </Link>
            ))}
        </div>
      ))}

      <div className="px-3 pt-5 mt-2 border-t border-white/10">
        <b className="block text-white text-[13px]">
          {session.name}
        </b>

        <span className="text-[11px] text-[#8FB4DE]">
          {session.role}
        </span>

        <button
          onClick={logout}
          className="mt-2.5 flex items-center gap-2 text-[13px] font-semibold hover:text-white"
        >
          <LogOut size={15} />
          Keluar
        </button>
      </div>
    </>
  );

  return (
    <SessionCtx.Provider value={session}>
      <div className="min-h-screen bg-sky2 lg:grid lg:grid-cols-[250px_1fr]">
        <aside className="hidden lg:block sticky top-0 h-screen bg-navy p-3.5 overflow-auto">
          {NavList}
        </aside>

        {open && (
          <div className="fixed inset-0 z-[80] lg:hidden">
            <div
              className="absolute inset-0 bg-navy/60"
              onClick={() => setOpen(false)}
            />

            <nav className="absolute left-0 top-0 bottom-0 w-[min(280px,80vw)] bg-navy p-4 overflow-auto">
              {NavList}
            </nav>
          </div>
        )}

        <div className="min-w-0">
          <div className="flex items-center gap-3 px-4 sm:px-6 py-3 bg-white border-b border-line sticky top-0 z-40">
            <button
              className="lg:hidden w-10 h-10 grid place-items-center rounded-lg border border-line"
              onClick={() => setOpen(true)}
              aria-label="Menu admin"
            >
              <Menu size={18} />
            </button>

            <p className="text-mut text-[12.5px] font-semibold hidden sm:block">
              Data tersimpan terpusat di MySQL · RBAC &amp; audit aktif
            </p>

            <div className="flex items-center gap-2.5 ml-auto">
              <a
                href="/"
                target="_blank"
                rel="noopener"
                className="btn-out btn-xs"
              >
                <Globe size={13} />
                Situs publik
              </a>

              <button
                onClick={logout}
                className="btn-out btn-xs"
              >
                <LogOut size={13} />
                Keluar
              </button>
            </div>
          </div>

          <div className="p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </div>
      </div>
    </SessionCtx.Provider>
  );
}
