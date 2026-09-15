import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      error: "Layanan cek status pendaftaran sudah tidak digunakan.",
    },
    { status: 410 }
  );
}
