import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const clients = await prisma.client.findMany({
    orderBy: { nom: "asc" },
    include: { _count: { select: { vehicules: true } } },
  });
  return NextResponse.json(clients);
}

export async function POST(req: Request) {
  try {
    const { nom, prenom, telephone, email, adresse, ville, ice } = await req.json();
    const client = await prisma.client.create({
      data: { nom, prenom, telephone, email: email || null, adresse: adresse || null, ville: ville || null, ice: ice || null },
    });
    return NextResponse.json(client, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
