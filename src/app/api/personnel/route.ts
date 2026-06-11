import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const personnel = await prisma.personnel.findMany({
    where: { actif: true },
    orderBy: { nom: "asc" },
  });
  return NextResponse.json(personnel);
}

export async function POST(req: Request) {
  const body = await req.json();
  const employe = await prisma.personnel.create({ data: body });
  return NextResponse.json(employe, { status: 201 });
}
