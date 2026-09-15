import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      error: "Layanan export peserta sudah tidak digunakan.",
    },
    { status: 410 }
  );
}
