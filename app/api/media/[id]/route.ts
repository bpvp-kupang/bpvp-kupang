import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      error: "Layanan media lama sudah tidak digunakan.",
    },
    { status: 410 }
  );
}
