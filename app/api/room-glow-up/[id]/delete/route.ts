import { NextResponse } from "next/server";
import { deleteRoomGlowUpAnalysis } from "@/lib/room-glow-up/store";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await deleteRoomGlowUpAnalysis(id);
  return NextResponse.json({ ok: true });
}
