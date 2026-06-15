import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const vehicules = await prisma.vehicule.findMany({
    orderBy: { createdAt: "desc" },
    include: { client: true, _count: { select: { ordres: true } } },
  });
  return NextResponse.json(vehicules);
}

export async function POST(req: Request) {
  try {
    const { immatriculation, marque, modele, annee, couleur, kilometrage, vin, carburant, clientId } = await req.json();
    const vehicule = await prisma.vehicule.create({
      data: {
        immatriculation: immatriculation.toUpperCase(),
        marque, modele,
        annee: Number(annee),
        couleur: couleur || null,
        kilometrage: kilometrage ? Number(kilometrage) : null,
        vin: vin || null,
        carburant: carburant || null,
        clientId,
      },
    });
    return NextResponse.json(vehicule, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
