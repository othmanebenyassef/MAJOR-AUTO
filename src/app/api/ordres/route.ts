import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { generateNumero } from "@/lib/utils";

export async function GET() {
  const ordres = await prisma.ordreReparation.findMany({
    orderBy: { createdAt: "desc" },
    include: { vehicule: { include: { client: true } }, technicien: true },
  });
  return NextResponse.json(ordres);
}

export async function POST(req: Request) {
  const { vehiculeId, technicienId, description, kilometrage, services } = await req.json();
  const ordre = await prisma.ordreReparation.create({
    data: {
      numero: generateNumero("OR"),
      vehiculeId,
      technicienId: technicienId || null,
      description,
      kilometrage,
      typeService: JSON.stringify(services),
    },
  });
  return NextResponse.json(ordre, { status: 201 });
}
