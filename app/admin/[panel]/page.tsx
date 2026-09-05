"use client";
import CrudPanel from "@/components/admin/CrudPanel";
import { PANELS } from "@/lib/panels";

export default function PanelPage({ params }: { params: { panel: string } }) {
  const cfg = PANELS[params.panel];
  if (!cfg) return <p className="text-mut">Panel tidak ditemukan.</p>;
  return <CrudPanel key={params.panel} title={cfg.title} res={cfg.res} fields={cfg.fields} cols={cfg.cols} />;
}