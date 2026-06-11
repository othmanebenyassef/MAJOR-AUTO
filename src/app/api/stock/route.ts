import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const pieces = await prisma.pieceDetachee.findMany({ orderBy: { nom: "asc" } });
  return NextResponse.json(pieces);
}

export async function POST(req: Request) {
  const body = await req.json();
  const piece = await prisma.pieceDetachee.create({ data: body });
  return NextResponse.json(piece, { status: 201 });
}
