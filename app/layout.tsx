
import Chatbot from "@/components/Chatbot";
import type { Metadata } from "next";
import { Bricolage_Grotesque, Plus_Jakarta_Sans } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";
import { SITE } from "@/lib/constants";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
});

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "BPVP Kupang — Balai Pelatihan Vokasi dan Produktivitas Kupang",
    template: "%s — BPVP Kupang",
  },
  description:
    "Portal resmi BPVP Kupang: program pelatihan vokasi, jadwal, pendaftaran online, lowongan kerja, dan informasi layanan untuk masyarakat NTT.",
  keywords: [
    "BPVP Kupang",
    "Balai Pelatihan Vokasi Kupang",
    "pelatihan gratis Kupang",
    "pelatihan vokasi NTT",
    "pelatihan Kemnaker Kupang",
  ],
  openGraph: {
    title: "BPVP Kupang",
    description:
      "Dari Belajar, Menjadi Kompeten, Siap Kerja dan Berwirausaha.",
    url: SITE,
    locale: "id_ID",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${display.variable} ${sans.variable}`}>
      <body>
        <a href="#utama" className="skip-link btn-o btn btn-sm">
          Langsung ke konten utama
        </a>

        <Navbar />

        <main id="utama">{children}</main>

        <Footer />

        <Chatbot />
      </body>
    </html>
  );
}

