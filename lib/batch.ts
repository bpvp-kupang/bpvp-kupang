export type BatchLike = { regStart: Date; regEnd: Date };
export type BStatus = "open" | "soon" | "closed";

export function batchStatus(b: BatchLike): BStatus {
  const t = new Date().toISOString().slice(0, 10);
  const s = b.regStart.toISOString().slice(0, 10);
  const e = b.regEnd.toISOString().slice(0, 10);
  if (t < s) return "soon";
  if (t <= e) return "open";
  return "closed";
}

export const ST: Record<BStatus, { label: string; cls: string }> = {
  open: { label: "Pendaftaran dibuka", cls: "b-open" },
  soon: { label: "Segera dibuka", cls: "b-soon" },
  closed: { label: "Pendaftaran ditutup", cls: "b-closed" },
};