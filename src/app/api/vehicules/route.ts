import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const vehicules = await prisma.vehicule.findMany({
    orderBy: { createdAt: "desc" },
    include: { client: true },
  });
  return NextResponse.json(vehicules);
}

export async function POST(req: Request) {
  const body = await req.json();
  const vehicule = await prisma.vehicule.create({ data: body });
  return NextResponse.json(vehicule, { status: 201 });
}
