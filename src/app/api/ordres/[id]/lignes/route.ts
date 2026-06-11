import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: ordreId } = await params;
  const { type, description, quantite, prixUnitaire, pieceId } = await req.json();

  if (type === "PIECE" && pieceId) {
    await prisma.pieceDetachee.update({
      where: { id: pieceId },
      data: { quantiteStock: { decrement: Math.ceil(quantite) } },
    });
    await prisma.mouvementStock.create({
      data: { pieceId, type: "SORTIE", quantite: Math.ceil(quantite), motif: `Ordre ${ordreId}` },
    });
  }

  const ligne = await prisma.ligneOrdre.create({
    data: { ordreId, type, description, quantite, prixUnitaire, pieceId: pieceId || null },
  });
  return NextResponse.json(ligne, { status: 201 });
}
