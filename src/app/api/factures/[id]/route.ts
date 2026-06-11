import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const facture = await prisma.facture.update({ where: { id }, data: body });
  return NextResponse.json(facture);
}
