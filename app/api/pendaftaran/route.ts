import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      error: "Layanan pendaftaran sudah tidak digunakan.",
    },
    { status: 410 }
  );
}
