import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const clients = await prisma.client.findMany({ orderBy: { nom: "asc" } });
  return NextResponse.json(clients);
}

export async function POST(req: Request) {
  const body = await req.json();
  const client = await prisma.client.create({ data: body });
  return NextResponse.json(client, { status: 201 });
}
