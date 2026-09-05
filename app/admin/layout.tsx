import { getSession } from "@/lib/auth";
import AdminLogin from "@/components/AdminLogin";
import AdminShell from "@/components/admin/AdminShell";

export const metadata = { title: "Admin", robots: { index: false, follow: false } };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const s = getSession();
  if (!s) return <AdminLogin />;
  return <AdminShell session={{ name: s.name, role: s.role }}>{children}</AdminShell>;
}