import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { generateNumero } from "@/lib/utils";

export async function GET() {
  const devis = await prisma.devis.findMany({
    orderBy: { createdAt: "desc" },
    include: { client: true, vehicule: true },
  });
  return NextResponse.json(devis);
}

export async function POST(req: Request) {
  const body = await req.json();
  const devis = await prisma.devis.create({
    data: { ...body, numero: generateNumero("DEV") },
  });
  return NextResponse.json(devis, { status: 201 });
}
