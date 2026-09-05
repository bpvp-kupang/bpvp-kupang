import { Monitor, Coffee, Scissors, Wrench, Hammer, Tag } from "lucide-react";
import { FIELDS } from "@/lib/constants";

const ICONS: Record<string, any> = { monitor: Monitor, coffee: Coffee, scissors: Scissors, wrench: Wrench, hammer: Hammer };

export default function FieldChip({ field }: { field: string }) {
  const f = FIELDS[field] || { c: "#1A56A0", icon: "tag" };
  const Icon = ICONS[f.icon] || Tag;
  return (
    <span className="inline-flex items-center gap-1.5 text-white font-bold text-[11px] px-2.5 py-1 rounded-full" style={{ background: f.c }}>
      <Icon size={12} />{field}
    </span>
  );
}