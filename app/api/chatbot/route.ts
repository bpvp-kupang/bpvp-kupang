import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { batchStatus } from "@/lib/batch";
import { limited } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  if (
    limited(
      "chat:" + (req.headers.get("x-forwarded-for") || "local"),
      30,
      60e3
    )
  ) {
    return NextResponse.json({
      reply: "Sedang banyak pertanyaan. Mohon tunggu sebentar.",
    });
  }

  const { message = "" } = await req.json().catch(() => ({}));
  const q = String(message).toLowerCase();

  const batches = await prisma.trainingBatch.findMany({
    where: {
      year: 2026,
      program: {
        status: "aktif",
      },
    },
    include: {
      program: true,
    },
  });

  const open = batches.filter(
    (b) => batchStatus(b) === "open"
  );

  const R = (
    reply: string,
    link?: { href: string; label: string }
  ) =>
    NextResponse.json({
      reply,
      link,
    });

  // SAPAAN
  if (/(^|\s)(hai|halo|hello)/.test(q)) {
    return R(
      "Halo! Saya Asisten BPVP Kupang. Saya dapat membantu memberikan informasi tentang program pelatihan, jadwal/batch, persyaratan, sertifikat, biaya pelatihan, profil, dan kontak BPVP Kupang."
    );
  }

  // TENTANG BPVP
  if (/apa itu|tentang bpvp|siapa bpvp|profil bpvp/.test(q)) {
    return R(
      "BPVP Kupang merupakan Balai Pelatihan Vokasi dan Produktivitas di bawah Kementerian Ketenagakerjaan RI yang memberikan layanan pelatihan vokasi untuk meningkatkan kompetensi dan produktivitas masyarakat, khususnya di wilayah Nusa Tenggara Timur.",
      {
        href: "/profil",
        label: "Lihat Profil BPVP",
      }
    );
  }

  // PROGRAM PELATIHAN
  if (
    /program|pelatihan|jurusan|keahlian|bidang/.test(q)
  ) {
    return R(
      `BPVP Kupang menyediakan berbagai program pelatihan vokasi di bidang digital & perkantoran, pariwisata & hospitality, fashion, otomotif, dan teknik. Saat ini terdapat ${batches.length} batch pelatihan tahun 2026.`,
      {
        href: "/program",
        label: "Lihat Program Pelatihan",
      }
    );
  }

  // JADWAL / BATCH
  if (/jadwal|batch|gelombang|kapan|tanggal/.test(q)) {
    const names = open
      .slice(0, 3)
      .map((b) => b.program.name)
      .join(", ");

    return R(
      `Saat ini terdapat ${open.length} batch pelatihan yang sedang dibuka${
        names
          ? ", antara lain: " + names
          : ""
      }. Jadwal lengkap dapat dilihat pada halaman Jadwal Pelatihan.`,
      {
        href: "/jadwal",
        label: "Buka halaman Jadwal",
      }
    );
  }

  // SYARAT
  if (
    /syarat|persyaratan|umur|usia|pendidikan|dokumen/.test(q)
  ) {
    return R(
      "Persyaratan umum pelatihan antara lain usia maksimal 31 tahun, pendidikan terakhir minimal SD sesuai ketentuan program, tidak sedang mengikuti pelatihan lain, serta memiliki dokumen dan data yang diperlukan sesuai persyaratan program. Persyaratan lengkap dapat dilihat pada detail masing-masing program.",
      {
        href: "/program",
        label: "Lihat Program",
      }
    );
  }

  // SERTIFIKAT
  if (/sertifikat|sertifikasi|kompetensi/.test(q)) {
    return R(
      "Peserta yang menyelesaikan pelatihan sesuai ketentuan dapat memperoleh sertifikat pelatihan. Uji sertifikasi kompetensi tersedia bagi program atau peserta tertentu sesuai skema dan persyaratan yang berlaku."
    );
  }

  // BIAYA
  if (/gratis|biaya|bayar|berbayar|tarif/.test(q)) {
    return R(
      "Pelatihan vokasi yang diselenggarakan melalui program pemerintah pada BPVP Kupang dapat diikuti tanpa biaya pelatihan bagi peserta yang memenuhi ketentuan dan lolos seleksi. Informasi resmi setiap program dapat dilihat melalui kanal BPVP Kupang."
    );
  }

  // DUNIA KERJA
  if (
    /kerja|pekerjaan|wirausaha|usaha|karir|karier/.test(q)
  ) {
    return R(
      "Pelatihan vokasi BPVP Kupang dirancang untuk meningkatkan kompetensi, produktivitas, kesiapan kerja, dan kemampuan berwirausaha. Setelah mengikuti pelatihan, peserta diharapkan memiliki kompetensi yang dapat diterapkan di dunia kerja maupun usaha."
    );
  }

  // KONTAK
  if (
    /kontak|alamat|telepon|lokasi|email|dimana|di mana/.test(q)
  ) {
    return R(
      "BPVP Kupang beralamat di Jl. Thamrin No. 03, Kelurahan Kayu Putih, Kecamatan Oebobo, Kota Kupang, Nusa Tenggara Timur. Email: bpvpkupang@gmail.com. Jam pelayanan Senin–Kamis 08.00–16.00, Jumat 08.00–16.30, dan Sabtu 08.00–12.00.",
      {
        href: "/kontak",
        label: "Lihat Kontak BPVP",
      }
    );
  }

  // JAM PELAYANAN
  if (
    /jam|buka|tutup|pelayanan|hari kerja/.test(q)
  ) {
    return R(
      "Jam pelayanan BPVP Kupang: Senin–Kamis 08.00–16.00, Jumat 08.00–16.30, dan Sabtu 08.00–12.00."
    );
  }

  // PEKERJAAN TIDAK OTOMATIS
  if (
    /otomatis.*(kerja|pekerjaan)|langsung.*pekerjaan/.test(q)
  ) {
    return R(
      "BPVP tidak menjanjikan pekerjaan otomatis setelah pelatihan. BPVP membekali peserta dengan kompetensi, pengetahuan, keterampilan, dan kesiapan untuk memasuki dunia kerja atau mengembangkan usaha."
    );
  }

  // FALLBACK
  return R(
    "Maaf, informasi tersebut belum tersedia dalam Asisten BPVP Kupang. Silakan lihat Program Pelatihan, Jadwal, atau hubungi BPVP Kupang melalui halaman Kontak.",
    {
      href: "/kontak",
      label: "Kontak BPVP Kupang",
    }
  );
}