
/* Data awal dummy — tanpa data pribadi nyata.
   Dijalankan: npm.cmd run db:seed
*/

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const off = (n: number) => {
  const t = new Date();
  t.setUTCHours(0, 0, 0, 0);
  t.setUTCDate(t.getUTCDate() + n);
  return t;
};

const FAS = [
  "Bengkel/laboratorium praktik standar industri",
  "Peralatan lengkap per peserta",
  "Modul ajar dan bahan praktik",
  "Seragam praktik dan APD",
];

const SOFT = [
  "Kedisiplinan dan etos kerja",
  "Komunikasi kerja",
  "Keselamatan dan kesehatan kerja (K3)",
  "Kerja sama tim",
  "Kewirausahaan dasar",
];

const MAT = [
  "Teori dasar di ruang kelas",
  "Praktik terbimbing di workshop/laboratorium",
  "Uji kompetensi praktik di akhir program",
];

const SERT =
  "Peserta yang lulus menerima sertifikat pelatihan sesuai ketentuan program. Kesempatan uji sertifikasi kompetensi tersedia bagi lulusan tertentu sesuai skema dan persyaratan program.";

const req = (edu: string) => [
  "Usia minimal 18 tahun",
  `Pendidikan terakhir minimal ${edu}`,
  "Sehat jasmani (surat keterangan dokter)",
  "Tidak sedang mengikuti pelatihan lain (tidak rangkap)",
  "Data pendaftaran diisi dengan benar",
];

const PROGRAMS: [
  string,
  string,
  string,
  string,
  number,
  string,
  string,
  string[],
  string[],
  string[]
][] = [
  [
    "pengelola-administrasi-perkantoran",
    "Pengelola Administrasi Perkantoran",
    "Digital & Perkantoran",
    "300 JP / ±3 bulan",
    30,
    "SMA/SMK",
    "Pelatihan keterampilan administrasi kantor modern: kesekretariatan, kearsipan, keuangan sederhana, dan aplikasi perkantoran.",
    [
      "Tata naskah dinas dan kesekretariatan",
      "Kearsipan dan manajemen dokumen digital",
      "Pengolah kata, lembar kerja, dan presentasi",
      "Administrasi keuangan sederhana",
      "Pelayanan publik dan etika komunikasi",
      "Tata graha (front office)",
    ],
    [
      "Staf administrasi dan sekretaris",
      "Petugas front office",
      "Staf SDM/kepegawaian",
      "Admin operasional perusahaan",
    ],
    [
      "Jasa pengetikan dan pengelolaan dokumen",
      "Virtual assistant lepas",
      "Percetakan undangan dan dokumen",
    ],
  ],

  [
    "practical-office-advance",
    "Practical Office Advance",
    "Digital & Perkantoran",
    "320 JP / ±3 bulan",
    25,
    "SMA/SMK",
    "Program lanjutan kesiapan kerja perkantoran: aplikasi tingkat lanjut, korrespondensi bisnis, dan simulasi rekrutmen.",
    [
      "Aplikasi perkantoran tingkat lanjutan",
      "Korespondensi bisnis (Indonesia & Inggris dasar)",
      "Pengelolaan jadwal dan rapat",
      "Pembukuan sederhana",
      "CV, portofolio, dan simulasi wawancara",
      "Grooming dan etika bisnis",
    ],
    ["Admin perkantoran multifungsi", "Staf back office", "Office support"],
    [
      "Virtual admin untuk UMKM",
      "Jasa layout dan penyuntingan dokumen",
    ],
  ],

  [
    "peracikan-minuman-kopi",
    "Peracikan Minuman Kopi",
    "Pariwisata & Hospitality",
    "240 JP / ±3 bulan",
    25,
    "SMP",
    "Pelatihan menyeduh dan menyajikan kopi serta minuman berbasis espresso secara profesional, dari grinding hingga latte art dasar.",
    [
      "Identifikasi biji kopi dan karakter rasa",
      "Kalibrasi mesin espresso dan grinder (dialing in)",
      "Espresso, pour over, dan manual brew",
      "Steaming milk dan latte art dasar",
      "Prinsip HACCP makanan-minuman",
      "Pelayanan pelanggan dan kasir kafe",
    ],
    [
      "Barista kafe dan coffee shop",
      "Staf F&B hotel dan restoran",
      "Kru kedai kopi franchise",
    ],
    [
      "Kedai kopi / coffee corner",
      "Kios minuman kekinian",
      "Usaha bubuk kopi khas NTT",
    ],
  ],

  [
    "junior-makeup-artist",
    "Junior Makeup Artist",
    "Pariwisata & Hospitality",
    "240 JP / ±2 bulan",
    20,
    "SMP",
    "Pelatihan tata rias dasar hingga lanjutan: party, pengantin, dan panggung, dengan standar kebersihan alat.",
    [
      "Dasar make-up dan perawatan kulit wajah",
      "Tata rias party dan pengantin",
      "Hair styling dasar",
      "Tata rias panggung dan fotografi",
      "Perawatan alat dan kebersihan",
      "Konsultasi dengan klien",
    ],
    [
      "Make-up artist studio",
      "MUA wedding dan event",
      "Beauty advisor retail",
    ],
    [
      "Jasa tata rias pengantin",
      "Studio make-up",
      "Penjualan produk kecantikan",
    ],
  ],

  [
    "spa-therapist",
    "SPA Therapist",
    "Pariwisata & Hospitality",
    "300 JP / ±3 bulan",
    20,
    "SMA/SMK",
    "Pelatihan perawatan tubuh dan SPA sesuai standar pelayanan hospitality hotel dan SPA profesional.",
    [
      "Massage dasar (Swedish, refleksi)",
      "Perawatan tubuh dan facial dasar",
      "Aromaterapi dan bahan alami",
      "Etika, privasi, dan standar pelayanan SPA",
      "K3 dan sanitasi ruang perawatan",
      "Pelayanan hospitality",
    ],
    [
      "SPA therapist hotel dan resort",
      "Terapis SPA standalone",
      "Staf wellness center",
    ],
    [
      "Ruang perawatan rumahan",
      "Layanan SPA keliling",
      "Layanan beauty dan wellness",
    ],
  ],

  [
    "junior-spa-terapis",
    "Junior SPA Terapis",
    "Pariwisata & Hospitality",
    "240 JP / ±2 bulan",
    20,
    "SMP",
    "Program tingkat pemula untuk perawatan tubuh dasar dengan fokus hygiene, layanan pelanggan, dan K3.",
    [
      "Dasar massage dan perawatan tubuh",
      "Perawatan facial dasar",
      "Higiene dan sanitasi",
      "Pelayanan pelanggan",
      "Keselamatan dan kesehatan kerja",
    ],
    ["Junior therapist hotel dan SPA", "Asisten terapis"],
    ["Layanan perawatan rumahan", "Jasa pijat keliling terbatas"],
  ],

  [
    "menjahit-pakaian",
    "Menjahit Pakaian",
    "Fashion",
    "300 JP / ±3 bulan",
    25,
    "SD",
    "Pelatihan menjahit pakaian siap pakai: pengukuran, pola dasar, pemotongan, hingga finishing dan hitung biaya.",
    [
      "Pengenalan alat dan mesin jahit",
      "Pengambilan ukuran dan pola dasar",
      "Pemotongan bahan efisien",
      "Menjahit atasan, bawahan, dan dress",
      "Finishing dan kontrol kualitas",
      "Perhitungan biaya produksi",
    ],
    [
      "Penjahit konveksi dan butik",
      "Operator produksi garmen",
      "Staf quality control garmen",
    ],
    [
      "Rumah jahit dan butik kecil",
      "Konveksi seragam",
      "Penjualan hasil jahitan sendiri",
    ],
  ],

  [
    "menjahit-kebaya",
    "Menjahit Kebaya",
    "Fashion",
    "240 JP / ±2 bulan",
    20,
    "SD",
    "Pelatihan khusus menjahit kebaya klasik dan modern, termasuk aplikasi payet, bros, dan bordir dasar. Disarankan menguasai menjahit dasar.",
    [
      "Pola kebaya klasik dan modern",
      "Teknik menjahit kebaya",
      "Aplikasi payet, bros, dan bordir dasar",
      "Finishing kebaya",
      "Kalkulasi harga jasa jahit",
    ],
    ["Penjahit butik pengantin", "Staf produksi busana adat"],
    ["Jasa jahit kebaya dan pengantin", "Rental kebaya dan busana adat"],
  ],

  [
    "tour-guide",
    "Tour Guide",
    "Pariwisata & Hospitality",
    "300 JP / ±2 bulan",
    25,
    "SMA/SMK",
    "Pelatihan pemandu wisata lokal yang menguasai destinasi NTT, interpretasi alam-budaya, dan manajemen perjalanan.",
    [
      "Pemanduan wisata dan interpretasi budaya",
      "Destinasi utama NTT (Komodo, Padar, Rinca)",
      "Manajemen tur dan itineral",
      "Bahasa Inggris untuk pemandu",
      "P3K dan keselamatan tamu",
      "Etika profesi pemandu wisata",
    ],
    [
      "Pemandu wisata travel dan tour operator",
      "Tour leader domestik",
      "Staf informasi wisata",
    ],
    [
      "Biro perjalanan wisata lokal",
      "Homestay dan paket tur",
      "Transport wisata terpadu",
    ],
  ],

  [
    "pastry-kue",
    "Pastry & Kue",
    "Pariwisasa & Hospitality",
    "300 JP / ±3 bulan",
    25,
    "SMP",
    "Pelatihan pembuatan roti, kue, pastry, dan dessert dengan teknik bakeri modern serta perhitungan biaya produksi.",
    [
      "Adonan roti, pastry, dan cake",
      "Dekorasi kue dasar (buttercream, fondan)",
      "Dessert klasik dan modern",
      "Perhitungan HPP dan harga jual",
      "Pengemasan produk",
      "Manajemen produksi rumahan",
    ],
    [
      "Baker dan pastry chef hotel",
      "Staf produksi bakery",
      "Dekorator kue",
    ],
    [
      "Toko kue dan bakery rumahan",
      "Frozen dessert",
      "Kue bungkus dan oleh-oleh khas NTT",
    ],
  ],

  [
    "pengolahan-makanan-commercial",
    "Pengolahan Makanan Commercial",
    "Pariwisata & Hospitality",
    "320 JP / ±3 bulan",
    30,
    "SMP",
    "Pelatihan pengolahan makanan continental, Indonesia, dan khas NTT dengan standar higiene serta orientasi produksi komersial.",
    [
      "Teknik dasar memasak (cutting, stock, sauce)",
      "Masakan continental dan Indonesia",
      "Masakan khas NTT (se'i, jagung bo'e)",
      "Higiene sanitasi dan keamanan pangan (HACCP)",
      "Nutrisi dan penyusunan menu",
      "Plating dan produksi skala komersial",
    ],
    [
      "Juru masak restoran dan hotel",
      "Staf produksi dapur",
      "Katering institusi",
    ],
    [
      "Katering dan rumah makan",
      "Frozen food dan snack rumahan",
      "Warung masakan khas NTT",
      "Lunch box harian",
    ],
  ],

  [
    "konten-visual-sosial-media",
    "Pembuatan Konten Visual Untuk Sosial Media",
    "Digital & Perkantoran",
    "240 JP / ±2 bulan",
    25,
    "SMA/SMK",
    "Pelatihan produksi konten visual — fotografi produk, videografi, dan editing — untuk kebutuhan promosi di media sosial.",
    [
      "Dasar fotografi dan videografi",
      "Komposisi dan pencahayaan",
      "Fotografi produk dan pangan",
      "Editing foto dan video di ponsel",
      "Copywriting visual singkat",
      "Publikasi konten dan membaca insight",
    ],
    [
      "Content creator perusahaan",
      "Videografer lepas",
      "Staf media sosial",
    ],
    [
      "Jasa konten kreatif untuk UMKM",
      "Jasa foto/video acara dan produk",
      "Kanal konten pribadi (monetisasi)",
    ],
  ],

  [
    "desain-grafis-muda",
    "Desain Grafis Muda",
    "Digital & Perkantoran",
    "240 JP / ±3 bulan",
    25,
    "SMA/SMK",
    "Pelatihan desain visual untuk media cetak dan digital menggunakan perangkat lunak standar industri.",
    [
      "Prinsip desain dan tipografi",
      "Pengolahan foto dan ilustrasi digital",
      "Desain logo dan identitas visual",
      "Materi promosi cetak dan digital",
      "Desain konten media sosial",
      "Mockup dan file siap cetak",
    ],
    [
      "Desainer grafis agensi dan perusahaan",
      "Staf produksi percetakan",
      "Kru kreatif media digital",
    ],
    [
      "Jasa desain lepas (freelance)",
      "Studio desain dan percetakan kecil",
      "Produk digital (template)",
    ],
  ],

  [
    "konten-pemasaran-via-smartphone",
    "Pembuatan Konten Pemasaran via Smartphone",
    "Digital & Perkantoran",
    "200 JP / ±2 bulan",
    30,
    "SMA/SMK",
    "Pelatihan pemasaran digital praktis hanya dengan ponsel: konten promosi, marketplace, live commerce, dan evaluasi kampanye.",
    [
      "Strategi pemasaran digital dasar",
      "Optimasi media sosial untuk bisnis",
      "Jualan di marketplace dan live commerce",
      "Copywriting persuasif",
      "Iklan berbayar dasar",
      "Membaca insight dan metrik",
    ],
    [
      "Social media officer",
      "Digital marketing staff",
      "Penjual online profesional",
    ],
    [
      "Kelola akun bisnis UMKM (jasa)",
      "Toko online dan marketplace sendiri",
      "Jasa iklan untuk UMKM",
    ],
  ],

  [
    "service-berkala-kendaraan-ringan",
    "Service Berkala Kendaraan Ringan",
    "Otomotif",
    "400 JP / ±4 bulan",
    25,
    "SMA/SMK",
    "Pelatihan perawatan dan perbaikan mobil (engine, chasis, kelistrikan) dengan praktik di workshop standar industri.",
    [
      "K3 otomotif",
      "Engine dan pemeliharaan berkala",
      "Sistem chasis dan suspensi",
      "Kelistrikan kendaraan (dasar EV)",
      "Diagnosis kerusakan dan pemakaian scanner",
      "Service rutin kendaraan",
    ],
    [
      "Mekanik bengkel mobil dan dealer",
      "Teknisi bengkel spesialis",
      "Foreman bengkel",
    ],
    [
      "Bengkel mobil dan jasa spooring",
      "Bengkel spesialis (AC, injeksi)",
      "Detailing dan cuci mobil",
    ],
  ],

  [
    "teknik-otomotif",
    "Teknik Otomotif",
    "Otomotif",
    "600 JP / ±6 bulan",
    25,
    "SMA/SMK",
    "Program otomotif menyeluruh: perawatan dan perbaikan sepeda motor dan kendaraan ringan, termasuk dasar motor listrik.",
    [
      "K3 bengkel dan pemakaian alat kerja",
      "Engine sepeda motor dan kendaraan ringan",
      "Sistem transmisi dan rem",
      "Kelistrikan kendaraan dan dasar EV",
      "Diagnosis kerusakan terpadu",
      "Perawatan motor listrik dasar",
    ],
    [
      "Mekanik senior bengkel dan dealer",
      "Teknisi servis panggilan",
      "Mekanik bengkel resmi",
    ],
    [
      "Bengkel terpadu motor dan mobil",
      "Home service (servis panggilan)",
      "Toko suku cadang dan jasa service",
    ],
  ],

  [
    "teknik-pengelasan",
    "Teknik Pengelasan",
    "Teknik",
    "300 JP / ±3 bulan",
    20,
    "SMP",
    "Pelatihan pengelasan SMAW (busur listrik) posisi datar hingga tegak dengan penekanan keselamatan kerja.",
    [
      "K3 pengelasan dan APD las",
      "Seting mesin las SMAW",
      "Las datar, horizontal, dan vertikal (2F–3F)",
      "Pengelasan pelat dan pipa dasar",
      "Kontrol mutu hasil las (visual)",
      "Fabrikasi konstruksi sederhana",
    ],
    [
      "Welder fabrikasi dan konstruksi",
      "Welder galangan/perkapalan (dengan sertifikasi tambahan)",
      "Operator mesin bubut/gerinda dasar",
    ],
    [
      "Bengkel las dan fabrikasi pagar",
      "Jasa las dan pemasangan panggilan",
      "Produksi furnitur besi",
    ],
  ],
];

const BATCHES: [
  string,
  string,
  number,
  number,
  number,
  number,
  number,
  number
][] = [
  ["peracikan-minuman-kopi", "Barista Batch 12", 25, -5, 15, 21, 30, 120],
  ["teknik-pengelasan", "Las Batch 7", 20, -3, 17, 23, 32, 122],
  [
    "service-berkala-kendaraan-ringan",
    "Service Berkala Batch 6",
    25,
    -8,
    12,
    18,
    28,
    118,
  ],
  [
    "konten-pemasaran-via-smartphone",
    "Konten Pemasaran Batch 4",
    30,
    -1,
    20,
    26,
    35,
    95,
  ],
  ["menjahit-pakaian", "Menjahit Pakaian Batch 18", 25, 7, 27, 33, 42, 132],
  [
    "pengolahan-makanan-commercial",
    "Pengolahan Makanan Batch 9",
    30,
    10,
    30,
    36,
    45,
    135,
  ],
  [
    "konten-visual-sosial-media",
    "Konten Visual Batch 4",
    25,
    12,
    32,
    38,
    47,
    107,
  ],
  ["tour-guide", "Tour Guide Batch 5", 25, 20, 40, 46, 55, 115],
  ["desain-grafis-muda", "Desain Grafis Batch 11", 25, -32, -12, -8, -2, 88],
  [
    "pengelola-administrasi-perkantoran",
    "Administrasi Perkantoran Batch 14",
    30,
    25,
    45,
    51,
    60,
    150,
  ],
  ["pastry-kue", "Pastry & Kue Batch 8", 25, -370, -350, -345, -340, -250],
];

const INSTRUCTORS = [
  [
    "Yohanes Bunga",
    "Barista & F&B",
    "Instruktur barista bersertifikat dengan pengalaman melatih di sejumlah balai pelatihan di NTT.",
    "9 tahun industri kopi & F&B",
  ],
  [
    "Maria Kian",
    "Pengolahan Makanan & Pastry",
    "Koki profesional dengan fokus masakan NTT dan pastry modern.",
    "11 tahun dapur hotel",
  ],
  [
    "Petrus S. Ledo",
    "Pengelasan",
    "Welder tersertifikasi dengan pengalaman proyek konstruksi dan galangan.",
    "13 tahun welding",
  ],
  [
    "Anastasia Mbaki",
    "Desain Grafis & Konten Visual",
    "Desainer grafis lepas yang kini fokus melatih kreator muda NTT.",
    "8 tahun kreatif digital",
  ],
  [
    "Fransiskus Ribo",
    "Otomotif",
    "Mekanik senior spesialis kendaraan roda dua dan empat, pelatih K3 bengkel.",
    "14 tahun bengkel",
  ],
  [
    "Dorkas Wollo",
    "Menjahit & Kebaya",
    "Penjahit butik dengan keahlian kebaya dan busana adat NTT.",
    "10 tahun butik",
  ],
  [
    "Gabriel Neno",
    "Pariwisata & Tour Guide",
    "Pemandu wisata berlisensi yang menguasai destinasi Flores–Komodo.",
    "7 tahun tour leader",
  ],
  [
    "Sinta Kamhi",
    "Administrasi & Digital Marketing",
    "Praktisi pemasaran digital dan pelatih kesiapan kerja perkantoran.",
    "6 tahun digital agency",
  ],
];

const ALUMNI: [
  string,
  string,
  number,
  string,
  string,
  string,
  string,
  boolean
][] = [
  [
    "peracikan-minuman-kopi",
    "Ester Ama",
    2023,
    "Bekerja",
    "Head Barista, kedai kopi di Kota Kupang",
    "",
    "Dulu saya hanya ibu rumah tangga. Setelah lulus pelatihan, saya diterima di salah satu kedai kopi terbesar di Kupang dan sekarang memimpin tim barista baru.",
    true,
  ],
  [
    "teknik-pengelasan",
    "Yosef Tallo",
    2022,
    "Berwirausaha",
    "",
    "Bengkel las & fabrikasi pagar di Kupang",
    "Modal keterampilan las dari BPVP saya jadikan berkah. Sekarang bengkel saya mempekerjakan tiga alumni lain dan order datang hampir setiap minggu.",
    true,
  ],
  [
    "menjahit-pakaian",
    "Lina Sabu",
    2024,
    "Berwirausaha",
    "",
    "Rumah jahit Sabu Tailor",
    "Dari satu mesin jahit pinjaman, kini saya punya empat mesin dan menerima pesanan seragam sekolah setiap musim tahun ajaran.",
    true,
  ],
  [
    "teknik-otomotif",
    "Markus Loe",
    2023,
    "Bekerja",
    "Mekanik senior bengkel resmi dealer",
    "",
    "Sempat kerja serabutan. Setelah pelatihan, sertifikat dan keterampilan membuat bengkel dealer percaya mempekerjakan saya.",
    true,
  ],
  [
    "pengolahan-makanan-commercial",
    "Ni Luh Arini",
    2024,
    "Magang",
    "Magang dapur hotel bintang 3",
    "",
    "Sedang magang di dapur hotel dan belajar banyak standar profesional. Target saya setahun lagi menjadi cook tetap.",
    true,
  ],
  [
    "desain-grafis-muda",
    "Bernadus Beda",
    2024,
    "Berwirausaha",
    "",
    "Jasa desain lepas untuk UMKM Kupang",
    "Klien pertama saya datang dari jejaring sesama peserta pelatihan. Sekarang saya pegang desain untuk belasan UMKM.",
    false,
  ],
];

const PARTNERS = [
  [
    "PT Sarana Coffee Nusa",
    "Industri",
    "Kopi & F&B — tempat praktik dan penyerapan lulusan barista",
  ],
  [
    "Hotel Meridian Kupang",
    "Perusahaan",
    "Hospitality — praktik lapangan dan rekrutmen lulusan",
  ],
  [
    "Koperasi Kopi Flores",
    "Asosiasi",
    "Rantai pasok dan pengembangan kurikulum kopi",
  ],
  [
    "PT Baja Terang Konstruksi",
    "Industri",
    "Fabrikasi — praktik las dan penyerapan welder",
  ],
  [
    "Bengkel Auto Prima",
    "Perusahaan",
    "Otomotif — tempat praktik peserta",
  ],
  [
    "CV Nusa Kreatif Digital",
    "Industri",
    "Kreatif — magang desain dan konten",
  ],
  [
    "Konveksi Tenun Timor",
    "Industri",
    "Fashion — bahan praktik dan penyerapan penjahit",
  ],
  [
    "Dinas Pariwisata NTT",
    "Pemerintah",
    "Pengembangan pemandu wisata dan event",
  ],
  [
    "Garuda Workshop Network",
    "Asosiasi",
    "Standar kompetensi otomotif",
  ],
  [
    "PT Boga Lestari Catering",
    "Perusahaan",
    "Kuliner — magang dan rekrutmen",
  ],
];

const NEWS: [string, string, string, number][] = [
  [
    "Pendaftaran Pelatihan Gelombang Baru Resmi Dibuka",
    "Pendaftaran",
    "Pendaftaran pelatihan gelombang baru dibuka untuk sejumlah program: Peracikan Minuman Kopi, Teknik Pengelasan, Service Berkala Kendaraan Ringan, dan Konten Pemasaran via Smartphone.\n\nPendaftaran dilakukan melalui halaman Pendaftaran di situs ini. Seleksi dilaksanakan sesuai kuota dan persyaratan masing-masing program.",
    -4,
  ],
  [
    "Wisuda 234 Alumni: Siap Kerja dan Berwirausaha",
    "Alumni",
    "Sebanyak 234 peserta dinyatakan lulus dan dilantik sebagai alumni. Sebagian besar telah terserap dunia kerja, membuka usaha, atau melanjutkan magang di mitra industri.\n\nKegiatan ditutup dengan forum matching antara alumni dan perusahaan mitra.",
    -12,
  ],
  [
    "Penandatanganan Kerja Sama dengan Industri Kopi NTT",
    "Kerja Sama",
    "BPVP Kupang menambah mitra baru dari industri kopi untuk mendukung praktik peserta program barista dan pengolahan makanan. Kerja sama mencakup tempat praktik, bahan ajar, dan kesempatan magang bagi lulusan terbaik.",
    -20,
  ],
  [
    "Pengumuman Jadwal Seleksi Gelombang Berjalan",
    "Seleksi",
    "Seleksi peserta dilaksanakan setelah periode pendaftaran ditutup, berupa verifikasi berkas dan wawancara singkat di BPVP Kupang. Peserta terpilih dihubungi melalui nomor WhatsApp yang didaftarkan.\n\nPastikan nomor dan email aktif agar tidak terlewat informasi seleksi.",
    -7,
  ],
  [
    "Uji Sertifikasi Kompetensi untuk Lulusan Terpilih",
    "Sertifikasi",
    "Peserta lulusan tertentu berkesempatan mengikuti uji sertifikasi kompetensi sesuai skema dan persyaratan program. Sertifikasi dilaksanakan bersama lembaga sertifikasi profesi mitra.\n\nPengumuman peserta yang memenuhi persyaratan disampaikan setelah hasil pelatihan keluar.",
    -30,
  ],
  [
    "Materi Dasar Motor Listrik Masuk Kurikulum Otomotif",
    "Pelatihan",
    "Sejalan dengan transisi kendaraan, program otomotif BPVP Kupang memasukkan materi dasar perawatan motor listrik. Peserta tetap mempelajari mesin konvensional secara utuh.",
    -45,
  ],
  [
    "Mitra Catering Buka Lowongan untuk Alumni Kuliner",
    "Dunia Kerja",
    "Salah satu mitra boga membuka kesempatan kerja dan magang bagi alumni program Pengolahan Makanan dan Pastry. Detail lowongan dapat dilihat di halaman Lowongan Kerja & Magang.",
    -9,
  ],
  [
    "Jam Layanan Informasi Publik",
    "Pengumuman",
    "Selama hari libur nasional, layanan informasi daring tetap berjalan normal melalui situs ini. Layanan tatap muka dibuka kembali sesuai jam layanan reguler pada hari kerja berikutnya.",
    -60,
  ],
];

const GALLERY: [string, string][] = [
  ["Praktik latte art peserta barista", "Praktik"],
  ["Pembukaan batch pelatihan", "Pembukaan"],
  ["Pengelasan di workshop", "Pelatihan"],
  ["Penyerahan sertifikat", "Sertifikasi"],
  ["Wawancara seleksi peserta", "Seleksi"],
  ["Alumni mendemokan produk", "Alumni"],
  ["Kunjungan mitra industri", "Kunjungan"],
  ["Penandatanganan kerja sama", "Kerja sama"],
  ["Praktik menjahit kebaya", "Praktik"],
  ["Bengkel otomotif", "Pelatihan"],
  ["Lab komputer desain", "Pelatihan"],
  ["Tim peserta lomba", "Alumni"],
];

const FAQS: [string, string, string][] = [
  [
    "Apa itu BPVP Kupang?",
    "BPVP (Balai Pelatihan Vokasi dan Produktivitas) Kupang adalah unit pelaksana teknis di bidang pelatihan vokasi dan produktivitas di bawah Kementerian Ketenagakerjaan yang melayani wilayah Nusa Tenggara Timur.",
    "Umum",
  ],
  [
    "Siapa yang dapat mengikuti pelatihan?",
    "Umumnya pencari kerja usia minimal 18 tahun sesuai persyaratan pendidikan tiap program. Persyaratan lengkap tertera pada halaman detail masing-masing program.",
    "Pendaftaran",
  ],
  [
    "Apakah pelatihan gratis?",
    "Pelatihan di BPVP umumnya tidak dipungut biaya bagi peserta yang lolos seleksi dan didanai program pemerintah. Informasi resmi terbaru selalu diumumkan melalui kanal resmi BPVP Kupang.",
    "Umum",
  ],
  [
    "Apa persyaratan pendaftarannya?",
    "Secara umum: usia 18 tahun ke atas, pendidikan minimal sesuai program, sehat jasmani, tidak sedang mengikuti pelatihan lain (tidak rangkap), dan data pendaftaran diisi dengan benar.",
    "Pendaftaran",
  ],
  [
    "Bagaimana cara mendaftar?",
    "Buka halaman Pendaftaran di situs ini, pilih program yang batch-nya berstatus 'pendaftaran dibuka', isi formulir, lalu simpan nomor registrasi yang muncul. Pendaftaran resmi juga tersedia melalui platform pelatihan Kemnaker.",
    "Pendaftaran",
  ],
  [
    "Bagaimana proses seleksinya?",
    "Seleksi berupa verifikasi berkas dan wawancara singkat setelah pendaftaran ditutup. Peserta terpilih dihubungi melalui nomor WhatsApp yang didaftarkan.",
    "Seleksi",
  ],
  [
    "Berapa lama pelatihannya?",
    "Durasi bervariasi per program, umumnya 200–600 jam pelajaran (sekitar 2 sampai 6 bulan). Rincian ada di halaman detail program.",
    "Pelatihan",
  ],
  [
    "Apa yang didapat peserta setelah pelatihan?",
    "Keterampilan teknis, pengalaman praktik, soft skill, etos kerja, pengetahuan K3, sertifikat pelatihan, jejaring, dan informasi peluang kerja/magang.",
    "Pelatihan",
  ],
  [
    "Apakah mendapatkan sertifikat?",
    "Ya, peserta yang lulus menerima sertifikat pelatihan sesuai program yang diikuti.",
    "Sertifikasi",
  ],
  [
    "Apakah ada sertifikasi kompetensi?",
    "Kesempatan uji sertifikasi kompetensi tersedia bagi lulusan tertentu sesuai skema dan persyaratan masing-masing program. Informasi diumumkan setelah hasil pelatihan keluar.",
    "Sertifikasi",
  ],
  [
    "Apakah setelah pelatihan langsung mendapatkan pekerjaan?",
    "BPVP tidak menjanjikan pekerjaan otomatis. Peserta dibekali kompetensi terukur, sertifikat, jejaring mitra industri, dan informasi lowongan/magang yang tersedia.",
    "Umum",
  ],
  [
    "Bagaimana mengecek status pendaftaran saya?",
    "Buka halaman Cek Status Pendaftaran, masukkan nomor registrasi yang Anda terima saat mendaftar, maka status terkini akan ditampilkan.",
    "Pendaftaran",
  ],
  [
    "Apakah ada peluang magang dan wirausaha?",
    "Ya. Sejumlah mitra industri menyediakan magang bagi lulusan (lihat halaman Lowongan), dan materi kewirausahaan dasar menjadi bagian setiap program.",
    "Dunia Kerja",
  ],
];

const JOBS: [
  string,
  string,
  string,
  string,
  string,
  string,
  string[],
  number
][] = [
  [
    "Barista",
    "PT Sarana Coffee Nusa",
    "Kupang",
    "Pariwisata & Hospitality",
    "Purnawaktu",
    "Melayani pelanggan, menyeduh kopi espresso, dan menjaga kualitas produk.",
    ["Alumni pelatihan barista", "Mampu shift pagi/sore", "Ramah dan komunikatif"],
    20,
  ],
  [
    "Welder",
    "PT Baja Terang Konstruksi",
    "Kupang",
    "Teknik",
    "Kontrak proyek",
    "Pekerjaan pengelasan konstruksi baja ringan dan pagar sesuai gambar kerja.",
    ["Alumni pelatihan las", "Lulus tes buta warna", "Pengalaman posisi horizontal diutamakan"],
    15,
  ],
  [
    "Magang Dapur",
    "PT Boga Lestari Catering",
    "Kupang",
    "Pariwisata & Hospitality",
    "Magang",
    "Magang produksi makanan skala katering dengan pembimbing.",
    ["Alumni Pengolahan Makanan/Pastry", "Bersedia bekerja dalam tim"],
    25,
  ],
  [
    "Jr. Graphic Designer",
    "CV Nusa Kreatif Digital",
    "Remote / Kupang",
    "Digital & Perkantoran",
    "Freelance",
    "Membuat materi visual kampanye klien UMKM.",
    ["Kuasai perangkat desain standar industri", "Portofolio minimal 5 karya"],
    30,
  ],
  [
    "Mekanik Motor",
    "Bengkel Auto Prima",
    "Kupang",
    "Otomotif",
    "Purnawaktu",
    "Service berkala dan perbaikan sepeda motor.",
    ["Alumni otomotif BPVP", "Disiplin dan teliti"],
    10,
  ],
  [
    "Penjahit Produksi",
    "Konveksi Tenun Timor",
    "Kupang",
    "Fashion",
    "Purnawaktu",
    "Produksi busana tenun siap pakai sesuai pola.",
    ["Alumni Menjahit Pakaian", "Rapi dan cepat"],
    18,
  ],
];

async function main() {
  console.log("========================================");
  console.log("Memulai seed database BPVP Kupang...");
  console.log("========================================");

  // ------------------------------------------------------------
  // 1. USER ADMIN
  // ------------------------------------------------------------

  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    throw new Error(
      "ADMIN_PASSWORD belum diatur. Silakan isi ADMIN_PASSWORD di file .env sebelum menjalankan db:seed."
    );
  }

  if (adminPassword.length < 12) {
    throw new Error(
      "ADMIN_PASSWORD minimal 12 karakter. Jangan gunakan password sederhana."
    );
  }

  const pass = await bcrypt.hash(adminPassword, 10);

  const USERS = [
    ["u1", "Herry Simatupang", "admin@bpvpkupang.com", "SUPER_ADMIN"],
    ["u2", "Rina Oematan", "operator@bpvpkupang.com", "OPERATOR"],
    ["u3", "Dedi Manafe", "editor@bpvpkupang.com", "EDITOR"],
    ["u4", "Vera Kase", "viewer@bpvpkupang.com", "VIEWER"],
  ] as const;

  for (const [id, name, email, role] of USERS) {
    await prisma.user.upsert({
      where: { email },
      update: {
        name,
        passwordHash: pass,
        role: role as any,
      },
      create: {
        id,
        name,
        email,
        passwordHash: pass,
        role: role as any,
      },
    });
  }

  console.log(`✓ ${USERS.length} user admin/operator dibuat/diperbarui`);

  // ------------------------------------------------------------
  // 2. PROGRAM PELATIHAN
  // ------------------------------------------------------------

  for (const [
    id,
    name,
    field,
    duration,
    quota,
    edu,
    desc,
    komp,
    jobs,
    biz,
  ] of PROGRAMS) {
    await prisma.trainingProgram.upsert({
      where: { id },
      update: {
        name,
        field,
        duration,
        quota,
        minEducation: edu,
        description: desc,
        competencies: komp,
        materials: MAT,
        facilities: FAS,
        softSkills: SOFT,
        certificateNote: SERT,
        jobProspects: jobs,
        businessProspects: biz,
        requirements: req(edu),
        image: `https://picsum.photos/seed/bpvp-${id}/900/600`,
      },
      create: {
        id,
        name,
        field,
        duration,
        quota,
        minEducation: edu,
        description: desc,
        competencies: komp,
        materials: MAT,
        facilities: FAS,
        softSkills: SOFT,
        certificateNote: SERT,
        jobProspects: jobs,
        businessProspects: biz,
        requirements: req(edu),
        image: `https://picsum.photos/seed/bpvp-${id}/900/600`,
      },
    });
  }

  console.log(`✓ ${PROGRAMS.length} program pelatihan dibuat/diperbarui`);

  // ------------------------------------------------------------
  // 3. BATCH PELATIHAN
  // ------------------------------------------------------------

  let bi = 0;

  for (const [prog, nama, quota, a, b, c, dd, e] of BATCHES) {
    bi++;

    const id = `b${bi}`;

    await prisma.trainingBatch.upsert({
      where: { id },
      update: {
        programId: prog,
        name: nama,
        year: off(a).getUTCFullYear(),
        quota,
        regStart: off(a),
        regEnd: off(b),
        selectionDate: off(c),
        startDate: off(dd),
        endDate: off(e),
      },
      create: {
        id,
        programId: prog,
        name: nama,
        year: off(a).getUTCFullYear(),
        quota,
        regStart: off(a),
        regEnd: off(b),
        selectionDate: off(c),
        startDate: off(dd),
        endDate: off(e),
      },
    });
  }

  console.log(`✓ ${BATCHES.length} batch pelatihan dibuat/diperbarui`);

  // ------------------------------------------------------------
  // 4. INSTRUKTUR
  // ------------------------------------------------------------

  for (let i = 0; i < INSTRUCTORS.length; i++) {
    const id = `i${i + 1}`;
    const [name, field, bio, experience] = INSTRUCTORS[i];

    await prisma.instructor.upsert({
      where: { id },
      update: {
        name,
        field,
        bio,
        experience,
        image: `https://picsum.photos/seed/inst-${i + 1}/400/420`,
      },
      create: {
        id,
        name,
        field,
        bio,
        experience,
        image: `https://picsum.photos/seed/inst-${i + 1}/400/420`,
      },
    });
  }

  console.log(`✓ ${INSTRUCTORS.length} instruktur dibuat/diperbarui`);

  // ------------------------------------------------------------
  // 5. ALUMNI
  // ------------------------------------------------------------

  for (let i = 0; i < ALUMNI.length; i++) {
    const id = `al${i + 1}`;

    const [
      prog,
      nama,
      tahun,
      st,
      job,
      usaha,
      cerita,
      pub,
    ] = ALUMNI[i];

    await prisma.alumni.upsert({
      where: { id },
      update: {
        name: nama,
        programId: prog,
        year: tahun,
        afterStatus: st,
        job,
        business: usaha,
        story: cerita,
        published: pub,
        image: `https://picsum.photos/seed/al-${i + 1}/640/700`,
      },
      create: {
        id,
        name: nama,
        programId: prog,
        year: tahun,
        afterStatus: st,
        job,
        business: usaha,
        story: cerita,
        published: pub,
        image: `https://picsum.photos/seed/al-${i + 1}/640/700`,
      },
    });
  }

  console.log(`✓ ${ALUMNI.length} alumni dibuat/diperbarui`);

  // ------------------------------------------------------------
  // 6. PARTNER
  // ------------------------------------------------------------

  for (let i = 0; i < PARTNERS.length; i++) {
    const id = `m${i + 1}`;
    const [name, category, cooperation] = PARTNERS[i];

    await prisma.partner.upsert({
      where: { id },
      update: {
        name,
        category,
        cooperation,
      },
      create: {
        id,
        name,
        category,
        cooperation,
      },
    });
  }

  console.log(`✓ ${PARTNERS.length} mitra dibuat/diperbarui`);

  // ------------------------------------------------------------
  // 7. NEWS
  // ------------------------------------------------------------

  for (let i = 0; i < NEWS.length; i++) {
    const id = `n${i + 1}`;

    const [judul, kat, isi, offd] = NEWS[i];

    const slug = judul
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    await prisma.news.upsert({
      where: { id },
      update: {
        title: judul,
        slug,
        content: isi,
        category: kat,
        status: "publish",
        publishedAt: off(offd),
        image: `https://picsum.photos/seed/news-${i + 1}/900/520`,
      },
      create: {
        id,
        title: judul,
        slug,
        content: isi,
        category: kat,
        status: "publish",
        publishedAt: off(offd),
        image: `https://picsum.photos/seed/news-${i + 1}/900/520`,
      },
    });
  }

  console.log(`✓ ${NEWS.length} berita dibuat/diperbarui`);

  // ------------------------------------------------------------
  // 8. GALLERY
  // ------------------------------------------------------------

  for (let i = 0; i < GALLERY.length; i++) {
    const id = `g${i + 1}`;

    await prisma.gallery.upsert({
      where: { id },
      update: {
        title: GALLERY[i][0],
        category: GALLERY[i][1],
        image: `https://picsum.photos/seed/bpv-g${i + 1}/800/600`,
        date: off(-i),
      },
      create: {
        id,
        title: GALLERY[i][0],
        category: GALLERY[i][1],
        image: `https://picsum.photos/seed/bpv-g${i + 1}/800/600`,
        date: off(-i),
      },
    });
  }

  console.log(`✓ ${GALLERY.length} galeri dibuat/diperbarui`);

  // ------------------------------------------------------------
  // 9. FAQ
  // ------------------------------------------------------------

  for (let i = 0; i < FAQS.length; i++) {
    const id = `f${i + 1}`;

    await prisma.fAQ.upsert({
      where: { id },
      update: {
        question: FAQS[i][0],
        answer: FAQS[i][1],
        category: FAQS[i][2],
      },
      create: {
        id,
        question: FAQS[i][0],
        answer: FAQS[i][1],
        category: FAQS[i][2],
      },
    });
  }

  console.log(`✓ ${FAQS.length} FAQ dibuat/diperbarui`);

  // ------------------------------------------------------------
  // 10. LOWONGAN KERJA
  // ------------------------------------------------------------

  for (let i = 0; i < JOBS.length; i++) {
    const id = `j${i + 1}`;

    const [
      pos,
      comp,
      lok,
      field,
      jenis,
      desc,
      syarat,
      offd,
    ] = JOBS[i];

    await prisma.jobOpportunity.upsert({
      where: { id },
      update: {
        position: pos,
        company: comp,
        location: lok,
        field,
        type: jenis,
        description: desc,
        requirements: syarat,
        deadline: off(offd),
        link: "https://pelatihan.kemnaker.go.id",
      },
      create: {
        id,
        position: pos,
        company: comp,
        location: lok,
        field,
        type: jenis,
        description: desc,
        requirements: syarat,
        deadline: off(offd),
        link: "https://pelatihan.kemnaker.go.id",
      },
    });
  }

  console.log(`✓ ${JOBS.length} lowongan dibuat/diperbarui`);

  // ------------------------------------------------------------
  // 11. AUDIT LOG
  // ------------------------------------------------------------

  const existingSeedLog = await prisma.auditLog.findFirst({
    where: {
      action: "Seed",
    },
  });

  if (!existingSeedLog) {
    await prisma.auditLog.create({
      data: {
        actor: "Sistem",
        action: "Seed",
        detail: `Data awal dimuat: ${PROGRAMS.length} program, ${BATCHES.length} batch`,
      },
    });
  }

  console.log("✓ Audit log diperiksa");

  // ------------------------------------------------------------
  // SELESAI
  // ------------------------------------------------------------

  console.log("");
  console.log("========================================");
  console.log("        SEED DATABASE SELESAI");
  console.log("========================================");
  console.log(`Program       : ${PROGRAMS.length}`);
  console.log(`Batch         : ${BATCHES.length}`);
  console.log(`Instruktur    : ${INSTRUCTORS.length}`);
  console.log(`Alumni        : ${ALUMNI.length}`);
  console.log(`Mitra         : ${PARTNERS.length}`);
  console.log(`Berita        : ${NEWS.length}`);
  console.log(`Galeri        : ${GALLERY.length}`);
  console.log(`FAQ           : ${FAQS.length}`);
  console.log(`Lowongan      : ${JOBS.length}`);
  console.log(`User          : ${USERS.length}`);
  console.log("========================================");
}

main()
  .catch((error) => {
    console.error("");
    console.error("❌ SEED GAGAL");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

