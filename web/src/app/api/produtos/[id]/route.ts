import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, getRequestUser } from "@/lib/request-auth";
import { ProductUpdateSchema } from "@/lib/schemas";
import { Prisma } from "@prisma/client";

type Params = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) {
      return NextResponse.json({ error: "Produto nao encontrado" }, { status: 404 });
    }

    if (!product.isActive) {
      const user = await getRequestUser(request);
      if (!user || user.role !== "ADMIN") {
        return NextResponse.json({ error: "Produto nao encontrado" }, { status: 404 });
      }
    }

    return NextResponse.json({ product }, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar produto:", error);
    return NextResponse.json({ error: "Erro ao buscar produto" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const admin = await requireAdmin(request);
    if (!admin.ok) return admin.response;

    const { id } = await params;
    const body = await request.json();

    const validation = ProductUpdateSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Dados invalidos", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const data = validation.data;

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.description !== undefined ? { description: data.description } : {}),
        ...(data.imageUrl !== undefined ? { imageUrl: data.imageUrl } : {}),
        ...(data.price !== undefined ? { price: new Prisma.Decimal(data.price) } : {}),
        ...(data.stock !== undefined ? { stock: data.stock } : {}),
        ...(data.isActive !== undefined ? { isActive: data.isActive } : {}),
      },
    });

    return NextResponse.json({ product }, { status: 200 });
  } catch (error) {
    console.error("Erro ao atualizar produto:", error);

    const message =
      error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025"
        ? "Produto nao encontrado"
        : "Erro ao atualizar produto";

    const status =
      error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025"
        ? 404
        : 500;

    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const admin = await requireAdmin(request);
    if (!admin.ok) return admin.response;

    const { id } = await params;

    await prisma.product.delete({ where: { id } });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("Erro ao remover produto:", error);

    const message =
      error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025"
        ? "Produto nao encontrado"
        : "Erro ao remover produto";

    const status =
      error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025"
        ? 404
        : 500;

    return NextResponse.json({ error: message }, { status });
  }
}
