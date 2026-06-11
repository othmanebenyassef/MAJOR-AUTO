import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const charges = await prisma.charge.findMany({ orderBy: { date: "desc" } });
  return NextResponse.json(charges);
}

export async function POST(req: Request) {
  const body = await req.json();
  const charge = await prisma.charge.create({ data: body });
  return NextResponse.json(charge, { status: 201 });
}
