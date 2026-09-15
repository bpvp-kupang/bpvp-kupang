"use client";

import CrudPanel from "@/components/admin/CrudPanel";
import { PANELS } from "@/lib/panels";

export default async function PanelPage({
params,
}: {
params: Promise<{ panel: string }>;
}) {
const { panel } = await params;
const cfg = PANELS[panel];

if (!cfg) {
return ( <p className="text-mut">
Panel tidak ditemukan. </p>
);
}

return ( <CrudPanel
   key={panel}
   title={cfg.title}
   res={cfg.res}
   fields={cfg.fields}
   cols={cfg.cols}
 />
);
}
