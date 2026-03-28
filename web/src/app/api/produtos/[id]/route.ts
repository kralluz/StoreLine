import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) {
      return NextResponse.json({ error: "Produto nao encontrado" }, { status: 404 });
    }

    if (!product.isActive) {
      return NextResponse.json({ error: "Produto nao encontrado" }, { status: 404 });
    }

    return NextResponse.json({ product }, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar produto:", error);
    return NextResponse.json({ error: "Erro ao buscar produto" }, { status: 500 });
  }
}
