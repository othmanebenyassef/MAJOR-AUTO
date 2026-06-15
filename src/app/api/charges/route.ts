import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const charges = await prisma.charge.findMany({ orderBy: { date: "desc" } });
  return NextResponse.json(charges);
}

export async function POST(req: Request) {
  try {
    const { libelle, categorie, montant, date, recurrente, periodicite, notes } = await req.json();
    const charge = await prisma.charge.create({
      data: {
        libelle,
        categorie,
        montant: Number(montant),
        date: new Date(date),
        recurrente: Boolean(recurrente),
        periodicite: recurrente ? (periodicite || null) : null,
        notes: notes || null,
      },
    });
    return NextResponse.json(charge, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
