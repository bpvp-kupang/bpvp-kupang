
export function fmtD(d?: Date | null) {
  if (!d) return "-";

  return new Date(d).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function fmtDL(d?: Date | null) {
  if (!d) return "-";

  return new Date(d).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function badgeCls(v?: string | null) {
  const s = String(v ?? "");

  if (
    [
      "aktif",
      "publish",
      "SELECTED",
      "COMPLETED",
      "Bekerja",
      "Berwirausaha",
    ].includes(s)
  ) {
    return "b-open";
  }

  if (
    [
      "nonaktif",
      "draft",
      "VERIFIED",
      "Magang",
      "Melanjutkan",
      "SUBMITTED",
    ].includes(s)
  ) {
    return s === "SUBMITTED" ? "t-mut" : "b-soon";
  }

  if (["REJECTED", "closed"].includes(s)) {
    return "b-closed";
  }

  return "t-mut";
}

export function asArr(v: unknown): string[] {
  return Array.isArray(v) ? v.map((x) => String(x)) : [];
}