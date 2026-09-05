import bcrypt from "bcryptjs";
import { PANELS } from "./panels";

export const slugify = (s: string) =>
  String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);

const keys = (slug: string) => PANELS[slug].fields.map((f) => f.k);

type ResCfg = {
  model: string;
  include?: Record<string, boolean>;
  order?: Record<string, string>;
  allow: string[];
  label: (row: any) => string;
  before?: (data: any, isCreate: boolean) => any | Promise<any>;
  strip?: (row: any) => any;
};

export const RES: Record<string, ResCfg> = {
  programs:     { model: "trainingProgram", order: { name: "asc" }, allow: keys("program"), label: (r) => r.name },
  batches:      { model: "trainingBatch", include: { program: true }, order: { regStart: "asc" }, allow: keys("jadwal"), label: (r) => `${r.program?.name ?? ""} — ${r.name}` },
  instructors:  { model: "instructor", order: { name: "asc" }, allow: keys("instruktur"), label: (r) => r.name },
  alumni:       { model: "alumni", include: { program: true }, order: { year: "desc" }, allow: keys("alumni"), label: (r) => r.name },
  partners:     { model: "partner", order: { name: "asc" }, allow: keys("mitra"), label: (r) => r.name },
  news:         { model: "news", order: { publishedAt: "desc" }, allow: keys("berita"), label: (r) => r.title,
                  before: (d) => (d.title ? { ...d, slug: slugify(d.title) } : d) },
  gallery:      { model: "gallery", order: { date: "desc" }, allow: keys("galeri"), label: (r) => r.title },
  faq:          { model: "fAQ", order: { category: "asc" }, allow: keys("faq"), label: (r) => r.question },
  jobs:         { model: "jobOpportunity", order: { deadline: "asc" }, allow: keys("lowongan"), label: (r) => r.position },
  applications: { model: "application", include: { participant: true, program: true, batch: true }, order: { submittedAt: "desc" }, allow: ["status", "adminNote"], label: (r) => r.registrationNo },
  users:        { model: "user", order: { name: "asc" }, allow: ["name", "email", "role", "status", "password"], label: (r) => r.name,
                  before: async (d) => { const { password, ...rest } = d; return password ? { ...rest, passwordHash: await bcrypt.hash(String(password), 10) } : rest; },
                  strip: ({ passwordHash, ...r }) => r },
};