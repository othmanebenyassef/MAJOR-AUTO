import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const entrees = await prisma.journalEntree.findMany({ orderBy: { date: "desc" } });
  return NextResponse.json(entrees);
}

export async function POST(req: Request) {
  try {
    const { type, categorie, libelle, montant, date, compte, reference, notes } = await req.json();
    const entree = await prisma.journalEntree.create({
      data: {
        type,
        categorie: categorie || "Autre",
        libelle,
        montant: Number(montant),
        date: new Date(date),
        compte: compte || "Caisse",
        reference: reference || null,
        notes: notes || null,
      },
    });
    return NextResponse.json(entree, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
