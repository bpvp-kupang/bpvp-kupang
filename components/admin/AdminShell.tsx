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
  X,
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
      {
        href: "/admin/pengguna",
        l: "Pengguna",
        i: UserCog,
        only: ["SUPER_ADMIN"],
      },
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

  const NavList = ({ mobile = false }: { mobile?: boolean }) => (
    <div className="flex min-h-full flex-col">
      {/* BRAND */}
      <div className="flex items-center gap-2.5 px-2.5 pb-5 border-b border-white/10">
        <div className="w-9 h-9 shrink-0 rounded-lg bg-white/10 grid place-items-center text-orange font-display font-extrabold">
          B
        </div>

        <div className="min-w-0">
          <b className="block truncate text-white font-display font-extrabold text-[14px]">
            BPVP KUPANG
          </b>
          <span className="block truncate text-[10px] text-[#8FB4DE]">
            Panel Pengelolaan
          </span>
        </div>

        {mobile && (
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="ml-auto w-10 h-10 shrink-0 grid place-items-center rounded-lg text-[#B8CBE2] hover:bg-white/10 hover:text-white"
            aria-label="Tutup menu"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* NAVIGATION */}
      <div className="flex-1 py-2">
        {NAV.map((g) => (
          <div key={g.grp} className="mb-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#5F7CA0] px-3 pt-4 pb-1.5">
              {g.grp}
            </p>

            {g.items
              .filter(
                (it: any) =>
                  !it.only || it.only.includes(session.role)
              )
              .map((it: any) => {
                const active =
                  path === it.href ||
                  (it.href !== "/admin" &&
                    path.startsWith(`${it.href}/`));

                return (
                  <Link
                    key={it.href}
                    href={it.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 min-h-[44px] px-3 rounded-lg font-semibold text-[13.5px] mb-1 ${
                      active
                        ? "bg-orange text-white"
                        : "text-[#B8CBE2] hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <it.i size={17} className="shrink-0" />
                    <span className="truncate">{it.l}</span>
                  </Link>
                );
              })}
          </div>
        ))}
      </div>

      {/* USER */}
      <div className="px-3 pt-4 pb-2 mt-2 border-t border-white/10">
        <b className="block truncate text-white text-[13px]">
          {session.name}
        </b>

        <span className="block truncate text-[11px] text-[#8FB4DE]">
          {session.role}
        </span>

        <button
          type="button"
          onClick={logout}
          className="mt-3 flex items-center gap-2 min-h-[40px] text-[13px] font-semibold text-[#B8CBE2] hover:text-white"
        >
          <LogOut size={15} />
          Keluar
        </button>
      </div>
    </div>
  );

  return (
    <SessionCtx.Provider value={session}>
      <div className="min-h-screen bg-sky2 lg:grid lg:grid-cols-[250px_minmax(0,1fr)]">
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden lg:block sticky top-0 h-screen bg-navy p-3.5 overflow-y-auto">
          <NavList />
        </aside>

        {/* MOBILE DRAWER */}
        {open && (
          <div className="fixed inset-0 z-[100] lg:hidden">
            <button
              type="button"
              className="absolute inset-0 w-full h-full bg-navy/60"
              onClick={() => setOpen(false)}
              aria-label="Tutup menu"
            />

            <aside className="absolute left-0 top-0 bottom-0 w-[min(310px,88vw)] bg-navy p-4 overflow-y-auto shadow-2xl">
              <NavList mobile />
            </aside>
          </div>
        )}

        {/* MAIN */}
        <div className="min-w-0">
          {/* TOP BAR */}
          <header className="sticky top-0 z-40 bg-white border-b border-line">
            <div className="min-h-[64px] px-3 sm:px-6 flex items-center gap-2.5">
              {/* MOBILE MENU */}
              <button
                type="button"
                className="lg:hidden w-11 h-11 shrink-0 grid place-items-center rounded-xl border border-line bg-white"
                onClick={() => setOpen(true)}
                aria-label="Buka menu admin"
              >
                <Menu size={20} />
              </button>

              {/* TITLE */}
              <div className="min-w-0 flex-1">
                <p className="hidden sm:block truncate text-mut text-[12.5px] font-semibold">
                  Data tersimpan terpusat di MySQL · RBAC &amp; audit aktif
                </p>

                <p className="sm:hidden truncate text-navy text-[13px] font-bold">
                  Admin BPVP Kupang
                </p>
              </div>

              {/* DESKTOP ACTIONS */}
              <div className="hidden sm:flex items-center gap-2">
                <a
                  href="/"
                  target="_blank"
                  rel="noopener"
                  className="btn-out btn-xs whitespace-nowrap"
                >
                  <Globe size={13} />
                  Situs publik
                </a>

                <button
                  type="button"
                  onClick={logout}
                  className="btn-out btn-xs whitespace-nowrap"
                >
                  <LogOut size={13} />
                  Keluar
                </button>
              </div>

              {/* MOBILE PUBLIC SITE */}
              <a
                href="/"
                target="_blank"
                rel="noopener"
                className="sm:hidden w-11 h-11 shrink-0 grid place-items-center rounded-xl border border-line bg-white"
                aria-label="Buka situs publik"
                title="Situs publik"
              >
                <Globe size={18} />
              </a>
            </div>
          </header>

          {/* PAGE CONTENT */}
          <main className="w-full min-w-0 p-3 sm:p-5 lg:p-8">
            <div className="w-full min-w-0">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SessionCtx.Provider>
  );
}