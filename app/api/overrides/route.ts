import { NextResponse } from "next/server";
import { setOverride } from "@/lib/overrides";

export async function POST(request: Request) {
  const { id, data } = await request.json();
  setOverride(id, data);
  return NextResponse.json({ ok: true });
}