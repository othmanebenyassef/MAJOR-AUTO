import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const data: Record<string, unknown> = { ...body };
  if (body.statut === "TERMINE" || body.statut === "LIVRE") {
    data.dateSortie = new Date();
  }
  const ordre = await prisma.ordreReparation.update({ where: { id }, data });
  return NextResponse.json(ordre);
}
