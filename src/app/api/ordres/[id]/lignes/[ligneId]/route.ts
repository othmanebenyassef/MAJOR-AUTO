import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(_req: Request, { params }: { params: Promise<{ ligneId: string }> }) {
  const { ligneId } = await params;
  await prisma.ligneOrdre.delete({ where: { id: ligneId } });
  return NextResponse.json({ ok: true });
}
