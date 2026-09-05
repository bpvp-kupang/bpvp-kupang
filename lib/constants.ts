export const FIELDS: Record<string, { c: string; icon: string }> = {
  "Digital & Perkantoran": { c: "#1A56A0", icon: "monitor" },
  "Pariwisata & Hospitality": { c: "#0E7C86", icon: "coffee" },
  Fashion: { c: "#6D4FA3", icon: "scissors" },
  Otomotif: { c: "#B3512E", icon: "wrench" },
  Teknik: { c: "#C98A0A", icon: "hammer" },
};
export const SITE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";