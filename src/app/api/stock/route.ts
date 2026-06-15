import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const pieces = await prisma.pieceDetachee.findMany({
    orderBy: { nom: "asc" },
    include: { fournisseur: true },
  });
  return NextResponse.json(pieces);
}

export async function POST(req: Request) {
  try {
    const { reference, nom, description, categorie, quantiteStock, seuilAlerte, prixAchat, prixVente, emplacement } = await req.json();
    const piece = await prisma.pieceDetachee.create({
      data: { reference, nom, description: description || null, categorie, quantiteStock: Number(quantiteStock) || 0, seuilAlerte: Number(seuilAlerte) || 5, prixAchat: Number(prixAchat), prixVente: Number(prixVente), emplacement: emplacement || null },
    });
    return NextResponse.json(piece, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
