# DEPLOY — BPVP Kupang

## A. Deploy gratis (GitHub + Vercel + Neon) ± 30 menit

### 1. GitHub
    git init && git add . && git commit -m "BPVP Kupang v1"
    git branch -M main
    git remote add origin https://github.com/USERNAME/bpvp-kupang.git
    git push -u origin main
  Pastikan `.env` TIDAK ikut terkirim (sudah di .gitignore).

### 2. Database gratis: Neon (neon.tech)
  - Daftar → Create project (region: Singapore) → salin **Pooled connection string**
    (menu "Connection pooling", berakhiran `-pooler...` + `?sslmode=require`).
  - Inisialisasi dari komputer lokal:
      DATABASE_URL="postgres://...pooler..." npm run db:push
      DATABASE_URL="postgres://...pooler..." npm run db:seed

### 3. Vercel (vercel.com)
  - Add New → Project → Import repo `bpvp-kupang`.
  - Environment Variables (Production + Preview):
      DATABASE_URL       = pooled connection string Neon
      SESSION_SECRET     = hasil `openssl rand -hex 32`
      ADMIN_PASSWORD     = password KUAT baru (bukan demo1234!)
      NEXT_PUBLIC_SITE_URL = https://NAMA-ANDA.vercel.app
  - Deploy. `postinstall` otomatis menjalankan `prisma generate`.
  - URL publik Anda: https://bpvp-kupang.vercel.app
    (bila nama terpakai: bpvpkupang, bpvp-kupang-ntt, bpvpkupang-resmi — bisa
    diubah di Settings → Domains).

### 4. Uji dari HP dengan jaringan seluler (bukan WiFi)
  1. Buka URL dari Chrome HP → beranda tampil, statistik sesuai DB.
  2. /pendaftaran → daftar → catat nomor registrasi.
  3. /cek-status → nomor tadi muncul SUBMITTED.
  4. /admin → login → pendaftar muncul → ubah status → cek dari perangkat lain.

## B. Domain resmi www.bpvpkupang.com (setelah domain dibeli/tersedia)
  DOMAIN → DNS → HOSTING → WEBSITE:
  1. Vercel: Project → Settings → Domains → Add `www.bpvpkupang.com`
     dan `bpvpkupang.com` → ikuti instruksi DNS yang muncul.
  2. Di panel DNS registrar (tempat domain dibeli), tambah:
      - CNAME  www  →  cname.vercel-dns.com
      - A       @   →  76.76.21.21
  3. Tunggu propagasi DNS (menit s.d. 24 jam). SSL Let's Encrypt
     diterbitkan otomatis oleh Vercel; HTTP dialihkan ke HTTPS.
  4. Update `NEXT_PUBLIC_SITE_URL` = https://www.bpvpkupang.com → Redeploy.
  5. Daftarkan https://www.bpvpkupang.com/sitemap.xml ke Google Search Console.

## C. Backup
  - Utama : `pg_dump "<DATABASE_URL>" -F c -f bpvp-$(date +%F).dump`
            (jalankan berkala dari komputer admin; simpan di 2 lokasi).
  - Manual: /admin/sistem → Unduh backup (JSON).
  - Restore JSON: /admin/sistem → Restore dari file (Super Admin).

## D. Checklist pasca-live (WAJIB)
  [ ] Ganti password semua akun demo; nonaktifkan akun demo tak terpakai
  [ ] Ganti data kontak placeholder (telepon/alamat/medsos) di Footer & Kontak
  [ ] Ganti foto penanda picsum dengan foto asli via panel admin
  [ ] Uji RBAC: login sebagai viewer → pastikan tombol tambah/ubah hilang
      DAN request POST langsung via curl ditolak 403