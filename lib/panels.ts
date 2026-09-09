export type FT = "text" | "area" | "num" | "date" | "sel" | "lines" | "check" | "img" | "program";
export type F = { k: string; l: string; t: FT; opts?: string[]; req?: boolean; ph?: string };
export type Col = { k: string; l: string; t?: "text" | "date" | "badge" | "img" | "count" | "check" };

export const BIDANG = ["Digital & Perkantoran", "Pariwisata & Hospitality", "Fashion", "Otomotif", "Teknik"];
export const NEWS_KAT = ["Berita BPVP", "Pengumuman", "Pendaftaran", "Seleksi", "Pelatihan", "Sertifikasi", "Alumni", "Dunia Kerja", "Kerja Sama"];
export const GAL_KAT = ["Pembukaan", "Pelatihan", "Praktik", "Seleksi", "Sertifikasi", "Alumni", "Kunjungan", "Kerja sama"];
export const AFTER = ["Bekerja", "Berwirausaha", "Magang", "Melanjutkan"];
export const ROLES = ["SUPER_ADMIN", "ADMIN", "OPERATOR", "EDITOR", "VIEWER"];

export type PanelCfg = { title: string; res: string; fields: F[]; cols: Col[] };

export const PANELS: Record<string, PanelCfg> = {
  program: {
    title: "Program Pelatihan", res: "programs",
    fields: [
      { k: "name", l: "Nama program", t: "text", req: true },
      { k: "field", l: "Bidang", t: "sel", opts: BIDANG, req: true },
      { k: "description", l: "Deskripsi", t: "area", req: true },
      { k: "duration", l: "Durasi", t: "text", req: true, ph: "mis. 240 JP / ±3 bulan" },
      { k: "quota", l: "Kuota", t: "num", req: true },
      { k: "minEducation", l: "Pendidikan minimal", t: "sel", opts: ["SD", "SMP", "SMA/SMK", "D1–D3", "S1", "S2+"], req: true },
      { k: "competencies", l: "Kompetensi (satu per baris)", t: "lines" },
      { k: "requirements", l: "Persyaratan (per baris)", t: "lines" },
      { k: "materials", l: "Materi (per baris)", t: "lines" },
      { k: "facilities", l: "Fasilitas (per baris)", t: "lines" },
      { k: "softSkills", l: "Soft skill (per baris)", t: "lines" },
      { k: "jobProspects", l: "Prospek pekerjaan (per baris)", t: "lines" },
      { k: "businessProspects", l: "Prospek usaha (per baris)", t: "lines" },
      { k: "certificateNote", l: "Catatan sertifikat", t: "area" },
      { k: "image", l: "Gambar", t: "img" },
      { k: "status", l: "Status", t: "sel", opts: ["aktif", "nonaktif"] },
    ],
    cols: [
      { k: "name", l: "Nama" }, { k: "field", l: "Bidang" }, { k: "duration", l: "Durasi" },
      { k: "quota", l: "Kuota" }, { k: "status", l: "Status", t: "badge" },
    ],
  },
  jadwal: {
    title: "Jadwal / Batch", res: "batches",
    fields: [
      { k: "programId", l: "Program", t: "program", req: true },
      { k: "name", l: "Nama batch", t: "text", req: true },
      { k: "year", l: "Tahun", t: "num", req: true },
      { k: "quota", l: "Kuota", t: "num", req: true },
      { k: "regStart", l: "Pendaftaran mulai", t: "date", req: true },
      { k: "regEnd", l: "Pendaftaran selesai", t: "date", req: true },
      { k: "selectionDate", l: "Tanggal seleksi", t: "date" },
      { k: "startDate", l: "Pelatihan mulai", t: "date" },
      { k: "endDate", l: "Pelatihan selesai", t: "date" },
    ],
    cols: [
      { k: "program.name", l: "Program" }, { k: "name", l: "Batch" }, { k: "year", l: "Tahun" },
      { k: "regStart", l: "Daftar mulai", t: "date" }, { k: "regEnd", l: "Tutup", t: "date" },
    ],
  },
  instruktur: {
    title: "Instruktur", res: "instructors",
    fields: [
      { k: "name", l: "Nama", t: "text", req: true },
      { k: "field", l: "Bidang keahlian", t: "text", req: true },
      { k: "bio", l: "Profil", t: "area", req: true },
      { k: "experience", l: "Pengalaman", t: "text", ph: "mis. 10 tahun industri" },
      { k: "image", l: "Foto", t: "img" },
      { k: "status", l: "Status", t: "sel", opts: ["aktif", "nonaktif"] },
    ],
    cols: [{ k: "name", l: "Nama" }, { k: "field", l: "Bidang" }, { k: "experience", l: "Pengalaman" }, { k: "status", l: "Status", t: "badge" }],
  },
  mitra: {
    title: "Mitra Industri", res: "partners",
    fields: [
      { k: "name", l: "Nama mitra", t: "text", req: true },
      { k: "category", l: "Kategori", t: "sel", opts: ["Industri", "Perusahaan", "Asosiasi", "Pemerintah", "BUMN"], req: true },
      { k: "cooperation", l: "Bentuk kerja sama", t: "area", req: true },
      { k: "website", l: "Website", t: "text", ph: "https://…" },
    ],
    cols: [{ k: "name", l: "Nama" }, { k: "category", l: "Kategori" }],
  },
  berita: {
    title: "Berita", res: "news",
    fields: [
      { k: "title", l: "Judul", t: "text", req: true },
      { k: "category", l: "Kategori", t: "sel", opts: NEWS_KAT, req: true },
      { k: "content", l: "Isi (paragraf dipisah baris kosong)", t: "area", req: true },
      { k: "image", l: "Gambar", t: "img" },
      { k: "publishedAt", l: "Tanggal publikasi", t: "date", req: true },
      { k: "author", l: "Penulis", t: "text" },
      { k: "status", l: "Status", t: "sel", opts: ["publish", "draft"] },
    ],
    cols: [{ k: "title", l: "Judul" }, { k: "category", l: "Kategori" }, { k: "publishedAt", l: "Tanggal", t: "date" }, { k: "status", l: "Status", t: "badge" }],
  },
  galeri: {
    title: "Galeri", res: "gallery",
    fields: [
      { k: "title", l: "Judul", t: "text", req: true },
      { k: "category", l: "Kategori", t: "sel", opts: GAL_KAT, req: true },
      { k: "image", l: "Foto", t: "img", req: true },
    ],
    cols: [{ k: "image", l: "Foto", t: "img" }, { k: "title", l: "Judul" }, { k: "category", l: "Kategori" }],
  },
  lowongan: {
    title: "Lowongan / Magang", res: "jobs",
    fields: [
      { k: "position", l: "Posisi", t: "text", req: true },
      { k: "company", l: "Perusahaan", t: "text", req: true },
      { k: "location", l: "Lokasi", t: "text", req: true },
      { k: "field", l: "Bidang", t: "sel", opts: BIDANG, req: true },
      { k: "type", l: "Jenis", t: "sel", opts: ["Purnawaktu", "Kontrak", "Magang", "Freelance"], req: true },
      { k: "description", l: "Deskripsi", t: "area", req: true },
      { k: "requirements", l: "Persyaratan (per baris)", t: "lines" },
      { k: "deadline", l: "Batas pendaftaran", t: "date", req: true },
      { k: "link", l: "Link pendaftaran resmi", t: "text", req: true, ph: "https://…" },
      { k: "status", l: "Status", t: "sel", opts: ["aktif", "nonaktif"] },
    ],
    cols: [{ k: "position", l: "Posisi" }, { k: "company", l: "Perusahaan" }, { k: "location", l: "Lokasi" }, { k: "deadline", l: "Batas", t: "date" }, { k: "status", l: "Status", t: "badge" }],
  },
};