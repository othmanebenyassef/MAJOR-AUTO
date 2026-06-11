import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const entrees = await prisma.journalEntree.findMany({ orderBy: { date: "desc" } });
  return NextResponse.json(entrees);
}

export async function POST(req: Request) {
  const body = await req.json();
  const entree = await prisma.journalEntree.create({ data: body });
  return NextResponse.json(entree, { status: 201 });
}
