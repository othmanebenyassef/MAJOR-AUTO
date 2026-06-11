import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { generateNumero } from "@/lib/utils";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: ordreId } = await params;

  const ordre = await prisma.ordreReparation.findUnique({
    where: { id: ordreId },
    include: { vehicule: true, lignes: true },
  });

  if (!ordre) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const montantHT = ordre.lignes.reduce((s, l) => s + l.quantite * l.prixUnitaire, 0);
  const tva = 20;
  const montantTTC = montantHT * 1.2;

  const client = await prisma.vehicule.findUnique({
    where: { id: ordre.vehiculeId },
    select: { clientId: true },
  });

  const facture = await prisma.facture.create({
    data: {
      numero: generateNumero("FAC"),
      clientId: client!.clientId,
      ordreId,
      montantHT,
      tva,
      montantTTC,
      dateEcheance: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  return NextResponse.json(facture, { status: 201 });
}
