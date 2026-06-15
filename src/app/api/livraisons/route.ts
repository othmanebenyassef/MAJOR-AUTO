import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { generateNumero } from "@/lib/utils";

export async function GET() {
  const livraisons = await prisma.livraison.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(livraisons);
}

export async function POST(req: Request) {
  try {
    const { clientNom, clientTel, adresse, vehiculeInfo, datePrevu, notes } = await req.json();
    const livraison = await prisma.livraison.create({
      data: {
        numero: generateNumero("LIV"),
        clientNom, clientTel, adresse, vehiculeInfo,
        datePrevu: new Date(datePrevu),
        notes: notes || null,
      },
    });
    return NextResponse.json(livraison, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
