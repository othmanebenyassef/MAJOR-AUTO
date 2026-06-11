import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { generateNumero } from "@/lib/utils";

export async function GET() {
  const livraisons = await prisma.livraison.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(livraisons);
}

export async function POST(req: Request) {
  const body = await req.json();
  const livraison = await prisma.livraison.create({
    data: { ...body, numero: generateNumero("LIV") },
  });
  return NextResponse.json(livraison, { status: 201 });
}
