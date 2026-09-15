
import AdminLogin from "@/components/AdminLogin";
import AdminShell from "@/components/admin/AdminShell";
import { getSession } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const s = await getSession();

  if (!s) return <AdminLogin />;

  return (
    <AdminShell session={{ name: s.name, role: s.role }}>
      {children}
    </AdminShell>
  );
}