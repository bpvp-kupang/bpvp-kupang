/* Seed / sinkronisasi program pelatihan BPVP Kupang 2026. */

import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const PROGRAMS = [
  [
    "plate-welder-smaw-1g",
    "Plate Welder SMAW 1G",
    "Teknik",
    "240 JP / ±2 bulan",
    "SD",
    "Pelatihan pengelasan pelat posisi 1G menggunakan proses SMAW dengan penekanan pada teknik kerja, K3, dan kualitas hasil las.",
  ],
  [
    "service-sepeda-motor-injeksi",
    "Service Sepeda Motor Injeksi",
    "Otomotif",
    "240 JP / ±2 bulan",
    "SD",
    "Pelatihan perawatan dan service sepeda motor sistem injeksi, diagnosis gangguan, penggunaan alat ukur, dan prosedur kerja bengkel.",
  ],
  [
    "peracikan-minuman-kopi",
    "Peracikan Minuman Kopi",
    "Pariwisata & Hospitality",
    "240 JP / ±3 bulan",
    "SD",
    "Pelatihan meracik dan menyajikan minuman kopi secara profesional, mulai dari persiapan bahan, espresso, manual brew, hingga pelayanan pelanggan.",
  ],
  [
    "pengolahan-ikan",
    "Pengolahan Ikan",
    "Pariwisata & Hospitality",
    "240 JP / ±2 bulan",
    "SD",
    "Pelatihan pengolahan ikan menjadi produk pangan yang higienis, aman, bernilai jual, dan sesuai kebutuhan usaha.",
  ],
  [
    "practical-office-advance",
    "Practical Office Advance",
    "Digital & Perkantoran",
    "320 JP / ±3 bulan",
    "SD",
    "Pelatihan lanjutan kesiapan kerja perkantoran melalui aplikasi perkantoran, administrasi, komunikasi bisnis, dan simulasi kerja.",
  ],
  [
    "pengelola-administrasi-perkantoran",
    "Pengelola Administrasi Perkantoran",
    "Digital & Perkantoran",
    "300 JP / ±3 bulan",
    "SD",
    "Pelatihan administrasi kantor modern meliputi kesekretariatan, kearsipan, aplikasi perkantoran, dan pelayanan administrasi.",
  ],
  [
    "pengolahan-makanan-commercial",
    "Pengolahan Makanan Komersial",
    "Pariwisata & Hospitality",
    "320 JP / ±3 bulan",
    "SD",
    "Pelatihan pengolahan makanan untuk kebutuhan produksi komersial dengan standar higiene, sanitasi, keamanan pangan, dan penyajian.",
  ],
  [
    "junior-makeup-artist",
    "Junior Make Up Artist",
    "Pariwisata & Hospitality",
    "240 JP / ±2 bulan",
    "SD",
    "Pelatihan tata rias dasar dan pengembangan keterampilan Junior Make Up Artist untuk kebutuhan acara, pelanggan, dan usaha jasa kecantikan.",
  ],
  [
    "konten-visual-sosial-media",
    "Pembuatan Konten Visual Untuk Sosial Media",
    "Digital & Perkantoran",
    "240 JP / ±2 bulan",
    "SD",
    "Pelatihan membuat konten visual untuk media sosial melalui fotografi, videografi, editing, copywriting singkat, dan publikasi.",
  ],
  [
    "caregiver-pelaksana",
    "Caregiver Pelaksana",
    "Pariwisata & Hospitality",
    "240 JP / ±2 bulan",
    "SD",
    "Pelatihan keterampilan dasar caregiver dalam pendampingan, perawatan harian, komunikasi, keselamatan, kebersihan, dan etika pelayanan.",
  ],
] as const;

const FAS = [
  "Ruang/workshop praktik",
  "Peralatan praktik",
  "Modul pelatihan",
  "Bahan praktik sesuai program",
];

const SOFT = [
  "Kedisiplinan dan etos kerja",
  "Komunikasi kerja",
  "Keselamatan dan kesehatan kerja (K3)",
  "Kerja sama tim",
  "Kewirausahaan dasar",
];

const MAT = [
  "Teori dasar",
  "Praktik terbimbing",
  "Praktik mandiri",
  "Evaluasi kompetensi",
];

const SERT =
  "Peserta yang lulus menerima sertifikat pelatihan sesuai ketentuan program.";

/*
 * Semua program:
 * - Usia minimal 31 tahun
 * - Pendidikan terakhir minimal SD
 * - Tidak sedang mengikuti pelatihan lain
 * - Data pendaftaran harus benar
 */
const REQUIREMENTS = () => [
  "Usia minimal 31 tahun",
  "Pendidikan terakhir minimal SD",
  "Tidak sedang mengikuti pelatihan lain (tidak rangkap)",
  "Data pendaftaran diisi dengan benar",
];

const COMPETENCIES: Record<string, string[]> = {
  "Plate Welder SMAW 1G": [
    "K3 pengelasan",
    "Persiapan mesin dan elektroda",
    "Teknik SMAW posisi 1G",
    "Pemeriksaan visual hasil las",
  ],

  "Service Sepeda Motor Injeksi": [
    "K3 bengkel",
    "Perawatan berkala",
    "Sistem injeksi",
    "Diagnosis dan perbaikan gangguan",
  ],

  "Peracikan Minuman Kopi": [
    "Persiapan bahan",
    "Espresso dan manual brew",
    "Steaming milk",
    "Pelayanan pelanggan",
  ],

  "Pengolahan Ikan": [
    "Penanganan bahan baku",
    "Teknik pengolahan ikan",
    "Higiene dan sanitasi",
    "Pengemasan produk",
  ],

  "Practical Office Advance": [
    "Aplikasi perkantoran",
    "Korespondensi bisnis",
    "Administrasi kerja",
    "Simulasi rekrutmen",
  ],

  "Pengelola Administrasi Perkantoran": [
    "Kesekretariatan",
    "Kearsipan",
    "Aplikasi perkantoran",
    "Pelayanan administrasi",
  ],

  "Pengolahan Makanan Komersial": [
    "Teknik dasar memasak",
    "Produksi makanan",
    "Higiene dan keamanan pangan",
    "Penyajian komersial",
  ],

  "Junior Make Up Artist": [
    "Dasar tata rias",
    "Make up acara",
    "Kebersihan alat",
    "Konsultasi pelanggan",
  ],

  "Pembuatan Konten Visual Untuk Sosial Media": [
    "Fotografi",
    "Videografi",
    "Editing",
    "Publikasi konten",
  ],

  "Caregiver Pelaksana": [
    "Pendampingan harian",
    "Kebersihan dan keselamatan",
    "Komunikasi",
    "Etika pelayanan",
  ],
};

const off = (iso: string) =>
  new Date(`${iso}T00:00:00.000Z`);

async function main() {
  const passText = process.env.ADMIN_PASSWORD;

  if (!passText || passText.length < 12) {
    throw new Error(
      "ADMIN_PASSWORD wajib diisi dan minimal 12 karakter."
    );
  }

  const pass = await bcrypt.hash(passText, 10);

  const desiredIds = PROGRAMS.map((p) => p[0]);

  // Nonaktifkan program lama yang tidak termasuk daftar 2026.
  await prisma.trainingProgram.updateMany({
    where: {
      id: {
        notIn: desiredIds,
      },
    },
    data: {
      status: "nonaktif",
    },
  });

  // Sinkronisasi program
  for (const [
    id,
    name,
    field,
    duration,
    edu,
    description,
  ] of PROGRAMS) {
    const competencies =
      COMPETENCIES[name] || [
        "Kompetensi teknis sesuai program",
      ];

    const jobs = [
      `Pekerja bidang ${name}`,
      "Staf/tenaga pelaksana sesuai kompetensi",
    ];

    const biz = [
      "Jasa mandiri sesuai kompetensi",
      "Usaha kecil berbasis keterampilan",
    ];

    await prisma.trainingProgram.upsert({
      where: { id },

      update: {
        name,
        field,
        duration,

        // Semua program minimal SD
        minEducation: "SD",

        description,
        quota: 16,
        competencies,
        materials: MAT,
        facilities: FAS,
        softSkills: SOFT,
        certificateNote: SERT,
        jobProspects: jobs,
        businessProspects: biz,

        // Persyaratan resmi
        requirements: REQUIREMENTS(),

        status: "aktif",
      },

      create: {
        id,
        name,
        field,
        duration,

        // Semua program minimal SD
        minEducation: "SD",

        description,
        quota: 16,
        competencies,
        materials: MAT,
        facilities: FAS,
        softSkills: SOFT,
        certificateNote: SERT,
        jobProspects: jobs,
        businessProspects: biz,

        // Persyaratan resmi
        requirements: REQUIREMENTS(),

        status: "aktif",
      },
    });
  }

  /*
   * Semua batch program diarahkan ke Batch 2026.
   *
   * Jadwal:
   * Pendaftaran : 1 Januari 2026 - 31 Desember 2026
   * Seleksi     : 15 September 2026
   * Pelatihan   : 21 September 2026 - 30 November 2026
   */
  await prisma.trainingBatch.updateMany({
    where: {
      programId: {
        in: desiredIds,
      },
    },

    data: {
      year: 2026,
      name: "Batch 2026",
      quota: 16,

      regStart: off("2026-01-01"),
      regEnd: off("2026-12-31"),

      selectionDate: off("2026-09-15"),

      startDate: off("2026-09-21"),
      endDate: off("2026-11-30"),
    },
  });

  // Buat batch apabila program belum mempunyai batch.
  for (const [id] of PROGRAMS) {
    const count =
      await prisma.trainingBatch.count({
        where: {
          programId: id,
        },
      });

    if (!count) {
      await prisma.trainingBatch.create({
        data: {
          id: `batch-2026-${id}`,
          programId: id,
          name: "Batch 2026",
          year: 2026,
          quota: 16,

          regStart: off("2026-01-01"),
          regEnd: off("2026-12-31"),

          selectionDate: off("2026-09-15"),

          startDate: off("2026-09-21"),
          endDate: off("2026-11-30"),
        },
      });
    }
  }

  // Hapus data yang memang diminta.
  await prisma.alumni.deleteMany({});
  await prisma.fAQ.deleteMany({});
  await prisma.instructor.deleteMany({});
  await prisma.partner.deleteMany({});

  // Akun admin/operator
  const USERS = [
    [
      "u1",
      "Super Admin",
      "admin@bpvpkupang.com",
      "SUPER_ADMIN",
    ],
    [
      "u2",
      "Administrator",
      "administrator@bpvpkupang.com",
      "ADMIN",
    ],
    [
      "u3",
      "Operator Pelatihan",
      "operator@bpvpkupang.com",
      "OPERATOR",
    ],
    [
      "u4",
      "Editor Konten",
      "editor@bpvpkupang.com",
      "EDITOR",
    ],
  ] as const;

  for (const [
    id,
    name,
    email,
    role,
  ] of USERS) {
    await prisma.user.upsert({
      where: {
        email,
      },

      update: {
        name,
        passwordHash: pass,
        role: role as any,
        status: "aktif",
      },

      create: {
        id,
        name,
        email,
        passwordHash: pass,
        role: role as any,
        status: "aktif",
      },
    });
  }

  console.log("========================================");
  console.log(
    "SINKRONISASI PROGRAM BPVP KUPANG SELESAI"
  );
  console.log("Program aktif : 10");
  console.log("Usia minimal  : 31 tahun");
  console.log("Pendidikan    : minimal SD");
  console.log("Kuota         : 16 peserta/program");
  console.log("Pendaftaran   : 1 Jan - 31 Des 2026");
  console.log("Seleksi       : 15 Sep 2026");
  console.log("Pelatihan     : 21 Sep - 30 Nov 2026");
  console.log("Tahun         : 2026");
  console.log("Alumni        : dihapus");
  console.log("FAQ           : dihapus");
  console.log("Instruktur    : dihapus");
  console.log("Mitra         : dihapus");
  console.log("========================================");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });