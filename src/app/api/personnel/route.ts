import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const personnel = await prisma.personnel.findMany({
    orderBy: { nom: "asc" },
    include: { _count: { select: { ordres: true } } },
  });
  return NextResponse.json(personnel);
}

export async function POST(req: Request) {
  try {
    const { nom, prenom, poste, telephone, email, salaire, dateEmbauche } = await req.json();
    const employe = await prisma.personnel.create({
      data: {
        nom, prenom, poste,
        telephone: telephone || null,
        email: email || null,
        salaire: salaire ? Number(salaire) : null,
        dateEmbauche: dateEmbauche ? new Date(dateEmbauche) : null,
      },
    });
    return NextResponse.json(employe, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
