import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const fournisseurs = await prisma.fournisseur.findMany({ orderBy: { nom: "asc" } });
  return NextResponse.json(fournisseurs);
}

export async function POST(req: Request) {
  const body = await req.json();
  const fournisseur = await prisma.fournisseur.create({ data: body });
  return NextResponse.json(fournisseur, { status: 201 });
}
