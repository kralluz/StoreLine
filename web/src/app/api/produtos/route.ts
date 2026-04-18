import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/request-auth";
import { ProductCreateSchema } from "@/lib/schemas";
import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const all = url.searchParams.get("all") === "1";

    if (all) {
      const admin = await requireAdmin(request);
      if (!admin.ok) return admin.response;
    }

    const products = await prisma.product.findMany({
      where: all ? undefined : { isActive: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    console.error("Erro ao listar produtos:", error);
    return NextResponse.json({ error: "Erro ao listar produtos" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    if (!admin.ok) return admin.response;

    const body = await request.json();
    const validation = ProductCreateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Dados invalidos", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { name, description, imageUrl, price, stock, isActive } = validation.data;

    const product = await prisma.product.create({
      data: {
        name,
        description,
        imageUrl,
        price: new Prisma.Decimal(price),
        stock,
        isActive,
      },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar produto:", error);
    return NextResponse.json({ error: "Erro ao criar produto" }, { status: 500 });
  }
}
